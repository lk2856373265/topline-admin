<template>
  <div>
    <el-card class="image-card">
      <div slot="header">
        <span>素材管理</span>
      </div>
     <div class="action">
        <el-radio-group v-model="active">
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="收藏"></el-radio-button>
        </el-radio-group>
        <el-button type="primary">上传图片</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="8" v-for="item in images" :key="item.id">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url" class="image" style="max-width: 100%">
          <div style="padding: 10px; display:flex; justift-content: center; ">
            <el-button type="primary"
             icon="el-icon-delete"
              circle
              plain
              @click="handleDelete(item)"
              ></el-button>
            <el-button type="primary"
            :icon="item.is_collected ?'el-icon-star-on' : 'el-icon-star-off'"
             circle
             plain
             @click="handleCollect(item)"
             ></el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
  </div>
</template>

<script>
// import { constants } from 'crypto'
export default {
  name: 'ArticleImage',
  data () {
    return {
      active: '全部',
      images: []
    }
  },
  created () {
    this.loadImages()
  },
  methods: {
    async loadImages () {
      this.$http({
        method: 'GET',
        url: '/user/images'
      }).then(data => {
        this.images = data.results
      })
    },
    handleCollect (item) {
      const collect = !item.is_collected
      this.$http({
        method: 'PUT',
        url: `/user/images/${item.id}`,
        data: {
          collect: !item.is_collected
        }
      }).then(data => {
        item.is_collected = collect
        this.$message({
          type: 'success',
          message: `${collect ? '' : '取消'}收藏成功`
        })
      }).catch(err => {
        console.log(err)
        this.$message.error(`${collect ? '' : '取消'}收藏失败`)
      })
    },
    handleDelete (item) {
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        }).then(data => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          // 删除成功，刷新数据列表
          this.loadImages()
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('删除失败')
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style land="less" scoped>
.action {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between
}
</style>
