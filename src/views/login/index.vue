<template>
  <div class="login-wrap">
    <div class="login-form-weap">
  <div class='login-head'>
    <img src="./logo_index.png" alt="黑马头条">
  </div>
     <div class='login-form'>
       <!--
         表单验证:
         rules: 配置验证规则
         将需要验证的字段通过prop属性配置到 el-form-item组件上
         ref：获取表单组件，可以手抖调用表单组件的验证方法 -->
    <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile" placeholder='请输入手机号'></el-input>
        </el-form-item>
      <el-form-item prop="code">
        <el-col :span=10><el-input v-model="form.code" placeholder='验证码'></el-input></el-col>
        <el-col :span=10 :offset=4 >
          <!-- <el-button @click="handleSendCode('ruleForm')">发送验证码</el-button> -->
          <el-button
          @click="handleSendCode('ruleForm')"
          :disabled="!!codeTimer"
          >
          {{codeTimer ? `剩余${codeSeconds}秒` : '获取验证码'}}
          </el-button>
          </el-col>
        <!-- 支持栅格布局 -->
        </el-form-item>
        <el-form-item prop='agree'>
             <el-checkbox v-model="form.agree"></el-checkbox>
             <span>我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
          </el-form-item>
        <el-form-item>
          <!-- 给组件加class，会作用到他的根元素 -->
          <el-button  type="primary" class="btn-login" :loading="loginLoading" @click="handleLogin('ruleForm')">登录</el-button>
    </el-form-item>
</el-form>
     </div>
  </div>
    </div>
</template>
<script>
import axios from 'axios'
import '@/vendor/gt' // gt.js 会向全局window 暴露一个函数initGeetest
const initCodeSeconds = 60
// import { constants } from 'crypto'
export default {
  name: 'AppLogin',
  data () {
    return {
      form: { // 表单数据
        mobile: '17862066801',
        code: '',
        agree: '' // 是否同意用户协议
      },
      loginLoading: false, // 登录按钮的loading状态
      rules: { // 表单验证规则
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { len: 11, message: '长度必须为11个数字', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '长度必须为6个字符', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议', trigger: 'change' },
          { pattern: /true/, message: '请同意用户协议', trigger: 'change' }
        ]
      },
      captchaObj: null, // 通过initGeetest 得到的极验验证对象
      codeSeconds: initCodeSeconds, // 倒计时时间
      codeTimer: null // 倒计时定时器
    }
  },
  methods: {
    handleLogin (ruleForm) {
      // 表单组件有一个方法validate , 可以获取当前表单的验证状态
      this.$refs[ruleForm].validate((valid) => {
        if (!valid) {
          return
        }
        // 表单验证通过，提交登录
        this.login()
      })
    },
    login () {
      this.loginLoading = true
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => { // 大于200 && <=400的状态码都会经过这里
        this.$message({
          showClose: true,
          message: '登录成功',
          type: 'success'
        })
        this.loginLoading = false
        // 建议路由传参都使用name 去跳转，路由传参非常方便
        this.$router.push({
          name: 'home'
        })
      })
        .catch(err => { // >=400的HTTP状态码都会进入catch中
          if (err.response.status === 400) {
            this.$message.error('登录失败，手机号或验证码错误')
            // console.dir(err)
          }
          this.loginLoading = false
        })
    },
    handleSendCode (ruleForm) {
      // 校验手机号是否有效
      this.$refs[ruleForm].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }
        // 手机号码有效，初始化验证码
        this.showGeetest()
      })
    },
    showGeetest () {
      const { mobile } = this.form
      if (this.captchaObj) {
        return this.captchaObj.verify()
      }
      // 函数中的 function 定义的函数中的this指向window
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
          captchaObj.onReady(() => {
            captchaObj.verify()
          }).onSuccess(() => {
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
              // console.log(res.data)
              // 发送短信后开始倒计时
              this.codeCountDown()
            })
          })
        })
      })
    },
    /**
     * 倒计时
     */
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeSeconds--
        if (this.codeSeconds <= 0) {
          this.codeSeconds = initCodeSeconds // 让倒计时时间回到初始状态
          window.clearInterval(this.codeTimer) // 清除倒计时
          this.codeTimer = null // 清除定时器倒计时的标志
        }
      }, 1000)
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
