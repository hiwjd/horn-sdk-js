(function(exports, HORN) {
    // 对于不同协议的连接 应该抽象不同连接的实现，然后暴露“连接成功”，“连接失败”，“消息来了”，“连接结束”，“”

    function Protocol() {
        this.events = {
            "init": null,
            "connecting": null,
            "connected": null,
            "message": null,
            "disconnect": null
        };
    }
    Protocol.prototype.on = function(eventName, callback, context) {
        if(typeof this.events[eventName] == "object") {
            this.events[eventName] = {
                callback: callback,
                context: context
            };
        }
    }
    Protocol.prototype.trigEvent = function(eventName, args) {
        if(typeof this.events[eventName] == "object") {
            var context = this.events[eventName].context,
                callback =  this.events[eventName].callback;
            callback.call(context, args);
        }
    }

    // websocket协议
    function ProtocolWebsocket(config) {
        // 检查这个config是不是合法
        this.addr = "ws://"+config.addr+"/ws";
        this.uid = config.uid;
        this.track_id = config.track_id;
        this.conn = null;
        Protocol.call(this);
    }
    HORN.utils.extends(ProtocolWebsocket, Protocol);
    
    ProtocolWebsocket.prototype.start = function() {
        // 开始执行
        var _this = this;
        this.conn = new WebSocket(this.addr+"?uid="+this.uid+"&track_id="+this.track_id);
        this.conn.onmessage = function(e) {
            _this.trigEvent("message", JSON.parse(e.data));
        }
        this.conn.onopen = function(e) {
            _this.trigEvent("connected", e);
        }
        this.conn.onerror = function(e) {
            _this.trigEvent("error", e);
        }
        this.conn.onclose = function(e) {
            //_this.trigEvent("error", e);
        }
    }
    
    ProtocolWebsocket.makeConfig = function(cfg){
        return {
            addr: cfg.addr,
            uid: cfg.uid,
            track_id: cfg.track_id
        };
    }

    // 长轮训协议
    function ProtocolLongpolling(config) {
        // 检查这个config是不是合法
        this.addr = "http://"+config.addr+"/pull";
        this.uid = config.uid;
        this.track_id = config.track_id;
        Protocol.call(this);
    }
    HORN.utils.extends(ProtocolLongpolling, Protocol);

    ProtocolLongpolling.prototype.start = function() {
        // 开始执行
        this.pull();
    }
    ProtocolLongpolling.prototype.pull = function() {
        var _this = this;
        HORN.Http.Get(this.addr, {uid:this.uid, track_id:this.track_id}, function(json) {
            //json = JSON.parse(json);
            if(json.code !== 0) {
                console.error(json.error);
                return;
            }
            _this.trigEvent("message", json);
            _this.pull();
        }, function() {
            console.error("ProtocolLongpolling pull error");
        });
    }
    ProtocolLongpolling.makeConfig = function(cfg){
        return {
            addr: cfg.addr,
            uid: cfg.uid,
            track_id: cfg.track_id
        };
    }

    HORN.Protocol = Protocol;
    HORN.ProtocolLongpolling = ProtocolLongpolling;
    HORN.ProtocolWebsocket = ProtocolWebsocket;

})(window, window.HORN);