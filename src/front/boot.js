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
    HORN.HOST = "https://app.hiyueliao.com/api";

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
                    <div id="horn-up-container" style="bottom: 80px; font-size:12px; color:gray; position:absolute;">\
                        <a href="#" id="horn-up-pickfiles" style="color:gray">上传</a>\
                    </div>\
                </div>\
                <div class="horn-copyright">@hiyueliao.com</div>\
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

    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',      // 上传模式,依次退化
        browse_button: 'horn-up-pickfiles',         // 上传选择的点选按钮，**必需**
        // 在初始化时，uptoken, uptoken_url, uptoken_func 三个参数中必须有一个被设置
        // 切如果提供了多个，其优先级为 uptoken > uptoken_url > uptoken_func
        // 其中 uptoken 是直接提供上传凭证，uptoken_url 是提供了获取上传凭证的地址，如果需要定制获取 uptoken 的过程则可以设置 uptoken_func
        // uptoken : '', // uptoken 是上传凭证，由其他程序生成
        uptoken_url: 'https://app.hiyueliao.com/api/uptoken',         // Ajax 请求 uptoken 的 Url，**强烈建议设置**（服务端提供）
        // uptoken_func: function(file){    // 在需要获取 uptoken 时，该方法会被调用
        //    // do something
        //    return uptoken;
        // },
        get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的 uptoken
        // downtoken_url: '/downtoken',
        // Ajax请求downToken的Url，私有空间时使用,JS-SDK 将向该地址POST文件的key和domain,服务端返回的JSON必须包含`url`字段，`url`值为该文件的下载地址
        // unique_names: true,              // 默认 false，key 为文件名。若开启该选项，JS-SDK 会为每个文件自动生成key（文件名）
        // save_key: true,                  // 默认 false。若在服务端生成 uptoken 的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'f1stxtgl',     // bucket 域名，下载资源时用到，**必需**
        container: 'horn-up-container',             // 上传区域 DOM ID，默认是 browser_button 的父元素，
        max_file_size: '100mb',             // 最大文件体积限制
        flash_swf_url: '//cdn.staticfile.org/plupload/2.1.1/Moxie.swf',  //引入 flash,相对路径
        max_retries: 3,                     // 上传失败最大重试次数
        dragdrop: true,                     // 开启可拖曳上传
        drop_element: 'container',          // 拖曳上传区域元素的 ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                  // 分块上传时，每块的体积
        auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传,
        //x_vars : {
        //    自定义变量，参考http://developer.qiniu.com/docs/v6/api/overview/up/response/vars.html
        //    'time' : function(up,file) {
        //        var time = (new Date()).getTime();
                // do something with 'time'
        //        return time;
        //    },
        //    'size' : function(up,file) {
        //        var size = file.size;
                // do something with 'size'
        //        return size;
        //    }
        //},
        init: {
          'FilesAdded': function(up, files) {
              plupload.each(files, function(file) {
                  // 文件添加进队列后,处理相关的事情
              });
          },
          'BeforeUpload': function(up, file) {
                 // 每个文件上传前,处理相关的事情
          },
          'UploadProgress': function(up, file) {
                 // 每个文件上传时,处理相关的事情
          },
          'FileUploaded': function(up, file, info) {
                 // 每个文件上传成功后,处理相关的事情
                 // 其中 info 是文件上传成功后，服务端返回的json，形式如
                 // {
                 //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                 //    "key": "gogopher.jpg"
                 //  }
                 // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                 //var domain = up.getOption('domain');
                 var res = JSON.parse(info);
                 var sourceLink = "https://f1.stxtgl.com/" + res.key; // 获取上传成功后的文件的Url

                 if(["image/png","image/jpg","image/jpeg"].indexOf(file.type) > -1) {
                    HORN.SendMsgImage(front.cid, sourceLink, file.size, 0, 0, function() {
                      console.log(arguments);
                    }, function(){
                      console.error(arguments);
                    });
                 } else {
                    HORN.SendMsgFile(front.cid, file.name, sourceLink, file.size, function() {
                      console.log(arguments);
                    }, function(){
                      console.error(arguments);
                    });
                  }
          },
          'Error': function(up, err, errTip) {
                 //上传出错时,处理相关的事情
          },
          'UploadComplete': function() {
                 //队列文件处理完毕后,处理相关的事情
          },
          'Key': function(up, file) {
            //debugger;
              // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
              // 该配置必须要在 unique_names: false , save_key: false 时才生效

              var key = "chat/attach/"+front.cid+"/"+file.name;
              // do something with key here
              return key
          }
        }
    });
})(window, window.HORN);