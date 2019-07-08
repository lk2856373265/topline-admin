import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.less'
import axios from 'axios'
import JSONbig from 'json-bigint'
import store from './store'

import 'nprogress/nprogress.css'

// 配置axios的基础路由
// 有了此项配置，就不用每次都写 http://xxxx
// axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0/'
axios.defaults.baseURL = 'http://toutiao.course.itcast.cn/mp/v1_0/'
// 由于后端的数据id超出了Javascript的安全整数范围，会导致整数无法精确显示
// 使用JSONbig 处理返回数据中超出JavaScript安全整数范围的数字
axios.defaults.transformResponse = [function (data) {
  // data数据可能不是标准的json格式字符串，会导致JSONbig.parse(data)转换失败报错
  try {
    return JSONbig.parse(data)
  } catch {
    return data
  }
}]
// 几乎每个组件都要使用axios去发请求，频繁的使用import就非常麻烦
// 我们可以将一些频繁使用的成员放到Vue.prototype中，然后就可以在组件中直接this.xxx使用了
// Vue.prototype.foo = 'bar'

// Add a request interceptor（axios请求拦截器）
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
  if (userInfo) { // 如果登录了，才给那些需要token的接口添加token令牌
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }
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
  // 将响应数据处理成统一的数据格式方便使用
  // return response.data.data
  if (typeof response.data === 'object' && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, error => { // >400的状态码会进入这里
  const status = error.response.status
  if (status === 401) {
    // 务必删除本地存储中的用户信息数据
    window.localStorage.removeItem('user_info')
    router.push({
      name: 'login'
    })
  }
  return Promise.reject(error)
})
// 往Vue原型对象中添加成员，尽量使用 $名字 起名字，目的是防止和组件中的成员冲突
Vue.prototype.$http = axios

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
