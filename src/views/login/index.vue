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
export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '17862066801',
        code: ''
      }
    }
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    handleSendCode () {
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `http://ttapi.research.itcast.cn/mp/v1_0/captchas/${mobile}`
      }).then(res => {
        console.log(res.data)
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
