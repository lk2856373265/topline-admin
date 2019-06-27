<template>
  <div>
    <AppAside/>
    <AppHeader/>
    <!--这里的内容是home，评论文章，发布管理...... -->
  </div>
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
</style>
