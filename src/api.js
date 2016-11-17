(function(exports, HORN){

    function API(config) {
        if(!(config instanceof HORN.Config)) {
            throw new Error("param config is not HORN.Config");
        }
        this.cfg = config;

        this.conn = new HORN.Connection(config);
    }

    API.prototype.RequestChat = function(uids, cb, cberr) {
        var msg = {
            "type": "request_chat",
            "from": this._from(),
            "event": {
                "uids": uids
            }
        };
        HORN.Http.Post(this.cfg.Host()+"/message", JSON.stringify(msg), cb, cberr);
    }

    API.prototype.JoinChat = function(chatID, cb, cberr) {
        var msg = {
            "type": "join_chat",
            "from": this._from(),
            "event": {
                "chat": {
                    "id": chatID
                }
            }
        };
        HORN.Http.Post(this.cfg.Host()+"/message", JSON.stringify(msg), cb, cberr);
    }

    API.prototype.SendMsg = function(msg, cb, cberr) {
        HORN.Http.Post(this.cfg.Host()+"/message", JSON.stringify(msg), cb, cberr);
    }

    API.prototype.SendMsgText = function(chatID, text, cb, cberr) {
        var msg = {
            "type": "text",
            "cid": this.cfg.CID(),
            "from": this._from(),
            "chat": {
                "id": chatID
            },
            "text": text
        };
        this.SendMsg(msg, cb, cberr);
    }

    API.prototype.SendMsgFile = function(chatID, file, cb, cberr) {
        var msg = {
            "type": "file",
            "cid": this.cfg.CID(),
            "from": this._from(),
            "chat": {
                "id": chatID
            },
            "file": file // {"name":"", "size":1, "src":""}
        };
        this.SendMsg(msg, cb, cberr);
    }

    API.prototype.SendMsgImage = function(chatID, image, cb, cberr) {
        var msg = {
            "type": "image",
            "cid": this.cfg.CID(),
            "from": this._from(),
            "chat": {
                "id": chatID
            },
            "image": image // {"src":"", "size":1, "width":1, "height":1}
        };
        this.SendMsg(msg, cb, cberr);
    }

    API.prototype.StartHeartbeat = function(cberr) {
        var msg = {
            cid: this.cfg.CID(),
            uid: this.cfg.UID(),
            fp: this.cfg.FP(),
            track_id: this.cfg.TrackID()
        };
        var _self = this;
        HORN.Http.Get(this.cfg.Host()+"/ping", msg, function(res) {
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
            "id": this.cfg.UID(),
            "name": this.cfg.Name(),
            "role": this.cfg.Role()
        };
    }

    API.InitFromConfig = function(config) {
        return new API(config);
    }

    HORN.API = API;

})(window, window.HORN);