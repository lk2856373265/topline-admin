import Vue from 'vue'
import nprogress from 'nprogress'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      // name: 'layout', 由于它有默认子路由，所以他的名字没有意义，否则vue会黄牌警告
      path: '/',
      component: () => import('@/views/layout'),
      // 嵌套路由
      children: [ // 所有 children 路由都显示到父路由的router-view 中
        {
          name: 'home',
          path: '', // 它就是layout 的默认子路由
          component: () => import('@/views/home')
        },
        {
          name: 'publish',
          path: '/publish',
          component: () => import('@/views/publish')
        },
        {
          name: 'article-list',
          path: '/article',
          component: () => import('@/views/article')
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: () => import('@/views/login')
    }
  ]
})
/**
 * 所有路由导航都要经过这里
 * to 要去哪
 * from 来自哪里
 * next 允许通过的方法
 */
router.beforeEach((to, from, next) => {
  nprogress.start()
  const userInfo = window.localStorage.getItem('user_info')
  // 如果是非登录页面（/login）,判断其登录状态
  // console.log(to)
  if (to.path !== '/login') {
    // 如果没有登录，让其跳转到登录页
    if (!userInfo) {
      next({ name: 'login' })
    } else {
      // 如果登录了，则允许通过
      next()
    }
  } else {
    // 如果登录了，就不允许访问登录页了
    if (userInfo) {
      next(false)
    } else {
      // 没有登录，才允许访问登录页
      next()
    }
  }
})
/**
 * 路由导航完成时会进入这里
 */
router.afterEach((to, from) => {
  nprogress.done()
})
export default router
