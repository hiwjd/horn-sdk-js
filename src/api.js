(function(exports, HORN){

    function API(config) {
        if(!(config instanceof HORN.Config)) {
            throw new Error("param config is not HORN.Config");
        }
        this.cfg = config;

        this.conn = new HORN.Connection(config);
    }

    /**
     * 发送消息，这里的消息不止是对话的消息，包括和服务端交互的各种消息
     * 目前有：文本消息，图片消息，文件消息，发起对话，加入对话
     * @param {[type]}   msg   消息对象，具体的格式可以参见下方各消息体
     * @param {Function} cb    正确回调
     * @param {[type]}   cberr 错误回调
     */
    API.prototype.SendMsg = function(msg, cb, cberr) {
        HORN.Http.Post(this.cfg.Host()+"/message", JSON.stringify(msg), cb, cberr);
    }

    /**
     * 客服邀请访客对话
     * @param {[type]}   vid   访客ID
     * @param {[type]}   tid   访客访问ID
     * @param {Function} cb    正确回调
     * @param {[type]}   cberr 错误回调
     */
    API.prototype.InviteVisitorChat = function(vid, tid, cb, cberr) {
        if(!this.cfg.IsStaff()) {
            throw new Error("only staff can invite visitor chat");
        }

        var chat = {
            oid: this.cfg.OID(),
            sid: this.cfg.UID(),
            vid: vid,
            tid: tid
        };

        this.RequestChat(chat, cb, cberr);
    }

    /**
     * 访客请求客服对话
     * @param {[type]}   sid   客服ID
     * @param {Function} cb    正确回调
     * @param {[type]}   cberr 错误回调
     */
    API.prototype.RequestStaffChat = function(sid, cb, cberr) {
        if(!this.cfg.IsVisitor()) {
            throw new Error("only visitor can request staff chat");
        }

        var chat = {
            oid: this.cfg.OID(),
            vid: this.cfg.UID(),
            tid: this.cfg.TID(),
            sid: sid
        };

        this.RequestChat(chat, cb, cberr);
    }

    /**
     * 发起对话
     * @param {[type]}   chat  对话对象{oid:"组织ID", sid:"客服ID", vid:"访客ID", tid:"访问ID"}
     * @param {Function} cb    正确回调
     * @param {[type]}   cberr 错误回调
     */
    API.prototype.RequestChat = function(chat, cb, cberr) {
        var msg = {
            "type": "request_chat",
            "oid": this.cfg.OID(),
            "from": this._from(),
            "event": {
                "chat": chat
            }
        };

        this.SendMsg(msg, cb, cberr);
    }

    /**
     * 加入对话
     * @param {[type]}   chatID 对话ID
     * @param {Function} cb     正确回调
     * @param {[type]}   cberr  错误回调
     */
    API.prototype.JoinChat = function(chatID, cb, cberr) {
        var msg = {
            "type": "join_chat",
            "oid": this.cfg.OID(),
            "from": this._from(),
            "event": {
                "cid": chatID
            }
        };

        this.SendMsg(msg, cb, cberr);
    }

    /**
     * 文本消息
     * @param {[type]}   chatID 对话ID
     * @param {[type]}   text   消息内容
     * @param {Function} cb     正确回调
     * @param {[type]}   cberr  错误回调
     */
    API.prototype.SendMsgText = function(chatID, text, cb, cberr) {
        var msg = {
            "type": "text",
            "oid": this.cfg.OID(),
            "from": this._from(),
            "cid": chatID,
            "text": text
        };

        this.SendMsg(msg, cb, cberr);
    }

    /**
     * 文件消息
     * @param {[type]}   chatID 对话ID
     * @param {[type]}   file   文件对象 {"name":"文件名", "size":文件大小, "src":"文件地址"}
     * @param {Function} cb     正确回调
     * @param {[type]}   cberr  错误回调
     */
    API.prototype.SendMsgFile = function(chatID, file, cb, cberr) {
        var msg = {
            "type": "file",
            "oid": this.cfg.OID(),
            "from": this._from(),
            "cid": chatID,
            "file": file
        };

        this.SendMsg(msg, cb, cberr);
    }

    /**
     * 图片消息
     * @param {[type]}   chatID 对话ID
     * @param {[type]}   image  图片对象 {"src":"图片地址", "size":图片大小, "width":图片宽度, "height":图片高度}
     * @param {Function} cb     正确回调
     * @param {[type]}   cberr  错误回调
     */
    API.prototype.SendMsgImage = function(chatID, image, cb, cberr) {
        var msg = {
            "type": "image",
            "oid": this.cfg.OID(),
            "from": this._from(),
            "cid": chatID,
            "image": image
        };

        this.SendMsg(msg, cb, cberr);
    }

    /**
     * 心跳
     * @param {[type]} cberr [description]
     */
    API.prototype.StartHeartbeat = function(cberr) {
        var msg = {
            oid: this.cfg.OID(),
            uid: this.cfg.UID(),
            fp: this.cfg.FP(),
            tid: this.cfg.TID()
        };
        var _self = this;
        HORN.Http.Get(this.cfg.Host()+"/heartbeat", msg, function(res) {
            var n = 0;
            if(res.code == 0) {
                n = res.interval-3;
            } else {
                n = cberr(res);
            }

            if(n > 0) {
                setTimeout(function() {
                    _self.StartHeartbeat(cberr);
                }, n*1000);
            }
        }, function(error) {
            var n = cberr(error);
            if(n > 0) {
                setTimeout(function() {
                    _self.StartHeartbeat(cberr);
                }, n*1000);
            }
        });
    }

    API.prototype.GetOnlineStaffList = function(cb, cberr) {
        HORN.Http.Get(this.cfg.Host()+"/staff/online", {oid: this.cfg.OID()}, cb, cberr);
    }

    API.prototype.GetOnlineUserList = function(cb, cberr) {
        HORN.Http.Get(this.cfg.Host()+"/b/users/online", {oid: this.cfg.OID()}, cb, cberr);
    }

    API.prototype.GetTags = function(cb, cberr) {
        HORN.Http.Get(this.cfg.Host()+"/b/tags", {oid: this.cfg.OID()}, cb, cberr);
    }

    API.prototype.GetTagsByVid = function(vid, cb, cberr) {
        HORN.Http.Get(this.cfg.Host()+"/b/visitor/tags", {oid: this.cfg.OID(), vid: vid}, cb, cberr);
    }

    API.prototype.AttachTag = function(vid, tagId, cb, cberr) {
        var data = {
            oid: this.cfg.OID(), 
            vid: vid, 
            tag_id: tagId
        };
        HORN.Http.Post(this.cfg.Host()+"/b/tag/attach", data, cb, cberr);
    }

    API.prototype.DetachTag = function(vid, tagId, cb, cberr) {
        var data = {
            oid: this.cfg.OID(), 
            vid: vid, 
            tag_id: tagId
        };
        HORN.Http.Post(this.cfg.Host()+"/b/tag/detach", data, cb, cberr);
    }

    API.prototype.SaveTag = function(tagId, name, color, cb, cberr) {
        var data = {
            oid: this.cfg.OID(), 
            tag_id: tagId,
            name: name,
            color: color
        };
        HORN.Http.Post(this.cfg.Host()+"/b/tag/save", data, cb, cberr);
    }

    API.prototype.DeleteTag = function(tagId, cb, cberr) {
        var data = {
            oid: this.cfg.OID(), 
            tag_id: tagId
        };
        HORN.Http.Post(this.cfg.Host()+"/b/tag/delete", data, cb, cberr);
    }

    API.prototype.SaveStaff = function(staff, cb, cberr) {
        staff.oid = this.cfg.OID();
        HORN.Http.Post(this.cfg.Host()+"/b/staff/save", staff, cb, cberr);
    }

    API.prototype.FetchStaffs = function(condition, cb, cberr) {
        if(typeof condition != "object") {
            condition = {};
        }
        if(typeof condition.page == "undefined") {
            condition.page = 1;
        }
        if(typeof condition.size == "undefined") {
            condition.size = 15;
        }
        condition.oid = this.cfg.OID();

        HORN.Http.Get(this.cfg.Host()+"/b/staffs", condition, cb, cberr);
    }

    API.prototype.EditPass = function(sid, pwd, cb, cberr) {
        var data = {
            oid: this.cfg.OID(),
            sid: sid,
            pwd: pwd
        };

        HORN.Http.Post(this.cfg.Host()+"/b/staff/editpwd", data, cb, cberr);
    }

    API.prototype.UpdateVisitorInfo = function(vid, info, cb, cberr) {
        var data = info;
        data.oid = this.cfg.OID();
        data.vid = vid;

        HORN.Http.Post(this.cfg.Host()+"/b/visitor/edit", data, cb, cberr);
    }

    API.prototype.OnRestore = function(cb, ctx) {
        this.conn.on("restore", cb, ctx);
    }

    API.prototype.OnMessage = function(cb, ctx) {
        this.conn.on("message", cb, ctx);
    }

    API.prototype.OnError = function(cb, ctx) {
        this.conn.on("error", cb, ctx);
    }

    API.prototype.Start = function() {
        this.conn.start();
    }

    API.prototype._from = function() {
        return {
            "oid": this.cfg.OID(),
            "uid": this.cfg.UID(),
            "name": this.cfg.Name(),
            "role": this.cfg.Role(),
            "tid": this.cfg.TID()
        };
    }

    API.InitFromConfig = function(config) {
        return new API(config);
    }

    HORN.API = API;

})(window, window.HORN);