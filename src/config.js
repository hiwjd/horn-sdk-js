(function(exports, HORN){

    function Config(args) {
        this.cid = ""; // 公司ID
        this.uid = ""; // 访客／客服ID
        this.name = ""; // 名字
        this.host = ""; // 接口地址
        this.conn_type = "longpolling"; // 通信方式 longpolling或者websocket
        this.role = "user"; // 用户角色 user:访客 staff:客服
        this.track_id = ""; // 追踪ID 连接下发服务器也要用到
        this.fp = ""; // 指纹

        this.Refresh(args);
    }

    Config.prototype.CID = function() {
        return this.cid;
    }

    Config.prototype.UID = function() {
        return this.uid;
    }

    Config.prototype.Name = function() {
        return this.name;
    }

    Config.prototype.Host = function() {
        return this.host;
    }

    Config.prototype.ConnType = function() {
        return this.conn_type;
    }

    Config.prototype.Role = function() {
        return this.role;
    }

    Config.prototype.TrackID = function() {
        return this.track_id;
    }

    Config.prototype.FP = function() {
        return this.fp;
    }

    Config.prototype.Refresh = function(args) {
        for(var key in args) {
            if(args.hasOwnProperty(key)) {
                this[key] = args[key];
            }
        }
    }

    Config.prototype.check = function() {
        if(this.cid == "" || this.uid == "" || this.host == "") {
            throw new Error("HORN.Config not well inited.");
        }
    }

    Config.Init = function(args) {
        return new Config(args);
    }

    HORN.Config = Config;

})(window, window.HORN);