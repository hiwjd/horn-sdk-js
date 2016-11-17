(function(exports, HORN){
    function Connection(config) {
        if(!(config instanceof HORN.Config)) {
            throw new Error("param config is not HORN.Config");
        }
        this.uid = config.UID();
        this.host = config.Host(); // 登录的地址
        this.type = config.ConnType(); // 与消息服务器的连接方式 longpolling:长轮询 websocket:websocket
        this.track_id = config.TrackID();
        this.fp = config.FP();
        this.mode = "auto";
        this.keep = 15; // 服务端没有消息消息时的等待时间,单位秒
        this.interval = 0; // 再次发起连接的间隔时间,单位秒,0表示收到响应后立即发起连接
        this.urlMsg = ""; // 获取消息的地址
        this.protocol = null; // 通信协议具体实现
        this.supportProtocols = { // 支持的协议
            "longpolling": HORN.ProtocolLongpolling,
            "websocket": HORN.ProtocolWebsocket
        };
        this.events = {};
    }

    Connection.prototype.trigEvent = function(eventName, args) {
        if(typeof this.events[eventName] == "object") {
            var context = this.events[eventName].context,
                callback =  this.events[eventName].callback;
            return callback.call(context, args);
        }
    }

    Connection.prototype.start = function() {
        var url = this.host + "/state/init",
            _this = this;
            
        HORN.Http.Get(url, {uid: this.uid, fp: this.fp, track_id: this.track_id}, function(json) {
            if(json.code !== 0) {
                console.error(json);
                return;
            }

            _this.trigEvent("restore", json);

            var protocol = _this.supportProtocols[_this.type];
            var config = protocol.makeConfig({
                addr: json.addr,
                uid: _this.uid,
                track_id: _this.track_id
            });
        
            _this.protocol = new protocol(config);
            for(var k in _this.events) {
                var evt = _this.events[k];
                _this.protocol.on.call(
                    _this.protocol,
                    k, 
                    evt.callback,
                    evt.context
                );
            }
            _this.protocol.start();
        }, function() {
            console.error("connection login fail");
        });
    }

    // 需要在Login之前调用
    Connection.prototype.on = function(eventName, callback, context) {
        this.events[eventName] = {
            callback: callback,
            context: context
        };
    }
    
    HORN.Connection = Connection;
})(window, window.HORN);