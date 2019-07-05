/**
 * vue 容器 集中式状态（数据）管理
 * 这里的数据和组件无关
 * 任何组件都可以：
 * 读取
 * 在任何组件中都可以通过 this.$store.state.xxx 来访问
 * state 中的数据也是响应式的，数据改变也会驱动视图更新
 * 修改
 */
// 1.npm i vuex
// 2.配置
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 3.创建容器对象
const store = new Vuex.Store({
  // state存储容器的数据
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
// 4.导出容器对象
export default store

// 5. 在main.js中
// import store from './store'
// ...
// new Vue({
// ...
// store
// ...
// })
