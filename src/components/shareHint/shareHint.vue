<template>
  <div class="shareHint">
    <div class="btn">
      <img src="../../common/images/cancel.png" alt="" @click="turnShare">
    </div>
  </div>
</template>

<script>
  export default {
    name: "shareHint",
    components: {},
    data() {
      return {
        shareTitle:"人人积分商城",
        shareDesc:"邀新人注册赚积分，换好礼",
        shareUrl:location.origin+`/shareLogin?invitationCode=${this.userId}`,
        shareImg:location.origin+"/static/images/share_logo.jpg",
        userId:"",
      }
    },
    created() {
    },
    beforeMount() {
      this.userId = window.localStorage.getItem('user_id');
      this.$utils.setTitle("邀新人注册");
      this.shareUrl=location.origin+`/shareLogin?invitationCode=${this.userId}`;
      this.$wxShare.wxShare(this,this.shareTitle, this.shareDesc,this.shareUrl,this.shareImg);
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {
      turnShare(){
        this.$router.push("/share")
      }
    },
  }
</script>

<style scoped lang="stylus">
  .shareHint {
    width 100%
    min-height 100%
    background: url(../../common/images/share.png) center center no-repeat
    background-size: 100% 100%;
    display flex
    justify-content center
    align-items center
    .btn{
      width 220px
      height 70px
      img{
        width 100%
        height 100%
      }
    }
  }
</style>