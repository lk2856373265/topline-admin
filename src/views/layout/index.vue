<template>
<el-container>
  <el-aside width="200px"><AppAside/></el-aside>
  <el-container>
    <el-header><AppHeader/></el-header>
    <el-main>Main</el-main>
  </el-container>
</el-container>
  <!-- <div>
    <AppAside/>
    <AppHeader/> -->
    <!--这里的内容是home，评论文章，发布管理...... -->
  <!-- </div> -->
</template>
<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  name: 'AppLayout',
  components: {
    AppAside,
    AppHeader
  },
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #aec0d1;
}
.el-aside {
  background-color: #d0dce7;
}
.el-main {
  background-color: #e8eff4;
}
</style>
