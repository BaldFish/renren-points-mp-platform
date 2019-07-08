// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Vuex from 'vuex';

Vue.use(Vuex);

import '@/common/stylus/index.styl';

import 'lib-flexible'

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'

Vue.use(VueAwesomeSwiper);

import axios from 'axios';

Vue.prototype.$axios = axios;

//引入时间选择器
import Calendar from 'vue2-datepick';

Vue.use(Calendar);

import {baseURL,} from '@/common/js/public.js';

Vue.prototype.$baseURL = baseURL;

const querystring = require('querystring');
Vue.prototype.$querystring = querystring;

import _ from 'lodash';

Vue.prototype.$_ = _;

import utils from '@/common/js/utils';

Vue.prototype.$utils = utils;

import wx from 'weixin-js-sdk'
import wxShare from './common/js/share'

Vue.prototype.$wxShare = wxShare;

import VueScroller from 'vue-scroller';

Vue.use(VueScroller);

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import { Loading } from 'vant';
Vue.use(Loading);

Vue.config.productionTip = false;
/* eslint-disable no-new */
const store = new Vuex.Store({
  state: {
    url: "",
    code: "",
  },
  mutations: {}
});
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
// 全局配置

