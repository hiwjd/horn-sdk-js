window.HORN = {};
(function(exports, HORN) {
    // ie8 theType(undefined) 和 theType(null) 返回的是 "[object Object]"
    function theType(o) {
        if(o === undefined) return "[object Undefined]";
        if(o === null) return "[object Null]";
        return Object.prototype.toString.apply(o);
    }

    function isString(o) {
        return theType(o) == "[object String]";
    }

    function isArray(o) {
        return theType(o) == "[object Array]";
    }

    function isObject(o) {
        return theType(o) == "[object Object]";
    }

    function isFunction(o) {
        return theType(o) == "[object Function]";
    }
    function aaa(){
        var m=[];
        m.push(screen.colorDepth);
        m.push(screen.width);
        m.push(screen.height);
        m.push(typeof window.indexedDB);
        m.push(typeof window.openDatabase);
        m.push(navigator.platform);
        m.push(typeof document.createElement('script').integrity)
        var s = JSON.stringify(m);
        var k = murmurhash3_32_gc(s,s);
        console.log(k);
    }
    
    HORN.utils = {
        extends: function(subClass, superClass) {
            subClass.prototype = Object.create(superClass.prototype);
            subClass.prototype.constructor = subClass;
        },
        type: theType,
        isString: isString,
        isArray: isArray,
        isObject: isObject,
        isFunction: isFunction
    };
})(window, window.HORN);