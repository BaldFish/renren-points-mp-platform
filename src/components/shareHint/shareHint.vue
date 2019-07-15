<template>
  <div class="shareHint">
    <div class="btn">
      <img src="../../common/images/cancel.png" alt="">
    </div>
  </div>
</template>

<script>
  export default {
    name: "shareHint",
    components: {},
    data() {
      return {}
    },
    created() {
    },
    beforeMount() {
      this.$utils.setTitle("邀新人注册");
    },
    mounted() {
    },
    watch: {},
    computed: {},
    methods: {},
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
      background: url(../../common/images/cancel.png) center center no-repeat
      background-size: 100% 100%;
    }
  }
</style>