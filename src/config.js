(function(exports, HORN){

    function Config(args) {
        this.oid = 0; // 组织ID
        this.uid = ""; // 访客／客服ID
        this.name = ""; // 名字
        this.host = ""; // 接口地址
        this.conn_type = "longpolling"; // 通信方式 longpolling或者websocket
        this.conn_mode = "auto"; // auto:自动选择通信方式 manual:手动指定，即使用conn_type
        this.role = "visitor"; // 用户角色 visitor:访客 staff:客服
        this.tid = ""; // 追踪ID 连接下发服务器也要用到
        this.fp = ""; // 指纹

        this.ApplyArgs(args);
    }

    Config.prototype.OID = function() {
        return this.oid;
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

    Config.prototype.ConnMode = function() {
        return this.conn_mode;
    }

    Config.prototype.Role = function() {
        return this.role;
    }

    Config.prototype.TID = function() {
        return this.tid;
    }

    Config.prototype.FP = function() {
        return this.fp;
    }

    Config.prototype.ApplyArgs = function(args) {
        for(var key in args) {
            if(args.hasOwnProperty(key)) {
                this[key] = args[key];
            }
        }

        if(this.oid == 0 || this.oid == "") {
            throw new Error("oid is not well inited.");
        }
        if(this.uid == 0 || this.uid == "") {
            throw new Error("uid is not well inited.");
        }
        if(this.host == 0 || this.host == "") {
            throw new Error("host is not well inited.");
        }

        if(this.IsVisitor()) {
            if(this.tid == 0 || this.tid == "") {
                throw new Error("tid is not well inited.");
            }
        }
    }

    Config.prototype.IsStaff = function() {
        return this.role == 'staff';
    }

    Config.prototype.IsVisitor = function() {
        return this.role == 'visitor';
    }

    Config.prototype.check = function() {
        if(this.oid == "" || this.uid == "" || this.host == "") {
            throw new Error("HORN.Config not well inited.");
        }
    }

    Config.Init = function(args) {
        return new Config(args);
    }

    HORN.Config = Config;

})(window, window.HORN);