
;(function($){

    if (!window.AnimationFrame) {
    	window.AnimationFrame = (function() {
    		return window.webkitRequestAnimationFrame ||
    		window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
    		window.oRequestAnimationFrame ||
    		window.msRequestAnimationFrame ||
    		function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
    			window.setTimeout(callback, 1000 / 60);
    		};
    	})();
    }

    if (!window.AudioContext) {
    	window.AudioContext = (
    		window.webkitAudioContext ||
    		window.mozAudioContext ||
    		window.oAudioContext ||
    		window.msAudioContext ||
    		null
    	);
    }

    if (!navigator.UserMedia) {
    	navigator.UserMedia = (
    		navigator.getUserMedia ||
    		navigator.webkitGetUserMedia ||
    		navigator.mozGetUserMedia ||
    		navigator.msGetUserMedia ||
    		null
    	);
    }

    if (!window.navigator) {
        window.navigator = {onLine: true, userAgent: ""};
    }

    if (!!window.console) {
    	window.console.error = window.console.error || window.console.log;
    	window.console.warn = window.console.warn || window.console.log;
    	window.console.group = window.console.group || function() { console.log("======="); };
    	window.console.groupEnd = window.console.groupEnd || function() { console.log("======="); };
    }

    window.URL = (window.URL || window.webkitURL);
    document.Hidden = (document.webkitHidden);

    $.extend({
        log: function() {
            if (arguments.length < 1) {
    			return false;
    		}

    		$.log.history = $.log.history || [];
    		$.log.history.push(arguments);

    		if (!$.debug) {
    			return false;
    		}

    		if(!!window.console) {
    			console.log.apply(console, Array.prototype.slice.call(arguments));
    		}
		},
		warn: function() {
    		if (arguments.length < 1) {
    			return false;
    		}

    		$.warn.history = $.warn.history || [];
    		$.warn.history.push(arguments);

    		if (!$.debug) {
    			return false;
    		}

    		if(!!window.console) {
    			console.warn.apply(console, Array.prototype.slice.call(arguments));
    		}
    	},
		error: function() {
    		if (arguments.length < 1) {
    			return false;
    		}

    		$.error.history = $.error.history || [];
    		$.error.history.push(arguments);

    		if (!$.debug) {
    			return false;
    		}

    		if(!!window.console) {
    			console.error.apply(console, Array.prototype.slice.call(arguments));
    		}
    	},
    	show_logs: function() {
    		if(!!window.console) {
    			console.group();
                console.log('Logs:');
    			console.log($.log.history || []);
    			console.log(' \nWarnings:');
    			console.log($.warn.history || []);
    			console.log(' \nErrors:');
    			console.log($.error.history || []);
    			console.groupEnd();
    		}
    	},
    	get_cookie: function(name) {
    	    return $.fetch_cookie(name);
    	},
    	fetch_cookie: function(name) {
    		var i, x, y, cookies = document.cookie.split(";");

    		for (i=0; i < cookies.length; i++) {
    			x = cookies[i].substr(0,cookies[i].indexOf("="));
    			y = cookies[i].substr(cookies[i].indexOf("=")+1);
    			x = x.replace(/^\s+|\s+$/g,"");
    			if (x == name) { return unescape(y); }
    		}
    	},
    	set_cookie: function(name, value, domain_name) {
    		var date = new Date();
    		date.setTime(date.getTime() + 60 * 60 * 1000 * 24 * 365);

            var path = "; path=/";
            var domain = ";";
            if (!!domain_name) {
                domain += " domain=" + domain_name;
            }
    		var expires = "expires="+date.toGMTString();
    		document.cookie = name+"="+value+"; "+expires+path+domain;
    	},
    	url_param: function(name) {
    		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
    	},
		online: function() {
    		return window.navigator.onLine;
    	},
		offline: function() {
    		return !window.navigator.onLine;
    	},
    	is_IE: function() {
    		return (navigator.appName == 'Microsoft Internet Explorer');
    	},
    	get_IE_version: function() {
    	    var version = -1; // Return value assumes failure.

    		if (navigator.appName == 'Microsoft Internet Explorer') {
    			var agent = navigator.userAgent;
    			var pattern = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");

    			if (pattern.exec(agent) != null) {
    				$.error('Internet Explorer detected.');
    				version = parseFloat(RegExp.$1);
    			}
    		}

    		return version;
    	},
        is_mobile: function() {
            var pattern = /iPhone|iPod|Android|BlackBerry/;
            return pattern.test(navigator.userAgent);
        },
        is_canvas_supported: function() {
    		var elem = document.createElement('canvas');
    		return !!(elem.getContext && elem.getContext('2d'));
    	},
    	format_date: function(date) {
    		var date = new Date(date);
    		var ordimap = {1:'st', 21:'st', 31:'st', 2:'nd', 22:'nd', 3:'rd', 23:'rd'};
    		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    		var n = date.getDate();
    		var s = ordimap[n] || "th";

    		return monthNames[date.getMonth()] + " " + n + s;
    	},
    	format_time: function(date) {
    		var date = new Date(date);

    		var hour = date.getHours();
    		var minute = date.getMinutes();
    		var ap = "am";

    		if (hour > 11) { ap = "pm"; }
    		if (hour > 12) { hour = hour - 12; }
    		if (hour   == 0) { hour = 12; }

    		return hour+":"+minute+" "+ap;
    	},
    	add_commas: function(number) {
        	var string = number + '';

        	var split = string.split('.');
        	var string = split[0];

        	var dec = split.length > 1 ? '.' + split[1] : '';
        	var pattern = /(\d+)(\d{3})/;

        	while (pattern.test(string)) {
        		string = string.replace(pattern, '$1' + ',' + '$2');
        	}
        	return string + dec;
        },
        remove_commas: function(string) {
            return string.replace(/\,/g,'');
        },
    	capitalise_first: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        zero_fill: function(number, width) {
    		width -= number.toString().length;
    		if (width > 0) {
    			return new Array(width + (/\./.test( number ) ? 2 : 1)).join("0") + number;
    		}
    		return number + "";
    	},
    	validate_number: function(string) {
            var pattern = /^\d+$/;
            return pattern.test(string);
        },
    	validate_email: function(email) {
    		var pattern = /[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    		return pattern.test(email);
    	},
        validate_url: function(url) {
        	return (/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/).test(url);
        }
    });

    $.fn.extend({
        content: function(value) {
            if (!!value) {
                if ($(this).is("input")) {
                    $(this).val(value);
                }
                else {
                    $(this).html(value);
                }
            }
            else {
                if ($(this).is("input")) {
                    return $(this).val();
                }
                else {
                    return $(this).html();
                }
            }
        },
        add_commas: function() {
            var number = $(this).content();
            $(this).content($.add_commas(number));
        },
        remove_commas: function() {
            var string = $(this).content();
            $(this).content($.remove_commas(string));
        },
        capitalise_first: function() {
            var string = $(this).content();
            $(this).content($.capitalise_first(string));
        },
        zero_fill: function(number, width) {
            $(this).content($.zero_fill(number, width));
        },
        format_date: function() {
            var date = new Date($(this).content());
            $(this).content($.format_date(date));
        },
        format_time: function() {
            var time = new Date($(this).content());
            $(this).content($.format_time(time));
        },
        validate_number: function() {
            var string = $(this).content();
            string = $.remove_commas(string);
            return $.validate_number(string);
        },
        validate_email: function() {
            var string = $(this).content();
            return $.validate_email(string);
        },
        validate_url: function() {
            var string = $(this).content();
            return $.validate_url(string);
        }
    });

})(jQuery);
