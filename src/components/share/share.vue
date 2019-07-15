<template>
  <div class="share">
    <div class="shareImg_wrap">
      <img src="../../common/images/bj_share_text.png" alt="">
    </div>
    <div class="btn">
      <img src="../../common/images/invite.png" alt="">
    </div>
    <div class="title_wrap">我的奖励</div>
    <div class="rewards_out">
      <div class="rewards_in">
        <div class="in_left">
          <div class="in_left_top">已获得奖励</div>
          <div class="in_left_bottom">100</div>
        </div>
        <div class="in_middle"></div>
        <div class="in_right">
          <div class="in_right_top">已邀请好友</div>
          <div class="in_right_bottom">4</div>
        </div>
      </div>
    </div>
    <div class="title_wrap">奖励排行</div>
    <div class="rewards_out swiper_out">
      <div class="rewards_in">
        <div class="case_wrap">
          <swiper :options="caseOption" class="case_swiper" ref="caseOption">
            <swiper-slide v-for="(slide, index) in caseOption.slides" :key="index" v-if="caseOption.slides.length">
              <img src="../../common/images/tongzhi.png" alt="">用户：{{slide.name}} 刚刚获得<span>{{slide.num}}</span>积分奖励
            </swiper-slide>
            <!--            <div class="swiper-pagination" slot="pagination" v-if="caseOption.slides.length>1"></div>-->
          </swiper>
        </div>
      </div>
    </div>
    <div class="title_wrap">活动规则</div>
    <div class="rewards_out">
      <div class="rewards_in rule">
        <ul>
          <li>
            <span class="dot"></span>
            <span class="text">活动时间：2019年7月02日10:00:00-7月28日 23:59:59 ；</span>
          </li>
          <li>
            <span class="dot"></span>
            <span class="text">点击“<span class="t1">立即邀请</span>”，发送本页面给微信好友或朋友圈，新人好友点击页面并成功注册后，邀请者可直接获赠5积分";</span></li>
          <li>
            <span class="dot"></span>
            <span class="text">积分可叠加累计，好友将页面二次转发，并成功邀请新人注册后，首轮发起邀请者可叠加获赠2积分；</span>
          </li>
          <li>
            <span class="dot"></span>
            <span class="text">分享次数不设限，邀请好友越多，所获积分越多；</span>
          </li>
          <li>
            <span class="dot"></span>
            <span class="text">本活动最终解释权归人人积分商城所有。</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "share",
    components: {},
    data() {
      return {
        caseOption: {
          pagination: {
            el: '.swiper-pagination'
          },
          slides: [{
            name: "张三",
            num: "60"
          },
            {
              name: "李四",
              num: "50"
            },
            {
              name: "王五",
              num: "40"
            }],
          autoplay: {
            delay: 5000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          loop: true,
          direction: 'vertical',
          effect: '',
          slidesPerView: 3,
        },
      }
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
  .share {
    width 750px
    min-height 100%
    background: -webkit-linear-gradient(top, #15195b, #5028a5); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(top, #15195b, #5028a5); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(top, #15195b, #5028a5); /* Firefox 3.6 - 15 */
    background: linear-gradient(top, #15195b, #5028a5); /* 标准的语法 */
    padding-bottom 96px
    
    .shareImg_wrap {
      width 750px
      margin 0 auto
      
      img {
        width 100%
        height 100%
      }
    }
    
    .btn {
      width 584px
      margin 0 auto
      text-align center
      
      img {
        width 100%
        height 100%
      }
    }
    
    .title_wrap {
      width 424px
      height 80px
      background: url(../../common/images/tittle.png) left center no-repeat
      background-size: 100% 100%;
      margin 0 auto
      text-align center
      font-size: 32px;
      line-height 66px
      color: #ffffff;
      margin-top 43px
      margin-bottom 28px
    }
    
    .rewards_out {
      padding 10px 12px 12px
      width: 683px;
      background-color: #69cffa;
      box-shadow: 4px 0px 7px 1px rgba(117, 226, 250, 0.25);
      border-radius: 20px;
      margin 0 auto
      
      .rewards_in {
        width: 660px;
        //height: 240px;
        background-color: #ffffff;
        border-radius: 25px;
        border: solid 1px #ffffff; /*no*/
        padding-top 59px
        padding-bottom 49px
        display flex
        align-items center
        justify-content center
        
        .in_left {
          text-align center
          
          .in_left_top {
            font-size: 36px;
            color: #333333;
            margin-bottom 58px
          }
          
          .in_left_bottom {
            font-size: 36px;
            font-weight bold
            color: #333333;
          }
        }
        
        .in_middle {
          width: 2px;
          height: 102px;
          background-color: #eeeeee;
          margin 0 60px
        }
        
        .in_right {
          text-align center
          
          .in_right_top {
            font-size: 36px;
            color: #333333;
            margin-bottom 58px
          }
          
          .in_right_bottom {
            font-size: 36px;
            font-weight bold
            color: #333333;
          }
        }
        
        ul {
          padding 0 18px
          
          li {
            display flex
            flex-wrap wrap
            
            .dot {
              width: 18px;
              height: 18px;
              border-radius 50%
              background-color: #bfbfbf;
              margin-right 10px
              margin-top 8px;
            }
            
            .text {
              width 590px
              font-size: 22px;
              color: #222222;
              line-height 36px;
              
              .t1 {
                font-size: 24px;
                color: #222222;
                font-weight bold
              }
            }
          }
        }
        
      }
      
      .rule {
        padding-top 50px
        padding-bottom 25px
      }
    }
    
    .swiper_out {
      .rewards_in {
        padding-top 10px
        padding-bottom 10px
        justify-content left
        
        .case_wrap {
          height 126px
          position relative
          
          .case_swiper {
            height 126px
            line-height 42px
            .swiper-wrapper {
              height 42px
              line-height 42px
              font-size 24px
              color: #666666;
              img {
                vertical-align middle
                margin-left 36px
                margin-right 20px
              }
              span{
                color: #333333;
              }
            }
          }
          
        }
      }
    }
  }
</style>