(function(exports, HORN) {
    HORN.Http = {};
            
    HORN.Http.Get = function() {
        $.get.apply(null, arguments);
    }
    
    HORN.Http.Post = function() {
        $.post.apply(null, arguments);
    }
})(window, window.HORN);