<template>
  <div class="login" :class="{'hide':isShow}">
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
    <div class="errorTip_wrap">
      <div class="errorTip" v-if="errorTip">{{errorMessage}}</div>
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
          console.log(reg.test(value))
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
        isShow: false,
        token: "",
        userId: "",
        errorTip: false,
        errorMessage: ""
      }
    },
    created() {
    },
    beforeMount() {
      this.token = this.$utils.getCookie("token");
      this.userId = this.$utils.getCookie("user_id");
      if (this.token && this.userId) {
        this.isShow = true;
        this.loginBar(this.userId, this.token)
      } else {
        this.WXcode = this.getParameter('code');
        if (this.WXcode === null || this.WXcode === "") {
          let AppId = "wxd182797f554d6b82";
          let local = window.location.href;
          window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + AppId + "&redirect_uri=" + encodeURIComponent(local) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
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
        if (this.rueform.phone && /^[1][3,4,5,7,8][0-9]{9}$/.test(this.rueform.phone)) {
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
        };
        this.$axios({
          method: 'POST',
          url: `${this.$baseURL}/v1/rr-points/user/login`,
          data: this.$querystring.stringify(loginFormData)
        }).then(res => {
          this.$utils.setCookie('session_id', res.data.data.session_id);
          this.$utils.setCookie('token', res.data.data.token);
          this.$utils.setCookie('user_id', res.data.data.user_id);
          this.$utils.setCookie('phone', res.data.data.phone);
          this.$utils.setCookie('head_img', res.data.data.head_img);
          this.$utils.setCookie('nick_name', res.data.data.nick_name);
          this.$utils.setCookie('openid', res.data.data.openid);
          this.loginBar(res.data.data.user_id, res.data.data.token)
        }).catch(error => {
          console.log(error);
          this.reload();
        })
      },
      //自动登录+重定向兑吧
      loginBar(userId, token) {
        let dbredirect = this.getParameter('dbredirect');
        this.$axios({
          method: 'GET',
          url: `${this.$baseURL}/v1/duiba/login?user_id=${userId}&dbredirect=${dbredirect}`,
          headers: {
            'X-Access-Token': token,
          }
        }).then(res => {
          window.location.href = res.data.url
        }).catch(error => {
          this.$utils.unsetCookie('session_id');
          this.$utils.unsetCookie('token');
          this.$utils.unsetCookie('user_id');
          this.$utils.unsetCookie('phone');
          this.$utils.unsetCookie('head_img');
          this.$utils.unsetCookie('nick_name');
          this.$utils.unsetCookie('openid');
          this.reload();
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
    width 750px
    flex 1
    background url("../../common/images/bj.jpg") no-repeat center
    background-attachment fixed
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
  }
  
  /*no*/
</style>