(function(exports, HORN){
    var cfg = null;

    function initCfg() {
        if(cfg == null) {
            cfg = HORN.GetConfig();
        }
    }

    HORN.API = {};

    HORN.API.RequestChat = function(uids, cb, cberr) {
        initCfg();
        var msg = {
            "type": "request_chat",
            "from": {
                "id": cfg.UID(),
                "name": "",
                "role": cfg.Role()
            },
            "event": {
                "uids": uids
            }
        };
        HORN.Http.Post(cfg.Host()+"/message", JSON.stringify(msg), cb, cberr);
    }

    HORN.API.JoinChat = function(chatID, cb, cberr) {
        initCfg();
        var msg = {
            "type": "join_chat",
            "from": {
                "id": cfg.UID(),
                "name": "",
                "role": cfg.Role()
            },
            "event": {
                "chat": {
                    "id": chatID
                }
            }
        };
        HORN.Http.Post(cfg.Host()+"/message", JSON.stringify(msg), cb, cberr);
    }

    HORN.API.SendMsg = function(chatID, msg, cb, cberr) {
        initCfg();
        msg.chat = {
            id: chatID
        };
        msg.from = {
            id: cfg.UID(),
            name: "",
            "role": cfg.Role()
        };
        HORN.Http.Post(cfg.Host()+"/message", JSON.stringify(msg), cb, cberr);
    }

    HORN.API.Identity = function(host, cb, cberr) {
        var uid = Cookies.get("horn-uid");
        if(uid) {
            cb(uid);
        } else {
            new Fingerprint2().get(function(result, components){
                HORN.Http.Get(host+"/user/id", {fp:result}, function(j) {
                    //j = JSON.parse(j);
                    if(j.code === 0) {
                        Cookies.set("horn-uid", j.uid);
                        cb(j.uid);
                    } else {
                        cberr(j);
                    }
                }, cberr);
            });
        }
    }
})(window, window.HORN);