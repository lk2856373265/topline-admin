import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import axios from 'axios'

import 'nprogress/nprogress.css'

// 配置axios的基础路由
// 有了此项配置，就不用每次都写 http://xxxx
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
// 几乎每个组件都要使用axios去发请求，频繁的使用import就非常麻烦
// 我们可以将一些频繁使用的成员放到Vue.prototype中，然后就可以在组件中直接this.xxx使用了
// Vue.prototype.foo = 'bar'

// Add a request interceptor（axios请求拦截器）
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  config.headers.Authorization = `Bearer ${userInfo.token}`
  // console.log('有请求经过了')
  console.log(config)
  return config // 允许通过的方式，本次请求相关的配置对象
}, error => {
  return Promise.reject(error)
})
// Add a response interceptor（axios响应拦截器）
// 统一处理响应的格式
axios.interceptors.response.use(response => { // >=200&&<400的状态码会进入这里
  // console.log('response =>', response)
  return response.data.data
}, error => { // >400的状态码会进入这里
  return Promise.reject(error)
})
// 往Vue原型对象中添加成员，尽量使用 $名字 起名字，目的是防止和组件中的成员冲突
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
