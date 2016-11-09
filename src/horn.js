(function(exports, HORN){
    // 初始化js sdk
    var config = null,
        conn = null;

    function Config(args) {
        if(!args.cid || !args.uid || !args.host) {
            throw new Error("param cid, uid or host missing");
        }
        this.cid = args.cid;
        this.uid = args.uid;
        this.host = args.host;
        this.conn_type = args.conn_type || "longpolling";
        this.role = args.role || "user";
        this.track_id = args.track_id || "";
        this.fp = args.fp || "";
    }

    Config.prototype.Cid = function() {
        return this.cid;
    }

    Config.prototype.UID = function() {
        return this.uid;
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

    Config.prototype.TrackId = function() {
        return this.track_id;
    }

    Config.prototype.FP = function() {
        return this.fp;
    }

    HORN.Config = Config;

    HORN.Init = function(args) {
        config = new Config(args);
    };

    HORN.GetConnection = function() {
        if(config == null) {
            throw new Error("HORN is not inited.");
        }
        if(conn == null) {
            conn = new HORN.Connection(config);
        }
        return conn;
    };

    HORN.GetConfig = function() {
        return config;
    }
})(window, window.HORN);