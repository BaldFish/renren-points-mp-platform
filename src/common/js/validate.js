import Vue from 'vue'
import VeeValidate from 'vee-validate';
import zh_CN from 'vee-validate/dist/locale/zh_CN'; //引入中文包，提示信息可以以中文形式显示
import {Validator} from 'vee-validate';

Validator.addLocale(zh_CN); // 设置提示信息中文方式显示

const config = {
  errorBagName: 'errors',
  fieldsBagName: 'fieldBags',
  delay: 100,
  locale: 'zh_CN',
  strict: true,
  enableAutoClasses: true,
  events: 'blur',
  inject: true
};
Vue.use(VeeValidate, config); //一般插件都要use一下

//修改默认错误提示
const dictionary = {
  zh_CN: {
    messages: {
      required: (field) => "请输入" + field,
      confirmed: () => "两次输入密码不一致"
    },
    attributes: {
      realname: '真实姓名',
      idcard: '身份证号',
      email: '邮箱',
      mobile: '手机号',
      mobileRight: '手机号',
      captcha_number: '图形验证码',
      captcha_number_right: '图形验证码',
      code: '手机验证码',
      password: '密码',
      repassword: '重复密码',
      content: "回复内容"
    }
  }
};
Validator.updateDictionary(dictionary);

//自定义的校验规则
Validator.extend('code', {
  messages: {
    zh_CN: (field) => '回复内容长度不在5-300位字符之间'
  },
  validate: value => {
    return 5 <= value.length&& value.length<= 300;
  }
});
Validator.extend('email', {
  messages: {
    zh_CN: (field) => '请填写有效的邮箱地址'
  },
  validate: value => {
    return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value);
  }
});

Validator.extend('mobile', {
  messages: {
    zh_CN: (field) => '请输入正确的手机号'
  },
  validate: (value) => {
    return value.length == 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/.test(value);
  }
});

Validator.extend('mobileRight', {
  messages: {
    zh_CN: (field) => '请输入正确的手机号'
  },
  validate: (value) => {
    return value.length == 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/.test(value);
  }
});

Validator.extend('idcard', {
  messages: {
    zh_CN: (field) => '请输入正确的身份证号'
  },
  validate: (value) => {
    var city = {
      11: "北京",
      12: "天津",
      13: "河北",
      14: "山西",
      15: "内蒙古",
      21: "辽宁",
      22: "吉林",
      23: "黑龙江 ",
      31: "上海",
      32: "江苏",
      33: "浙江",
      34: "安徽",
      35: "福建",
      36: "江西",
      37: "山东",
      41: "河南",
      42: "湖北 ",
      43: "湖南",
      44: "广东",
      45: "广西",
      46: "海南",
      50: "重庆",
      51: "四川",
      52: "贵州",
      53: "云南",
      54: "西藏 ",
      61: "陕西",
      62: "甘肃",
      63: "青海",
      64: "宁夏",
      65: "新疆",
      71: "台湾",
      81: "香港",
      82: "澳门",
      91: "国外 "
    };
    var pass = true;
    
    if (!value || !/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) {
      pass = false;
    } else if (!city[value.substr(0, 2)]) {
      pass = false;
    } else {
      //18位身份证需要验证最后一位校验位
      if (value.length == 18) {
        value = value.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        var sum = 0;
        var ai = 0;
        var wi = 0;
        for (var i = 0; i < 17; i++) {
          ai = value[i];
          wi = factor[i];
          sum += ai * wi;
        }
        var last = parity[sum % 11];
        if (parity[sum % 11] != value[17]) {
          pass = false;
        }
      }
    }
    return pass;
  }
});
