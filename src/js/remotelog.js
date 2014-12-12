/*
	A Javascript client for remotelog.
	This module has no depedencies, but is ready to use with Requirejs.
	If using Requirejs, the module name is 'remotelog.' If Requirejs is not
	present, a global variable 'remotelog' is used.

	Author : shukri.adams@gmail.com, 2014.
	https://github.com/shukriadams/remotelog.js.client
*/

// shim define if it doesn't exist and make module global.
var define = define || function(m, r, c){if(window){window[m]=call();}};

define('remotelog', [], function () {

	'use strict';

	var _endpoint = null,
		_log  = null;

	var logger = {
		showInConsole : false,
		init : function(endpoint, log){
			_endpoint = endpoint;
			_log = log;
		},
		write : function(text, type, person){
			if (!_endpoint){
				console.log("Remotelog init error - endpoint not set");
				return;
			}
			if (!_log){
				console.log("Remotelog init error - log name not set");
				return;
			}

			if (text === undefined || text === null || text.length === 0)
				return;
			if (type === undefined || text === null)
				type = "";
			if (person === undefined || person === null)
				person = "";

			text = encodeURI(text);
			type = encodeURI(type);
			person = encodeURI(person);
			var endpoint = _endpoint.replace(/\/$/, '');

			var self = this,
				logUrl = endpoint + "/write?log=" + encodeURI(_log) + "&text=" + text + "&type=" + type + "&person=" + person,
				xmlhttp;

		    if (window.XMLHttpRequest) {
		        // IE7+, other browsers
		        xmlhttp = new XMLHttpRequest();
		    } else {
		        // IE6, IE5
		        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		    }

		    xmlhttp.onreadystatechange = function() {
		        if (xmlhttp.readyState === 4) {
		           if(xmlhttp.status === 200){
		               self.console(xmlhttp.responseText);
		           } else if(xmlhttp.status === 400) {
		              self.console('Remote logger returned 400');
		           } else {
		               self.console('Remote logger returned status ' + xmlhttp.status);
		           }
		        }
		    }

		    xmlhttp.open("GET", logUrl, true);
		    xmlhttp.send();
		},
		console : function(message){
			if (!this.showInConsole || console === undefined || console === null)
				return;

			console.log(message);
		}
	};
	
	return logger;
});
