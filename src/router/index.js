import Vue from 'vue'
import Router from 'vue-router'
import myLogin from '@/components/login/login'
import myLogout from '@/components/logout/logout'
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
  ]
})

