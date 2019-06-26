<template>
  <div class="logout">
    <div class="container">
      <p>注销当前账户？</p>
      <span @click="logout" class="logout-btn">确定</span>
    </div>
    <div class="errorTip_wrap">
      <div class="errorTip" v-if="errorTip">{{errorMessage}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "logout",
    components: {},
    data() {
      return {
        errorTip: false,
        errorMessage: ""
      }
    },
    created() {
    },
    beforeMount() {
      if (!this.$utils.getCookie("token")) {
        this.$router.push("/login")
      }
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {
      //注销登录
      logout() {
        let token = this.$utils.getCookie("token");
        this.$axios({
          method: 'DELETE',
          url: `${this.$baseURL}/v1/rr-points/user/signout/${token}`,
          headers: {
            'X-Access-Token': token,
          }
        }).then(res => {
          this.$utils.setCookie('session_id', res.data.data.session_id);
          this.$utils.setCookie('token', res.data.data.token);
          this.$utils.setCookie('user_id', res.data.data.user_id);
          this.$utils.setCookie('phone', res.data.data.phone);
          this.$utils.setCookie('head_img', res.data.data.head_img);
          this.$utils.setCookie('nick_name', res.data.data.nick_name);
          this.$utils.setCookie('openid', res.data.data.openid);
          this.errorMessage = "注销成功！";
          this.errorTip = true;
          window.setTimeout(() => {
            this.errorTip = false;
            this.$router.push("/login")
          }, 1500)
        }).catch(error => {
          this.$utils.setCookie('session_id', res.data.data.session_id);
          this.$utils.setCookie('token', res.data.data.token);
          this.$utils.setCookie('user_id', res.data.data.user_id);
          this.$utils.setCookie('phone', res.data.data.phone);
          this.$utils.setCookie('head_img', res.data.data.head_img);
          this.$utils.setCookie('nick_name', res.data.data.nick_name);
          this.$utils.setCookie('openid', res.data.data.openid);
          this.errorMessage = "注销成功！";
          this.errorTip = true;
          window.setTimeout(() => {
            this.errorTip = false;
            this.$router.push("/login")
          }, 1500)
        })
      }
    },
  }
</script>

<style scoped lang="stylus">
  .logout {
    display flex
    justify-content center
    align-items center
    width 750px
    flex 1
    background url("../../common/images/bj.jpg") no-repeat center
    background-attachment fixed
    background-size 100% 100%

    .container {
      width 570px
      height 400px
      background-color #ffffff
      box-shadow 0 4px 43px 0 rgba(83, 83, 83, 0.96)
      border-radius 50px

      p {
        font-size 40px /*px*/
        color #091624
        text-align center
        margin 130px 0 80px 0
      }

      .logout-btn {
        width 450px
        height 80px
        line-height 80px
        text-align center
        background-color #386cff
        box-shadow 0 0 35px 0 rgba(56, 108, 255, 0.34)
        border-radius 40px
        font-size 36px /*px*/
        color #ffffff
        display inline-block
        margin 0 auto
        margin-left 60px
      }
    }

    .errorTip_wrap {
      width 100%
      text-align center
      font-size 0
      position fixed
      top 50%

      .errorTip {
        display inline-block
        box-sizing border-box
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