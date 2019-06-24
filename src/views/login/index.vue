<template>
  <div class="login-wrap">
    <div class="login-form-weap">
  <div class='login-head'>
    <img src="./logo_index.png" alt="黑马头条">
  </div>
     <div class='login-form'>
    <el-form ref="form" :model="form" >
        <el-form-item >
          <el-input v-model="form.mobile" placeholder='请输入手机号'></el-input>
        </el-form-item>
      <el-form-item >
        <el-col :span=10><el-input v-model="form.code" placeholder='验证码'></el-input></el-col>
        <el-col :span=10 :offset=4 ><el-button @click="handleSendCode">发送验证码</el-button></el-col>
        <!-- 支持栅格布局 -->
        </el-form-item>
        <el-form-item>
          <!-- 给组件加class，会作用到他的根元素 -->
          <el-button type="primary" class="btn-login" @click="onSubmit">登录</el-button>
    </el-form-item>
</el-form>
     </div>
  </div>
    </div>
</template>
<script>
import axios from 'axios'
import '@/vendor/gt' // gt.js 会向全局window 暴露一个函数initGeetest
// import { constants } from 'crypto'
export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '17862066801',
        code: ''
      },
      captchaObj: null // 通过initGeetest 得到的极验验证对象
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleSendCode () {
      const { mobile } = this.form
      if (this.captchaObj) {
        return this.captchaObj.verify()
      }
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        const data = res.data.data
        // console.log(res.data)
        window.initGeetest({
        // 以下配置参数来自服务端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind'
        }, (captchaObj) => {
          this.captchaObj = captchaObj
          // 这里可以调用验证实例 captchaObj 的实例方法
          captchaObj.onReady(function () {
            captchaObj.verify()
          }).onSuccess(function () {
            // console.log(captchaObj.getValidate())
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
            captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                seccode,
                validate
              }
            }).then(res => {
              console.log(res.data)
            })
          })
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login-wrap {
 height: 100%;
 display: flex;
 justify-content: center;
 align-items: center;
 background-color: #ccc;
 border-radius: 20px;
 .login-head {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}
}
.login-form-weap {
  background-color: #fff;
  padding: 50px;
  .btn-login {
    width: 100%;
  }
}
</style>
