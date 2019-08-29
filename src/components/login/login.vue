<template>
  <div class="login" :class="{'hide':isHide}">
    <div class="container">
      <div class="content">
        <h4>登录/注册</h4>
        <el-form :model="rueform" :rules="rules" ref="ruleForms">
          <el-form-item prop="phone">
            <div class="input-wraper">
              <img src="../../common/images/shoujihao.png" alt="">
              <el-input class="phone-wrap" v-model="rueform.phone" clearable placeholder="请输入您的手机号"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="verify" class="verify">
            <div class="input-wraper">
              <img src="../../common/images/yanzhengma.png" alt="">
              <el-input clearable class="text" placeholder="请输入您的验证码" v-model="rueform.verify"></el-input>
              <div class="code-btn" @click="sendCodeTime" v-show="getCheckTime <= 0">发送验证码</div>
              <div class="code-btn btn-disable" v-show="getCheckTime > 0">{{getCheckTime}}s后重发</div>
            </div>
          </el-form-item>
        </el-form>
        <span @click="login" class="login-btn">登录</span>
      </div>
    </div>
    <div class="errorTip_wrap" v-if="errorTip">
      <div class="errorTip">{{errorMessage}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    inject: ['reload'],
    name: "login",
    components: {},
    data() {
      var checkPhone = (rule, value, callback) => {
        var reg = /^1[3-9]\d{9}$/; //验证规则
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else {
          if (reg.test(value)) {
            callback();
          } else {
            callback(new Error('请输入正确手机号'));
          }
        }
      };
      var checkVerify = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'));
        } else {
          callback();
        }
      };
      return {
        btn: false,
        rueform: {
          phone: "", // 手机号
          verify: "", // 验证码
        },
        rules: {
          phone: [
            {validator: checkPhone, trigger: 'blur'},
            {}
          ],
          verify: [
            {validator: checkVerify, trigger: 'blur'},
            {min: 1, max: 4, message: '验证码长度不对', trigger: 'blur'}
          ],
          
        },
        intervalCode: null,
        getCheckTime: 0, // 验证码时间
        WXcode: "",
        isHide: false,
        token: "",
        userId: "",
        phone: "",
        errorTip: false,
        errorMessage: ""
      }
    },
    created() {
    },
    beforeMount() {
      this.token = window.localStorage.getItem('token');
      this.userId = window.localStorage.getItem('user_id');
      this.phone = window.localStorage.getItem('phone');
      if (this.getParameter('phone')) {
        this.isHide = true;
        let phone = this.getParameter('phone');
        if (phone === this.phone) {
          this.loginBar(this.userId, this.token)
        } else {
          this.WXcode = this.getParameter('code');
          if (this.WXcode === null || this.WXcode === "") {
            let AppId = "wxd182797f554d6b82";
            let local = window.location.href;
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + AppId + "&redirect_uri=" + encodeURIComponent(local) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
          } else {
            this.turnAutoLogin();
          }
        }
      } else if (this.getParameter('from') && this.getParameter('to')) {
        if (this.token && this.userId) {
          this.isHide = true;
          this.loginZZ(this.userId, this.token)
        }else {
          this.WXcode = this.getParameter('code');
          if (this.WXcode === null || this.WXcode === "") {
            let AppId = "wxd182797f554d6b82";
            let local = window.location.href;
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + AppId + "&redirect_uri=" + encodeURIComponent(local) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
          }
        }
      } else {
        if (this.token && this.userId) {
          this.isHide = true;
          this.loginBar(this.userId, this.token)
        } else {
          this.WXcode = this.getParameter('code');
          if (this.WXcode === null || this.WXcode === "") {
            let AppId = "wxd182797f554d6b82";
            let local = window.location.href;
            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + AppId + "&redirect_uri=" + encodeURIComponent(local) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
          }
        }
      }
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {
      //从URL获取参数
      getParameter(name) {
        let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
        let r = window.location.search.substr(1).match(reg);
        if (r != null) {
          return unescape(r[2]);
        } else {
          return null
        }
      },
      //发送验证码
      sendCodeTime() {
        if (this.rueform.phone && /^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.rueform.phone)) {
          // 开始倒计时
          this.getCheckTime = 60;
          this.intervalCode = setInterval(() => {
            this.getCheckTime = this.getCheckTime - 1;
            if (this.getCheckTime <= 0) {
              window.clearInterval(this.intervalCode);
            }
          }, 1000);
          //请求后端接口获取验证码
          this.$axios({
            method: 'post',
            url: `${this.$baseURL}/v1/sms/code`,
            data: this.$querystring.stringify({
              phone: "+86" + this.rueform.phone, //手机号
              type: 3 //1-注册，2-修改密码, 3-登录
            })
          }).then(res => {
          }).catch(error => {
            console.log(error);
          })
        }
      },
      //免密注册登录
      login() {
        let loginFormData = {
          phone: "+86" + this.rueform.phone,//手机号
          code: this.rueform.verify,//短信验证码
          weixin_code: this.WXcode,//微信用来获取openid的code
          apikey: "",//区块链分配给各接入方的API KEY
          timestamp: "",//时间毫秒数，10进制，5min有效
          sign: "",//签名值
        };
        this.$Indicator.open({
          text: '登录中...',
          spinnerType: 'triple-bounce'
        });
        this.$axios({
          method: 'POST',
          url: `${this.$baseURL}/v1/rr-points/user/login`,
          data: this.$querystring.stringify(loginFormData)
        }).then(res => {
          window.localStorage.setItem('session_id', res.data.data.session_id);
          window.localStorage.setItem('token', res.data.data.token);
          window.localStorage.setItem('user_id', res.data.data.user_id);
          window.localStorage.setItem('phone', res.data.data.phone);
          window.localStorage.setItem('head_img', res.data.data.head_img);
          window.localStorage.setItem('nick_name', res.data.data.nick_name);
          window.localStorage.setItem('openid', res.data.data.openid);
          if(this.getParameter('from') && this.getParameter('to')){
            this.loginZZ(res.data.data.user_id, res.data.data.token)
          }else{
            this.loginBar(res.data.data.user_id, res.data.data.token)
          }
        }).catch(error => {
          localStorage.removeItem('session_id');
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          localStorage.removeItem('phone');
          localStorage.removeItem('head_img');
          localStorage.removeItem('nick_name');
          localStorage.removeItem('openid');
          this.$Indicator.close();
          this.errorMessage = error.response.data.message;
          this.errorTip = true;
          window.setTimeout(() => {
            this.errorTip = false;
            this.$router.push("/login")
          }, 1500);
        })
      },
      //自动登录+重定向兑吧
      loginBar(userId, token) {
        let dbredirect = "";
        if (this.getParameter('dbredirect')) {
          dbredirect = this.getParameter('dbredirect')
        }
        this.$axios({
          method: 'GET',
          url: `${this.$baseURL}/v1/duiba/login?user_id=${userId}&dbredirect=${dbredirect}`,
          headers: {
            'X-Access-Token': token,
          }
        }).then(res => {
          this.$Indicator.close();
          window.location.href = res.data.url
        }).catch(error => {
          localStorage.removeItem('session_id');
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          localStorage.removeItem('phone');
          localStorage.removeItem('head_img');
          localStorage.removeItem('nick_name');
          localStorage.removeItem('openid');
          this.$Indicator.close();
          this.$router.push('/login');
        })
      },
      //昭卓广告自动登录
      loginZZ(userId, token) {
        let dbredirect = "";
        if (this.getParameter('dbredirect')) {
          dbredirect = this.getParameter('dbredirect')
        }
        this.$axios({
          method: 'GET',
          url: `${this.$baseURL}/v1/ignite-adv/url/${userId}`,
          headers: {
            'X-Access-Token': token,
          }
        }).then(res => {
          this.$Indicator.close();
          window.location.href = res.data.url
        }).catch(error => {
          localStorage.removeItem('session_id');
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          localStorage.removeItem('phone');
          localStorage.removeItem('head_img');
          localStorage.removeItem('nick_name');
          localStorage.removeItem('openid');
          this.$Indicator.close();
          this.$router.push('/login?from=duiba&to=ignite');
        })
      },
      //外部公众号跳转至积分商城并自动登录
      turnAutoLogin() {
        let data = {
          phone: this.getParameter('phone'),//用户手机号，无+86前缀
          apikey: this.getParameter('apikey'),//区块链分配给各接入方的API KEY
          timestamp: this.getParameter('timestamp'),//时间毫秒数，10进制，5min有效
          sign: this.getParameter('sign'),//签名值
          weixin_code: this.WXcode,//微信用来获取openid的code
          code: "",//手机验证码
          
        };
        this.$axios({
          method: 'POST',
          url: `${this.$baseURL}/v1/rr-points/user/login`,
          data: this.$querystring.stringify(data)
        }).then(res => {
          window.localStorage.setItem('session_id', res.data.data.session_id);
          window.localStorage.setItem('token', res.data.data.token);
          window.localStorage.setItem('user_id', res.data.data.user_id);
          window.localStorage.setItem('phone', res.data.data.phone);
          window.localStorage.setItem('head_img', res.data.data.head_img);
          window.localStorage.setItem('nick_name', res.data.data.nick_name);
          window.localStorage.setItem('openid', res.data.data.openid);
          this.loginBar(res.data.data.user_id, res.data.data.token)
        }).catch(error => {
          localStorage.removeItem('session_id');
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          localStorage.removeItem('phone');
          localStorage.removeItem('head_img');
          localStorage.removeItem('nick_name');
          localStorage.removeItem('openid');
          this.$router.push('/login');
        })
      },
    },
  }
</script>

<style lang="stylus">
  .hide {
    visibility hidden
  }
  
  .login {
    display flex
    justify-content center
    align-items center
    width 100%
    -o-flex 1
    -moz-flex 1
    -webkit-flex 1
    flex 1
    background url("../../common/images/bj.jpg") no-repeat center
    background-attachment fixed
    -o-background-size 100% 100%
    -moz-background-size 100% 100%
    -webkit-background-size 100% 100%
    background-size 100% 100%
    
    .container {
      width 650px
      height 734px
      background url("../../common/images/modal-bj.jpg") no-repeat center
      background-size 100% 100%
      
      .content {
        margin 100px
        margin-top 200px
        
        h4 {
          text-align center
          font-size 40px /*px*/
          color #091624
        }
        
        .login-btn {
          width 450px
          height 80px
          line-height 80px
          text-align center
          background-color #386cff
          box-shadow 0 0 35px 0 rgba(56, 108, 255, 0.34)
          border-radius 40px
          font-size 36px /*px*/
          color #ffffff
          margin-top 20px
          display inline-block
        }
        
        .el-form {
          .verify {
            .el-form-item__error {
              margin-top -40px !important
            }
            
            .el-input__suffix {
              margin-right 180px
            }
          }
          
          .el-form-item {
            height 100px
            
            img {
              position relative
              top 60px
              z-index 10
              width: 34px;
              height: 40px;
            }
            
            .el-input {
              .el-input__inner {
                height 60px
                font-size 22px /*px*/
                border none
                border-bottom 1px solid #d3deff /*no*/
                border-radius unset
                padding 0 60px
              }
            }
            
            .el-form-item__error {
              font-size 22px /*px*/
              margin-top 10px
            }
            
            .code-btn {
              width 130px
              height 48px
              line-height 48px
              text-align center
              border-radius 22px
              border solid 2px #386cff /*no*/
              font-size 20px
              color: #386cff
              cursor pointer
              float right
              position relative
              top -60px
              right 10px
            }
            
            .btn-disable {
              color: #999999
              border solid 1px #999999
            }
          }
        }
      }
    }
    
    .errorTip_wrap {
      width 100%
      height 100%
      position fixed
      left 0
      top 0
      display flex
      align-items center
      justify-content center
      
      .errorTip {
        line-height 1.6
        max-width 520px;
        padding 20px 30px
        background-color #000000
        opacity 0.7
        font-size 30px; /*px*/
        color #ffffff
        border-radius 30px
      }
    }
  }
  
  /*no*/
</style>