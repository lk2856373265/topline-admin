<template>
<!-- el-select 组件
value 属性 ，用来绑定需要同步的数据
-->
<!-- <div>
   <p>Article Component</p>
</div> -->
  <el-select clearable :value="value" @change="handleChange" >
    <el-option
    v-for="item in channels"
    :key="item.id"
    :label="item.name"
    :value="item.id"
    ></el-option>
  </el-select>
</template>

<script>
// import { constants } from 'crypto';
export default {
  name: 'ArticleChannel',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      channels: [] // 频道列表
    }
  },
  created () {
  // 加载文章频道
    this.onloadChannels()
  },
  methods: {
    handleChange (val) {
      this.$emit('input', val)
    },
    onloadChannels () {
      this.$http({
        method: 'GET',
        url: '/channels'
      }).then(data => {
        this.channels = data.channels
      }).catch(err => {
        console.log(err)
        this.$message.error('加载频道列表失败')
      })
    }
  }
  // components: {}
}
</script>

<style>
</style>
