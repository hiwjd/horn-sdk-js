(function(exports, HORN){
    var api = null,
        events = {};

    // 接口地址
    HORN.HOST = "http://app.horn.com:9092/api";
    // 组织ID
    HORN.OID = "";

    /**
     * 设置配置
     * 客服端可以直接HORN.Init
     * @param {[type]} args [description]
     */
    HORN.Init = function(args) {
        args.host = HORN.HOST;
        args.oid = HORN.OID;
        var cfg = new HORN.Config(args);
        api = HORN.API.InitFromConfig(cfg);

        if(typeof events["restore"] != "undefined") {
            var ee = events["restore"];
            api.OnRestore(ee.cb, ee.ctx);
        }
        if(typeof events["message"] != "undefined") {
            var ee = events["message"];
            api.OnMessage(ee.cb, ee.ctx);
        }
        if(typeof events["error"] != "undefined") {
            var ee = events["error"];
            api.OnError(ee.cb, ee.ctx);
        }
        api.Start();
    };

    /**
     * 上发访问信息，同时定位访客身份
     * 访客端需要通过先调用HORN.Track方法定位uid，然后在cb中HORN.Init
     * @param {Function} cb    正确的回调
     * @param {[type]}   cberr 出错的回调
     */
    HORN.Track = function(cb, cberr) {
        var vid = Cookies.get("horn-vid"),
            host = HORN.HOST,
            param = {
                oid: HORN.OID,
                vid: vid,
                url: window.location.href,
                title: window.document.title,
                referer: window.document.referrer,
                os: HORN.utils.getOS(),
                browser: HORN.utils.getBrowser().browserName
            };

        new Fingerprint2().get(function(result, components){
            param.fp = result;
            HORN.Http.Get(host+"/user/track", param, function(j) {
                if(j.code === 0) {
                    Cookies.set("horn-vid", j.vid);
                    cb(j);
                } else {
                    cberr(j);
                }
            }, cberr);
        });
    };

    /**
     * 获取客服信息
     * @param {Function} cb    正确的回调
     * @param {[type]}   cberr 出错的回调
     */
    HORN.StaffInfo = function(cb, cberr) {
        HORN.Http.Get(HORN.HOST+"/staff/info", {}, cb, cberr);
    };


    /**************************************************************************/
    /************************ HORN.Init后才能使用的方法 **************************/
    /**************************************************************************/

    /**
     * 发起对话
     * @param {[type]}   chat  对话对象{oid:"组织ID", sid:"客服ID", vid:"访客ID", tid:"访问ID"}
     * @param {Function} cb    正确回调
     * @param {[type]}   cberr 错误回调
     */
    HORN.RequestChat = function(chat, cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }
        api.RequestChat(chat, cb, cberr);
    };

    /**
     * 客服邀请访客对话
     * @param {[type]}   vid   访客ID
     * @param {[type]}   tid   访客访问ID
     * @param {Function} cb    正确回调
     * @param {[type]}   cberr 错误回调
     */
    HORN.InviteVisitorChat = function(vid, tid, cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }
        api.InviteVisitorChat(vid, tid, cb, cberr);
    }

    /**
     * 访客请求客服对话
     * @param {[type]}   sid   客服ID
     * @param {Function} cb    正确回调
     * @param {[type]}   cberr 错误回调
     */
    HORN.RequestStaffChat = function(sid, cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }
        api.RequestStaffChat(sid, cb, cberr);
    }

    /**
     * 加入对话
     * @param {[type]}   chatID 要加入的对话ID
     * @param {Function} cb     正确的回调
     * @param {[type]}   cberr  出错的回调
     */
    HORN.JoinChat = function(chatID, cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }
        api.JoinChat(chatID, cb, cberr);
    };

    /**
     * 发送普通消息
     * @param {[type]}   chatID 对话ID
     * @param {[type]}   text   消息内容
     * @param {Function} cb     正确的回调
     * @param {[type]}   cberr  出错的回调
     */
    HORN.SendMsgText = function(chatID, text, cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }
        api.SendMsgText(chatID, text, cb, cberr);
    };

    /**
     * 发送文件消息
     * @param {[type]}   chatID 对话ID
     * @param {[type]}   name   文件名
     * @param {[type]}   src    文件地址
     * @param {[type]}   size   文件大小
     * @param {Function} cb     正确的回调
     * @param {[type]}   cberr  出错的回调
     */
    HORN.SendMsgFile = function(chatID, name, src, size, cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }
        var file = {
            name: name,
            src: src,
            size: size
        };
        api.SendMsgFile(chatID, file, cb, cberr);
    };

    /**
     * 发送图片消息
     * @param {[type]}   chatID 对话ID
     * @param {[type]}   src    图片地址
     * @param {[type]}   size   图片大小
     * @param {[type]}   width  宽度
     * @param {[type]}   height 高度
     * @param {Function} cb     正确的回调
     * @param {[type]}   cberr  出错的回调
     */
    HORN.SendMsgImage = function(chatID, src, size, width, height, cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }
        var image = {
            src: src,
            size: size,
            width: width,
            height: height
        };
        api.SendMsgImage(chatID, image, cb, cberr);
    };

    /**
     * 获取在线客服列表
     * @param {Function} cb    正确的回调
     * @param {[type]}   cberr 出错的回调
     */
    HORN.GetOnlineStaffList = function(cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }

        api.GetOnlineStaffList(cb, cberr);
    };

    /**
     * 获取在线的访客列表
     * @param  {Function} cb    正确的回调
     * @param  {[type]}   cberr 出错的回调
     */
    HORN.GetOnlineUserList = function(cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }

        api.GetOnlineUserList(cb, cberr);
    };

    HORN.GetTags = function(cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }

        api.GetTags(cb, cberr);
    };

    HORN.GetTagsByVid = function(vid, cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }

        api.GetTagsByVid(vid, cb, cberr);
    };

    HORN.AttachTag = function(vid, tagId, cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }

        api.AttachTag(vid, tagId, cb, cberr);
    };

    HORN.DetachTag = function(vid, tagId, cb, cberr) {
        if(api == null) {
            throw new Error("HORN is not inited.");
        }

        api.DetachTag(vid, tagId, cb, cberr);
    };

    HORN.StartHeartbeat = function(cberr) {
        api.StartHeartbeat(cberr);
    };

    HORN.OnRestore = function(cb, ctx) {
        events["restore"] = {cb:cb, ctx:ctx};
    };

    HORN.OnMessage = function(cb, ctx) {
        events["message"] = {cb:cb, ctx:ctx};
    };

    HORN.OnError = function(cb, ctx) {
        events["error"] = {cb:cb, ctx:ctx};
    };

})(window, window.HORN);