(function(exports, HORN){
    // 初始化js sdk
    var config = null,
        conn = null;

    function Config(args) {
        if(!args.uid || !args.host) {
            throw new Error("param uid or host missing");
        }
        this.uid = args.uid;
        this.host = args.host;
        this.conn_type = args.conn_type || "longpolling";
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