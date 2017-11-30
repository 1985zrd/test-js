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

function setCookie(c_name,value,expiredays){
	var exdate=new Date()
	exdate.setDate(exdate.getDate()+expiredays)
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}


function getCookie(c_name){
	if (document.cookie.length>0){
		c_start=document.cookie.indexOf(c_name + "=")
		if (c_start!=-1){ 
		    c_start=c_start + c_name.length+1 
		    c_end=document.cookie.indexOf(";",c_start)
		    if (c_end==-1) c_end=document.cookie.length
		    return unescape(document.cookie.substring(c_start,c_end))
		} 
	}
	return ""
}

function removeCookie(key) {
	setCookie(key, '', -1);
}

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
}

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

function addClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) {
        obj.className = sClass;
        return;
    }
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) return;
    }
    obj.className += ' ' + sClass;
};

function removeClass(obj, sClass) { 
    var aClass = obj.className.split(' ');
    if (!obj.className) return;
    for (var i = 0; i < aClass.length; i++) {
        if (aClass[i] === sClass) {
            aClass.splice(i, 1);
            obj.className = aClass.join(' ');
            break;
        }
    }
};

function getByClass(oParent, sClass)
{
	var aEle=oParent.getElementsByTagName('*');
	var aResult=[];
	var re=new RegExp('\\b'+sClass+'\\b', 'i');
	var i=0;
	 
	for(i=0;i<aEle.length;i++)
	{
	    if(re.test(aEle[i].className))
	    {
	        aResult.push(aEle[i]);
	    }
	}
	 
	return aResult;
};

/输入框里的字符添加千位符/
function perThousand(){
    this.value = this.value.replace(/\,/ig,'').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
};
/*oInput.onfocus = function(){
	this.value = this.value.replace(/,|\s/g, '');
}
oInput.onblur = function(){
	this.value = Convert(this.value);
}
function Convert(money) {
    var s = money; //获取小数型数据
    s += "";
    if (s.indexOf(".") == -1) s += ".0"; //如果没有小数点，在后面补个小数点和0
    if (/\.\d$/.test(s)) s += "0"; //正则判断
    while (/\d{4}(\.|,)/.test(s)) //符合条件则进行替换
        s = s.replace(/(\d)(\d{3}(\.|,))/, "$1,$2"); //每隔3位添加一个
    return s;
}*/

function getArrayItems(arr, num) {
    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
    var temp_array = new Array();
    for (var index in arr) {
        temp_array.push(arr[index]);
    }
    //取出的数值项,保存在此数组
    var return_array = new Array();
    for (var i = 0; i<num; i++) {
        //判断如果数组还有可以取出的元素,以防下标越界
        if (temp_array.length>0) {
            //在数组中产生一个随机索引
            var arrIndex = Math.floor(Math.random()*temp_array.length);
            //将此随机索引的对应的数组元素值复制出来
            return_array[i] = temp_array[arrIndex];
            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
            temp_array.splice(arrIndex, 1);
        } else {
            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
            break;
        }
    }
    return return_array;
};

function bind(obj, evname, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(evname, fn, false);
	} else {
		obj.attachEvent('on' + evname, function() {
			fn.call(obj);
		});
	}
};
//对象绑定函数  用法：
/*bind(document, 'click', fn1);*/
