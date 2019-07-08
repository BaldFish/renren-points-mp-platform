import Vue from 'vue'
import Router from 'vue-router'
import myLogin from '@/components/login/login'
import myLogout from '@/components/logout/logout'
import myShare from '@/components/share/share'
import myShareHint from '@/components/shareHint/shareHint'
import myShareLogin from '@/components/shareLogin/shareLogin'
Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path:'/login',
      name:'login',
      component:myLogin
    },
    {
      path:'/logout',
      name:'logout',
      component:myLogout
    },
    {
      path:'/share',
      name:'share',
      component:myShare
    },
    {
      path:'/shareHint',
      name:'shareHint',
      component:myShareHint
    },
    {
      path:'/shareLogin',
      name:'shareLogin',
      component:myShareLogin
    },
  ]
})

