/**
 * vue 容器 集中式状态（数据）管理
 * 这里的数据和组件无关
 * 任何组件都可以：
 * 读取
 * 在任何组件中都可以通过 this.$store.state.xxx 来访问
 * state 中的数据也是响应式的，数据改变也会驱动视图更新
 * 修改
 * 不要在组件中直接 this.$store.state.xxx = xxx 修改容器数据
 * 正确是修改方式是：
 * 1.在容器中定义mutation函数 修改state状态
 * 2.在组件中提交mutation 完成对状态的修改
 * 说白了，就是不要在组件中修改state数据，而是在容器中修改state数据
 */
// 1.npm i vuex
// 2.配置
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
// 3.创建容器对象
const store = new Vuex.Store({
  // state存储容器的数据，类似于组件中的data
  state: {
    user: JSON.parse(window.localStorage.getItem('user_info'))
  },
  // mutation类似于组件中的methods
  // 记住一个原则：修改state永远通过mutation函数修改 不要在组件中this.$store.state.xxx = xxx修改
  // 函数自己定义，函数默认接收一个参数state，也就是容器中的state
  // 我们可以在mutation函数中去 state.xxx = xxx
  mutations: {
    changeUser (state, data) {
      // 修改容器中的用户信息。对象拷贝，将data中的数据成员拷贝到state.user中
      Object.assign(state.user, data)
      // 将修改后的用户信息保存到本地存储
      window.localStorage.setItem('user_info', JSON.stringify(state.user))
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
