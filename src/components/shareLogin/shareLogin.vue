<template>
  <div class="shareLogin" :class="{'hide':isHide}">
    <div class="login_wrap">
      <div class="login_title">新人注册</div>
      <div class="phone_wrap">
        <input type="text" autocomplete="off" v-model="phone" placeholder="请输入您的手机号" maxlength="11">
      </div>
      <div class="code_wrap">
        <input type="text" autocomplete="off" v-model="code" placeholder="请输入您的验证码" maxlength="4" ref="ipt" :disabled="disabled">
        <span class="send" v-show="getCheckTime <= 0" @click="sendCodeTime">发送验证码</span>
        <span class="time" v-show="getCheckTime > 0">{{getCheckTime}}s后重发</span>
      </div>
      <div class="login_btn" @click="login">立即注册</div>
    </div>
    <div class="login_tips">
      <h2>什么是人人积分商城 <span>？</span></h2>
      <ul>
        <li>人人积分商城致力于为用户提供一站式积分赚取、兑换服务平台。</li>
        <li>在这里，您可以通过 <span>买设备、用设备、日常签到PK赛、不定期活动</span> 等方式赚取积分；</li>
        <li>在这里，到手的积分可兑换技师盒子等众多超值礼品更有精彩活动、爆款游戏不定期上线，让您流连忘返。</li>
      </ul>
    </div>
    <div class="errorTip_wrap" v-if="errorTip">
      <div class="errorTip">{{errorMessage}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "shareLogin",
    components: {},
    data() {
      return {
        disabled: true,
        isHide: false,
        token: "",
        userId: "",
        phone: "",
        code: "",
        getCheckTime: 0,
        errorTip: false,
        errorMessage: "",
        invitationCode: "",
        shareTitle: "人人积分商城",
        shareDesc: "邀新人注册赚积分，换好礼",
        shareUrl: location.origin + `/shareLogin?invitationCode=${this.userId}`,
        shareImg: location.origin + "/static/images/share_logo.png",
      }
    },
    created() {
    },
    beforeMount() {
      this.token = window.localStorage.getItem('token');
      this.userId = window.localStorage.getItem('user_id');
      this.phone = window.localStorage.getItem('phone');
      this.$utils.setTitle("新人注册");
      this.shareUrl = location.origin + `/shareLogin?invitationCode=${this.userId}`;
      this.$wxShare.wxShare(this, this.shareTitle, this.shareDesc, this.shareUrl, this.shareImg);
      this.invitationCode = this.$utils.getParameter("invitationCode");
      this.WXcode = this.$utils.getParameter('code');
      if (this.WXcode === null || this.WXcode === "") {
        let AppId = "wxd182797f554d6b82";
        let local = window.location.href;
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + AppId + "&redirect_uri=" + encodeURIComponent(local) + "&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect";
      }
    },
    mounted() {
      
      alert(this.userId)
      alert(this.shareUrl)
      alert(this.invitationCode)

    },
    watch: {
      phone: function (val) {
        if (this.phone && !/^[1]$|^[1][3,4,5,7,8,9]$|^[1][3,4,5,7,8,9]|^[1][3,4,5,7,8,9][0-9]{9}$/.test(val)) {
          this.phone = this.phone.slice(0, this.phone.length - 1)
        }
      },
      code: function (val) {
        if (this.code && !/^[0-9]+$/.test(val)) {
          this.code = this.code.slice(0, this.code.length - 1)
        }
      }
    },
    computed: {},
    methods: {
      //发送验证码
      sendCodeTime() {
        if (this.phone && /^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.phone)) {
          this.disabled = false;
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
              phone: "+86" + this.phone, //手机号
              type: 3 //1-注册，2-修改密码, 3-登录
            })
          }).then(res => {
          }).catch(error => {
            console.log(error);
          })
        } else if (!this.phone) {
          this.errorMessage = "请输入您的手机号";
          this.errorTip = true;
          window.setTimeout(() => {
            this.errorTip = false;
          }, 1500);
        } else {
          this.errorMessage = "请输入正确的手机号";
          this.errorTip = true;
          window.setTimeout(() => {
            this.errorTip = false;
          }, 1500);
        }
      },
      //免密注册登录
      login() {
        if (this.phone && /^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.phone) && this.code && /^[0-9]{4}$/.test(this.code)) {
          let loginFormData = {
            phone: this.phone,//手机号
            code: this.code,//短信验证码
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
            url: `${this.$baseURL}/v1/rr-points/user/login?invitation_code=${this.intervalCode}`,
            data: this.$querystring.stringify(loginFormData)
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
            this.$Indicator.close();
            this.errorMessage = error.response.data.message;
            this.errorTip = true;
            window.setTimeout(() => {
              this.errorTip = false;
              this.$router.push(`/shareLogin?intervalCode=${this.intervalCode}`)
            }, 1500);
          })
        } else if (!this.phone) {
          this.errorMessage = "请输入您的手机号";
          this.errorTip = true;
          window.setTimeout(() => {
            this.errorTip = false;
          }, 1500);
        } else if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.phone)) {
          this.errorMessage = "请输入正确的手机号";
          this.errorTip = true;
          window.setTimeout(() => {
            this.errorTip = false;
          }, 1500);
        } else if (!this.code) {
          this.errorMessage = "请输入您的验证码";
          this.errorTip = true;
          window.setTimeout(() => {
            this.errorTip = false;
          }, 1500);
        } else if (!/^[0-9]{4}$/.test(this.code)) {
          this.errorMessage = "请输入正确的验证码";
          this.errorTip = true;
          window.setTimeout(() => {
            this.errorTip = false;
          }, 1500);
        } else {
          this.errorMessage = "请输入正确的手机号和验证码";
          this.errorTip = true;
          window.setTimeout(() => {
            this.errorTip = false;
          }, 1500);
        }

      },
      //自动登录+重定向兑吧
      loginBar(userId, token) {
        let dbredirect = "";
        if (this.$utils.getParameter('dbredirect')) {
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
    },
  }
</script>

<style lang="stylus" scoped>
  .hide {
    visibility hidden
  }

  .shareLogin {
    box-sizing border-box
    width 750px
    background: url(../../common/images/bj_login.png) center center no-repeat
    background-size: 100% 100%;
    padding-top 70px
    padding-bottom 107px

    .login_wrap {
      width: 670px;
      height: 580px;
      margin 0 auto
      background-color: #ffffff;
      box-shadow: 0px 0px 19px 5px rgba(0, 4, 56, 0.18);
      border-radius: 30px;
      margin-bottom 58px
      padding 58px 74px

      .login_title {
        font-size: 50px;
        line-height: 50px;
        color: #333333;
        margin-bottom 40px
      }

      .phone_wrap {
        width: 520px;
        height 102px
        border-bottom: solid 1px #bfbfbf; /*no*/

        input {
          width: 520px;
          height 100px
          padding 40px 22px 32px
          font-size: 28px;
          color: #333333;
          font-weight bold
        }
        input:

        :-webkit-outer-spin-button {
          -webkit-appearance: none;
        }
        input:

        :-webkit-inner-spin-button {
          -webkit-appearance: none;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }

        input:

        :-webkit-input-placeholder {
          color #999999;
          font-weight normal
        }
        input:

        :-moz-placeholder {
          color #999999;
          font-weight normal
        }

        input:

        :-moz-placeholder {
          color #999999;
          font-weight normal
        }

        input:

        :-ms-input-placeholder {
          color #999999;
          font-weight normal
        }
      }

      .code_wrap {
        width: 520px;
        height 102px
        border-bottom: solid 1px #bfbfbf; /*no*/
        display flex
        align-items center
        justify-content space-between

        input {
          width 320px
          font-size: 28px;
          color: #333333;
          padding-left 22px
          padding-right 22px
        }

        input[disabled], input:disabled, input.disabled {
          -webkit-text-fill-color: #999999;
          -webkit-opacity: 1;
          opacity: 1;
          background-color #ffffff
        }
        input:

        :-webkit-input-placeholder {
          color #999999;
        }
        input:

        :-moz-placeholder {
          color #999999;
        }

        input:

        :-moz-placeholder {
          color #999999;
        }

        input:

        :-ms-input-placeholder {
          color #999999;
        }

        .send {
          font-size 24px
          width: 160px;
          height: 58px;
          line-height 58px
          border-radius: 29px;
          border: solid 1px #386cff; /*no*/
          text-align center
          color: #386cff;
        }

        .time {
          font-size 24px
          width: 160px;
          height: 58px;
          line-height 58px
          border-radius: 29px;
          border: solid 1px #999999; /*no*/
          text-align center
          color: #999999;
        }

      }

      .login_btn {
        width: 520px;
        height: 80px;
        background-color: #386cff;
        border-radius: 40px;
        margin 0 auto
        font-size: 30px;
        color: #ffffff;
        line-height 80px
        text-align center
        margin-top 90px
      }

    }

    .login_tips {
      width: 670px;
      height: 410px;
      margin 0 auto
      background-color: #ffffff;
      box-shadow: 0px 0px 19px 5px rgba(0, 4, 56, 0.18);
      border-radius: 30px;
      padding-top 34px

      h2 {
        text-align center
        font-size: 33px;
        color: #222222;
        font-weight bold

        span {
          font-size: 72px;
          color: #386cff;
        }
      }

      ul {
        padding 48px 54px

        li {
          font-size: 24px;
          font-weight: normal;
          letter-spacing: 0px;
          color: #333333;
          text-indent 48px
          line-height 30px

          span {
            font-size: 24px;
            color: #222222;
            font-weight bold
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
</style>
