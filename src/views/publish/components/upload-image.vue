<template>
  <div class="box-wrap">
    <p>点击选择图片</p>
   <i
   style="margin-top: 20px;
   font-size: 90px; color:#eee"
   class="iconfont iconapple "
   ></i>
   <img width="120" src="../../../assets/avatar2.jpg" >
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  data () {
    return {}
  },
  components: {}
}
</script>

<style lang="less" scoped>
.box_wrap {
  width: 200px;
  height: 200px;
  border: 1px solid #eee;
  cursor: pointer;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center
}
</style>
