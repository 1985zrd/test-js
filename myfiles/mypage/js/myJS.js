function getStyle(obj,attr){
	 return  obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj)[attr]
    };

function quickSort(arr) {
  　  if (arr.length <= 1) { return arr; }
  　　var pivotIndex = Math.floor(arr.length / 2);
  　　var pivot = arr.splice(pivotIndex, 1)[0];
  　　var left = [];
  　　var right = [];
  　　for (var i = 0; i < arr.length; i++){
  　　　　if (arr[i] < pivot) {
  　　　　　　left.push(arr[i]);
  　　　　} else {
  　　　　　　right.push(arr[i]);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  　　　　}
  　　}
  　　return quickSort(left).concat([pivot], quickSort(right));
    };

function shake(obj,attr,endFn){
		if(obj.mytimer){return;}
		obj.mytimer = true;
	    var pos = parseInt(getStyle(obj,attr));
		var arr = [];
		var num = 0;
		for (i=20;i>0;i-=2){
		  arr.push(i,-i)
		};
		arr.push(0);
		obj.mytimer = setInterval(function(){
		     obj.style[attr] = pos + arr[num] + 'px';
			 num++;
			 if(num==arr.length){
				  clearInterval(obj.mytimer)
				  endFn&&endFn();
				  obj.mytimer = false;
				}
		},40);
	};

function setCookie(key, value, t) {
	var oDate = new Date();
	oDate.setDate( oDate.getDate() + t );
	document.cookie = key + '=' + value + ';expires=' + oDate.toGMTString();
};

function getCookie(key) {
	var arr1 = document.cookie.split('; ');
	for (var i=0; i<arr1.length; i++) {
		var arr2 = arr1[i].split('=');
		if ( arr2[0] == key ) {
			return decodeURI(arr2[1]);
		}
	}
};

function removeCookie(key) {
	setCookie(key, '', -1);
};

//拖拽
function drag(obj) {
	obj.onmousedown = function(ev) {
		var ev = ev || window.event;
		var disX = ev.clientX - this.offsetLeft;
		var disY = ev.clientY - this.offsetTop;
		if ( obj.setCapture ) {
			obj.setCapture();
		}
		document.onmousemove = function(ev) {
			var ev = ev || window.event;
			obj.style.left = ev.clientX - disX + 'px';
			obj.style.top = ev.clientY - disY + 'px';
		}
		document.onmouseup = function() {
			document.onmousemove = document.onmouseup = null;
			if ( obj.releaseCapture ) {
				obj.releaseCapture();
			}
		}
		return false;
	}
};

(function(){
function minMaxRandom(under,over){
	switch(arguments.length){
		case 1: return parseInt(Math.random()*under);
		case 2: return (parseInt(Math.random()*(over-under+1))+parseInt(under));
		default:return 0;
	};
}

function Request() {
};
Request.prototype = {
	ajax : function(args) {
		this.options = {
			type : 'GET',
			dataType : 'text',
			async : true,
			avatar : null,
			contentType : 'application/x-www-form-urlencoded',
			url : 'about:blank',
			data : {},
			success : {},
			error : {}
		};
		if (!args) {
			console.error('please fill in any parameters first!');
			return;
		} else if (!args.url) {
			console.error('url is required parameters, please check your parameters!');
			return;
		} else if (!args.success || typeof args.success != 'function') {
			console.error('the callback function is lost!');
			return;
		}
		this.shift(this.options, args);
		this.send();
	},
	jsonp : function(args) {
		this.options = {
			type : 'JSONP',
			jsonpName : '',
			dataType : 'text',
			async : true,
			avatar : null,
			url : 'about:blank',
			success : function(){},
			data : {}
		};
		if (!args) {
			console.error('please fill in any parameters first!');
			return;
		} else if (!args.url) {
			console.error('url is required parameters, please check your parameters!');
			return;
		} else if (!args.jsonpName) {
			args.jsonpName = 'jsonpCallbackFunctionNo' + new Date().getTime() + minMaxRandom(0, 9999);
		}

		this.shift(this.options, args);
		if (window[this.options.jsonpName] && window[this.options.jsonpName] !== this.options.success) {
			console.error('jsonpName already exists!');
			return;
		}
		window[this.options.jsonpName] = this.options.success;
		this.create();
	},
	create : function() {
		var script = document.createElement('script'), argStr = /[\?]/g.test(this.options.url) ? '&' : '?';
		for (var key in this.options.data) {
			argStr += key + '=' + this.options.data[key] + '&';
		}
		argStr = argStr + 'callback=' + this.options.jsonpName;
		script.async = this.options.async;
		script.src = this.options.url + (argStr == '?' ? '' : argStr);
		document.getElementsByTagName('head')[0].appendChild(script);
	},
	XmlHttp : function() {
		var xmlHttp;
		try {
			xmlhttp = new XMLHttpRequest();
		} catch(e) {
			try {
				xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
			} catch(e) {
				xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		if (!xmlhttp) {
			return false;
		}
		return xmlhttp;
	}, 
	send : function() {
		var xmlHttp = this.XmlHttp(), linkSign = /[\?]/g.test(this.options.url) ? '&' : '?', argStr = '', _this = this, length = this.options.data ? this.options.data.length : 0;
		for (var key in this.options.data) {
			argStr += key + '=' + this.options.data[key] + '&';
		}
		argStr = argStr.replace(/\&$/g, '');
		if (this.options.type.toUpperCase() == 'GET') {
			xmlHttp.open(this.options.type, this.options.url + (argStr == '' ? '' : linkSign + argStr), this.options.async);
		} else {
			xmlHttp.open(this.options.type, this.options.url, this.options.async);
		}
		xmlHttp.setRequestHeader('Content-Type', this.options.contentType);
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200 || xmlHttp.status == 0) {
					if ( typeof _this.options.success == 'function') {
						var responseData = _this.options.dataType == 'text' ? xmlHttp.responseText : xmlHttp.responseXML;
						_this.options.success(responseData, _this.options.dataType,_this.options.avatar);
					}
					xmlHttp = null;
				} else {
					if ( typeof _this.options.error == 'function')
						_this.options.error('Server Status: ' + xmlHttp.status);
				}
			}
		};
		xmlHttp.send(this.options.type.toUpperCase() == 'POST' ? argStr : null);
	},
	shift : function(o, args) {
		for (var i in args) {
			o[i] = args[i];
		};
		return o;
	}
}; 
	
 window['Request'] = function(){
 	return new Request();
 };
})();

/*用法：
var req = Request();  //方法实例化
req.jsonp({
	url:iUrl+'&content='+str, //请求路径及数据 
	success:function(d){
	    //请求成功
	}
})

req.ajax({	
	url:iUrl,  //请求路径
	type:'post',  //请求方式  get||post
	data:{proID:proID,type:type},  //请求数据
	success:function(str){
	    //请求成功
	},
	error:function(){
	    alert('加载失败')
	}
})
*/

/* 这个会让消失的图片在1秒内回来 */
function startMove(obj, json, fnEnd){
	clearInterval(obj.timer);
	obj.timer=setInterval(function (){
		var bStop=true;
		for(var attr in json){
		    var cur=0;
		    if(attr=='opacity'){
		        cur=Math.round(parseFloat(getStyle(obj, attr))*100);
		    }else{
		        cur=parseInt(getStyle(obj, attr));
		    }
		    var speed=(json[attr]-cur)/6;
		    speed=speed>0?Math.ceil(speed):Math.floor(speed);
		    if(cur!=json[attr])
		    bStop=false;
		    if(attr=='opacity'){
				obj.style.filter='alpha(opacity:'+(cur+speed)+')';
				obj.style.opacity=(cur+speed)/100;
		    }else{
		        obj.style[attr]=cur+speed+'px';
		    } 
		}
		if(bStop){
		    clearInterval(obj.timer);
		    if(fnEnd) fnEnd();
		}
	}, 30); 
};
