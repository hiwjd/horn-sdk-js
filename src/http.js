(function(exports, HORN) {
    HORN.Http = {};
            
    HORN.Http.Get = function(url, query, cb, cberr) {
        return $.ajax({
            method: "GET",
            url: url,
            data: query,
            success: cb,
            error: cberr
        });
    }
    
    HORN.Http.Post = function(url, data, cb, cberr) {
        return $.ajax({
            method: "POST",
            url: url,
            data: data,
            success: cb,
            error: cberr
        });
    }
})(window, window.HORN);