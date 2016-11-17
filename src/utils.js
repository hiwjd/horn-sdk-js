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

    function getOS() {
        // This script sets OSName variable as follows:
        // "Windows"    for all versions of Windows
        // "MacOS"      for all versions of Macintosh OS
        // "Linux"      for all versions of Linux
        // "UNIX"       for all other UNIX flavors 
        // "Unknown OS" indicates failure to detect the OS

        var OSName="Unknown OS";
        if (navigator.appVersion.indexOf("Win")!=-1) OSName="Windows";
        if (navigator.appVersion.indexOf("Mac")!=-1) OSName="MacOS";
        if (navigator.appVersion.indexOf("X11")!=-1) OSName="UNIX";
        if (navigator.appVersion.indexOf("Linux")!=-1) OSName="Linux";

        return OSName;
    }

    function getBrowser() {
        var nVer = navigator.appVersion;
        var nAgt = navigator.userAgent;
        var browserName  = navigator.appName;
        var fullVersion  = ''+parseFloat(navigator.appVersion); 
        var majorVersion = parseInt(navigator.appVersion,10);
        var nameOffset,verOffset,ix;

        // In Opera, the true version is after "Opera" or after "Version"
        if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
         browserName = "Opera";
         fullVersion = nAgt.substring(verOffset+6);
         if ((verOffset=nAgt.indexOf("Version"))!=-1) 
           fullVersion = nAgt.substring(verOffset+8);
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
         browserName = "Microsoft Internet Explorer";
         fullVersion = nAgt.substring(verOffset+5);
        }
        // In Chrome, the true version is after "Chrome" 
        else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
         browserName = "Chrome";
         fullVersion = nAgt.substring(verOffset+7);
        }
        // In Safari, the true version is after "Safari" or after "Version" 
        else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
         browserName = "Safari";
         fullVersion = nAgt.substring(verOffset+7);
         if ((verOffset=nAgt.indexOf("Version"))!=-1) 
           fullVersion = nAgt.substring(verOffset+8);
        }
        // In Firefox, the true version is after "Firefox" 
        else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
         browserName = "Firefox";
         fullVersion = nAgt.substring(verOffset+8);
        }
        // In most other browsers, "name/version" is at the end of userAgent 
        else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) < 
                  (verOffset=nAgt.lastIndexOf('/')) ) 
        {
         browserName = nAgt.substring(nameOffset,verOffset);
         fullVersion = nAgt.substring(verOffset+1);
         if (browserName.toLowerCase()==browserName.toUpperCase()) {
          browserName = navigator.appName;
         }
        }
        // trim the fullVersion string at semicolon/space if present
        if ((ix=fullVersion.indexOf(";"))!=-1)
           fullVersion=fullVersion.substring(0,ix);
        if ((ix=fullVersion.indexOf(" "))!=-1)
           fullVersion=fullVersion.substring(0,ix);

        majorVersion = parseInt(''+fullVersion,10);
        if (isNaN(majorVersion)) {
         fullVersion  = ''+parseFloat(navigator.appVersion); 
         majorVersion = parseInt(navigator.appVersion,10);
        }

        return {
            browserName: browserName,
            fullVersion: fullVersion,
            majorVersion: majorVersion
        };
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
        isFunction: isFunction,
        getOS: getOS,
        getBrowser: getBrowser
    };
})(window, window.HORN);