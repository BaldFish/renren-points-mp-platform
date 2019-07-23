import axios from "axios";
import wx from 'weixin-js-sdk'
import {baseURL,} from '@/common/js/public.js';

export default {
  wxShare: function (_this, shareTitle, shareDesc, shareUrl, shareImg) {
    let url = encodeURIComponent(window.location.href);
    axios({
      method: 'GET',
      url: `${baseURL}/v1/weixin/rrd/auth/share?url=${url}`,
    }).then(res => {
      if (res.data.code === "200") {
        let data = res.data.data;
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: data.appId, // 必填，公众号的唯一标识
          timestamp: data.timestamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，生成签名的随机串
          signature: data.signature, // 必填，签名，见附录1
          jsApiList: data.jsApiList// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        //自定义“分享给朋友”及“分享到QQ”按钮的分享内容（1.4.0）
        wx.ready(function () {
          wx.updateAppMessageShareData({
            title: shareTitle, // 分享标题
            desc: shareDesc, // 分享描述
            link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareImg, // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });
          //自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容（1.4.0）
          wx.updateTimelineShareData({
            title: shareTitle, // 分享标题
            desc: shareDesc, // 分享描述
            link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: shareImg, // 分享图标
            success: function () {
              // 用户确认分享后执行的回调函数
            },
            cancel: function () {
              // 用户取消分享后执行的回调函数
            }
          });
        });
      }
    }).catch(err => {
      console.log(err)
    })
  }
}
