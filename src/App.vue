<template>
  <div id="app">
    <div class="main_wrap">
      <router-view class="main" v-if="isRouterAlive"></router-view>
    </div>
  </div>
</template>

<script>
  
  export default {
    name: 'App',
    components: {},
    provide() {//回退刷新
      return {
        reload: this.reload,
      }
    },
    data() {
      return {
        isRouterAlive: true,
      }
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
    },
    beforeUpdate() {
    },
    computed: {},
    watch: {
      //监听路由变化执行方法
      $route(to, from) {
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(() => {
          this.isRouterAlive = true
        })
      },
    }
  }
</script>

<style lang="stylus">
  #app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #ffffff;
    
    .main_wrap {
      display: flex;
      flex: 1;
      box-sizing: border-box;
      margin: 0 auto;
      width 100%
      min-width 640px
    }
  }
  
  .mint-indicator {
    .mint-indicator-wrapper {
      .mint-indicator-spin{
        .mint-spinner-fading-circle{
          width 50px!important
          height 50px!important
        }
      }
      .mint-indicator-text{
        font-size 30px!important
      }
    }
    
    .mint-indicator-mask {
    }
  }
</style>

