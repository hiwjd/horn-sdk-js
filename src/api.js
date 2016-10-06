(function(exports, HORN){
    var cfg = null;

    function initCfg() {
        if(cfg == null) {
            cfg = HORN.GetConfig();
        }
    }

    HORN.API = {};

    HORN.API.JoinChat = function(chatID, uids, cb, cberr) {
        initCfg();
        if(!uids) {
            uids = [];
        }
        uids.push(cfg.UID());
        var data = $.param({chat_id:chatID, uids:uids}, true)
        HORN.Http.Post(cfg.Host()+"/chat/join", data, cb, cberr);
    }

    HORN.API.SendMsg = function(chatID, msg, cb, cberr) {
        initCfg();
        HORN.Http.Post(cfg.Host()+"/chat/msg?chat_id="+chatID+"&uid="+cfg.UID(), msg, cb, cberr);
    }

    HORN.API.Identity = function(host, cb, cberr) {
        var uid = Cookies.get("horn-uid");
        if(uid) {
            cb(uid);
        } else {
            new Fingerprint2().get(function(result, components){
                HORN.Http.Get(host+"/user/id", {fp:result}, function(j) {
                    j = JSON.parse(j);
                    if(j.code == "0000") {
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