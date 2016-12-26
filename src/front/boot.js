(function(exports, HORN){
    function insertStyle() {
        var 
            j = document.createElement("style"),
            s = document.getElementsByTagName("head")[0];
        j.type = "text/css";
        j.innerHTML = ".horn-copyright,.horn-head{font-size:14px;text-align:center}.horn-box{box-shadow:0 1px 1px rgba(0,0,0,.05);width:250px;position:fixed;right:30px;bottom:-298px;z-index:9999}.horn-chat{border:1px solid #20A0FF;border-bottom:0;border-radius:5px 5px 0 0;background:#fff}.horn-head{height:30px;border-bottom:1px solid #eee;background:#20A0FF;color:#fff;line-height:30px;cursor:pointer}.horn-body{height:200px;overflow:auto}.horn-foot{height:50px;border-top:1px solid #eee;padding:10px;border-bottom:1px solid #cbcbcb}.horn-foot textarea{border:none;resize:none;outline:0;width:100%;height:100%}.horn-copyright{padding:5px;font-weight:700;background:#efefef;color:#ccc}#horn-content{padding:10px;font-size:12px}.horn-message{font-size:12px;margin-bottom:15px;display:inline-block;width:100%}.horn-message .horn-m-from{color:gray;margin-bottom:5px}.horn-message .horn-m-text{border:1px solid #eee;padding:10px;border-radius:3px;display:inline-block;max-width:50%;word-wrap:break-word;word-break:break-word;background-color:#efefef}.horn-message .horn-m-from .horn-m-time{margin-left:10px}.horn-me .horn-m-from .horn-m-time,.horn-me .horn-m-text{float:right}.horn-me .horn-m-from .horn-m-name{visibility:hidden}";
        s.appendChild(j);
    }

    insertStyle();

    var front = {
        sid: "", // 客服ID
        uid: "", // 访客ID
        cid: "", // 对话ID
        gid: "" // 客服分组ID 如果指定了客服ID(sid)，则以sid优先
    };
    HORN.HOST = "http://app.horn.com:9092/api";
    //HORN.OID = 3;

    var settings = exports["_HORN"].s;
    for(var i=0; i<settings.length; i++) {
        var item = settings[i];
        switch(item[0]) {
            case 'oid':
                HORN.OID = item[1];
            break;
            case 'sid':
                front.sid = item[1];
            break;
            case 'gid':
                front.gid = item[1];
            break;
        }
    }

    function appendMsg(m) {
        var 
            isMeClass = m.from.uid == front.uid ? " horn-me" : "",
            time = new Date(m.created_at).format("TTHH:MM");

        function _i(htmlStr) {
            $("#horn-content").append(htmlStr);
            var c = $("#horn-content").parent()[0];
            if(c) {
                c.scrollTop = c.scrollHeight;
            }
        }

        switch(m.type) {
            case "text":
                _i('<div class="horn-message horn-text'+isMeClass+'"><div class="horn-m-from"><span class="horn-m-name">'+m.from.name+'</span><span class="horn-m-time">'+time+'</span></div><div class="horn-m-text">'+m.text+'</div></div>');
            break;
            case "image":
                _i('<div class="horn-message horn-text'+isMeClass+'"><div class="horn-m-from"><span class="horn-m-name">'+m.from.name+'</span><span class="horn-m-time">'+time+'</span></div><div class="horn-m-text"><img style="width:100%;" src="'+m.image.src+'" /></div></div>');
            break;
            case "file":
                _i('<div class="horn-message horn-text'+isMeClass+'"><div class="horn-m-from"><span class="horn-m-name">'+m.from.name+'</span><span class="horn-m-time">'+time+'</span></div><div class="horn-m-text"><a target="_blank" href="'+m.file.src+'">'+m.file.name+'</a></div></div>');
            break;
            case "request_chat":
                _i("<div class=\"horn-message horn-message-request-chat\">"+m.from.name+"请求对话</div>");
                // HORN.JoinChat(m.event.chat.cid, function(j) {
                //     console.log(arguments);
                //     front.cid=m.event.chat.cid;
                // }, function() {
                //     console.log(arguments);
                // });
            break;
            case "join_chat":
                _i("<div class=\"horn-message horn-message-join-chat\">"+m.from.name+"加入了对话 "+m.event.cid+"</div>");
            break;
        }
    }

    HORN.OnRestore(function(json) {
        console.log(json);
        if(json.state.chats && json.state.chats.length) {
            var chats = json.state.chats;
            front.cid = chats[0].cid;
        }

        if(front.cid == "") {
            // sid是客服ID或者以#开头的分组ID
            var sid = front.sid == "" ? "#"+front.gid : front.sid;
            HORN.RequestStaffChat(sid, function(j) {
                console.log(j);
                front.cid = j.cid;
            }, function(j) {
                console.log(j);
            });
        }
    });

    HORN.OnMessage(function(json) {
        console.log(json);
        if(json.data) {
            for(var i=0; i<json.data.length; i++) {
                appendMsg(json.data[i]);
            }
        }
    });

    HORN.OnError(function(e) {
        console.log("onerror");
    });
    
    HORN.Track(function(res) {
        front.uid = res.vid;
        HORN.Init({
            oid: HORN.OID,
            uid: res.vid,
            tid: res.tid,
            fp: res.fp,
            name: "访客1"
        });
        HORN.StartHeartbeat(function(r) {
          console.error(r);
        });
    }, function(j) {
        console.error(j);
    });

    var tpl = '\
        <div class="horn-box">\
            <div class="horn-chat">\
                <div class="horn-head">\
                    HORN对话\
                </div>\
                <div class="horn-body">\
                    <div id="horn-content"></div>\
                </div>\
                <div class="horn-foot">\
                    <textarea id="horn-input" placeholder="回车发送"></textarea>\
                </div>\
                <div class="horn-copyright">@horn</div>\
            </div>\
        </div>\
    ';

    var box = document.createElement("div");
    box.innerHTML = tpl;
    document.body.appendChild(box);
        
    $("#horn-input").keydown(function(e) {
        if(e.keyCode == 13) {
            //debugger;
            e.preventDefault();
            e.stopPropagation();
            var text = $("#horn-input").val();
            HORN.SendMsgText(front.cid, text, function(j) {
                console.log(j);
            }, function(j) {
                console.log(j);
            });
            $("#horn-input").val("");
            return false;
        }
    });

    var bottom = "0";
    $(".horn-head").click(function() {
        $(".horn-box").animate({bottom:bottom}, 300, function() {
            bottom = bottom=="0"?"-299px":"0";
            console.log("aaabb");
        });
    });
})(window, window.HORN);