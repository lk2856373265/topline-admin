<template>
  <el-row class="app-header">
    <el-col :span="14">江苏传智播客教育科技股份有限公司</el-col>
    <el-col :span="10">
            <el-dropdown trigger="click">
        <span class="el-dropdown-link">
          <img width="30" :src="$store.state.user.photo" alt="">
          {{ $store.state.user.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>账户设置</el-dropdown-item>
          <!--
            给组件注册原生事件 ：@原生事件类型.native="处理函数"
            .native修饰符
            该事件会被注册给组件的根元素
           -->
          <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'AppHeader',
  data () {
    return {
      // user_info: {}
    }
  },
  created () {
    // this.user_info = JSON.parse(window.localStorage.getItem('user_info'))
  },
  methods: {
    handleLogout () {
      this.$confirm('确定退出吗', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清楚本地用户中的存储信息 $store.state.user
        window.localStorage.removeItem('user_info')
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        // 跳转到登录页面
        this.$router.push({
          name: 'login'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.app-header {
  height: 60px;
  display: flex;
  align-items: center
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>
