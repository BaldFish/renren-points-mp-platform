import {deepClone} from "vant/es/utils/deep-clone";

let utils = {
  /*  1
  函数，加法函数，用来得到精确的加法结果
  说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
  调用：Calc.Add(arg1,arg2,d)
  返回值：两数相加的结果
  */
  add: function (arg1, arg2) {
    arg1 = arg1.toString(), arg2 = arg2.toString();
    var arg1Arr = arg1.split("."), arg2Arr = arg2.split("."), d1 = arg1Arr.length == 2 ? arg1Arr[1] : "",
      d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
    var maxLen = Math.max(d1.length, d2.length);
    var m = Math.pow(10, maxLen);
    var result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
    var d = arguments[2];
    return typeof d === "number" ? Number((result).toFixed(d)) : result;
  },
  /*  2
  函数：减法函数，用来得到精确的减法结果
  说明：函数返回较为精确的减法结果。
  参数：arg1：第一个加数；arg2第二个加数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数
  调用：Calc.Sub(arg1,arg2)
  返回值：两数相减的结果
  */
  subtract: function (arg1, arg2) {
    return Calc.Add(arg1, -Number(arg2), arguments[2]);
  },
  /*  3
  函数：乘法函数，用来得到精确的乘法结果
  说明：函数返回较为精确的乘法结果。
  参数：arg1：第一个乘数；arg2第二个乘数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
  调用：Calc.Mul(arg1,arg2)
  返回值：两数相乘的结果
  */
  multiply: function (arg1, arg2) {
    var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
    m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
    resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  },
  /*  4
  函数：除法函数，用来得到精确的除法结果
  说明：函数返回较为精确的除法结果。
  参数：arg1：除数；arg2被除数；d要保留的小数位数（可以不传此参数，如果不传则不处理小数位数)
  调用：Calc.Div(arg1,arg2)
  返回值：arg1除于arg2的结果
  */
  divide: function (arg1, arg2) {
    var r1 = arg1.toString(), r2 = arg2.toString(), m, resultVal, d = arguments[2];
    m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
    resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
    return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
  },
  /*  5
  函数：时间格式化函数
  说明：
  参数：
  调用：
  返回值：
  */
  formatDate: function (date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    let o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? str : utils.padLeftZero(str)
        );
      }
    }
    return fmt;
  },
  /*  6
  函数：时间补零函数
  说明：
  参数：
  调用：
  返回值：
  */
  padLeftZero: function (str) {
    return ("00" + str).substr(str.length);
  },
  /*  7
  函数：搜索关键字高亮函数
  说明：
  参数：string：需要匹配的数据（string类型），searchInput：搜索的关键字（string类型），attribute：css样式属性（）,value：css相对应的属性值
  调用：
  返回值：
  */
  searchHighlight: function (string, searchInput, attribute, value) {
    let replaceReg = new RegExp(searchInput, 'ig');
    let replaceString = `<span style=${attribute + ":" + value}>${searchInput}</span>`;
    return string.replace(replaceReg, replaceString)
  },
  /*  8
 函数：创建Cookie
 说明：
 参数：
 调用：
 返回值：
 */
  setCookie: function (name, value, expires, path, domain, secure) {
    let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires instanceof Date) {
      cookieText += '; expires=' + expires;
    }
    if (path) {
      cookieText += '; expires=' + expires;
    }
    if (domain) {
      cookieText += '; domain=' + domain;
    }
    if (secure) {
      cookieText += '; secure';
    }
    document.cookie = cookieText;
  },
  /*  9
 函数：获取Cookie
 说明：
 参数：
 调用：
 返回值：
 */
  getCookie: function (name) {
    let cookieName = encodeURIComponent(name) + '=';
    let cookieStart = document.cookie.indexOf(cookieName);
    let cookieValue = null;
    if (cookieStart > -1) {
      let cookieEnd = document.cookie.indexOf(';', cookieStart);
      if (cookieEnd == -1) {
        cookieEnd = document.cookie.length;
      }
      cookieValue = decodeURIComponent(
        document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
    }
    return cookieValue;
  },
  /*  10
 函数：删除Cookie
 说明：
 参数：
 调用：
 返回值：
 */
  unsetCookie: function (name) {
    document.cookie = name + "= ; expires=" + new Date(0);
  },
  /*11
  函数：设置title，解决微信改不了title的bug
  说明：
  参数：
  调用：
  返回值：
  */
  setTitle: function (title) {
    document.title = title;
    let userAgent = window.navigator.userAgent.toLowerCase();
    let isiOS = userAgent.indexOf('applewebkit') >= 0;
    let isWechat = userAgent.indexOf('micromessenger') >= 0;
    if (isiOS && isWechat) {
      let iframe = document.createElement('iframe');
      iframe.src = '';
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      iframe.onload = function () {
        setTimeout(function () {
          iframe.remove();
        }, 0)
      }
    }
  },
  /*12
  函数：获取URL参数
  说明：
  参数：
  调用：
  返回值：
  */
  getParameter: function (name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    } else {
      return null
    }
  },
  /*13
  函数：解决input输入框获取焦点时在页面位置
  说明：iOS 微信客户端6.7.4 键盘收起页面不下移bug
  参数：
  调用：
  返回值：
  */
  solveInputBug: function () {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      // 注：window.onresize只能在项目内触发1次
      let height = window.innerHeight;
      window.onresize = function () {
        // 通过捕获系统的onresize事件触发我们需要执行的事件
        this.myWidth = window.innerHeight;
        if (this.myWidth < height) {
          document.querySelectorAll('#footer')[0].style = "position:static"
        } else {
          document.querySelectorAll('#footer')[0].style = "position:fixed;bottom:0"
        }
        if (document.activeElement.tagName === 'INPUT') {
          document.activeElement.scrollIntoView({behavior: "smooth"})
        }
      }
    }
    ;
    //处理iOS 微信客户端6.7.4 键盘收起页面未下移bug
    ;(/iphone|ipod|ipad/i.test(navigator.appVersion)) && document.addEventListener('blur', (e) => {
      // 这里加了个类型判断，因为a等元素也会触发blur事件
      setTimeout(function () {
        //['input', 'textarea'].includes(e.target.localName) && e.target.scrollIntoView()
        if (['input', 'textarea'].includes(e.target.localName)) {
          document.body.scrollTop = document.body.scrollTop;
        }
      }, 100)
    }, true)
  },
  /*14
  函数：实现深拷贝
  说明：保留继承关系，可以实现各种类型拷贝，实现递归拷贝
  参数：
  调用：
  返回值：
  */
  deepClone: function (obj) {
    if (typeof obj !== 'object'||typeof obj == 'null') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj);
    }
    if (obj instanceof RegExp) {
      return new RegExp(obj);
    }
    let o = new obj.constructor();//保留类的继承关系
    for (let key in obj) {
      o[key] = typeof obj[key] === 'object' ? utils.deepClone(obj[key]) : obj[key]
    }
    return o
  },
  /*15
  函数：判断数据类型
  说明：
  参数：
  调用：
  返回值：
  */
  getType: function (obj) {
    let type = typeof obj;
    if (type != "object") {
      return type;
    }
    return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');
  },
  /*getType:function (obj){
  let str = Object.prototype.toString.call(obj);
  let map={
    '[object Boolean]'  : 'boolean',
    '[object Number]'   : 'number',
    '[object String]'   : 'string',
    '[object Function]' : 'function',
    '[object Array]'    : 'array',
    '[object Date]'     : 'date',
    '[object RegExp]'   : 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]'     : 'null',
    '[object Object]'   : 'object'
  };
  if(obj instanceof Element){ //判断是否是dom元素，如div等
    return "element";
  }
  return map[str];
},*/
};
export default utils
