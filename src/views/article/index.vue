<template>
    <div>
      <!-- 筛选区域 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
      </div>
        <el-form ref="form" :model="form" label-width="80px">
       <el-form-item label="特殊资源">
        <el-radio-group v-model="form.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-date-picker
        v-model="form.value1"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
    </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    </el-card>
      <!-- /筛选区域 -->
      <!-- 列表 -->
    <el-card class="list-card">
      <div slot="header" class="clearfix">
        <span>共找到15条符合条件的内容</span>
      </div>
      <!-- table 表格 -->
      <!--
        data用来指定表格的数据
        表格不需要我们手动遍历
        只需要把数据给el-table的data属性就可以了
        然后配置el-table-column需要展示的数据字段即可
       -->
        <el-table
        class="list-table"
        :data="articles"
        v-loading="articleLoading"
        style="width: 100%">
        <el-table-column
          prop="cover.images[0]"
          label="封面"
          width="60">
        <!-- 表格列默认只能输出文本，如果需要自定义里面的内容，则需要 -->
        <!-- slot-scope 是插槽作用域，先听这个名词，scope 中有个成员叫row
        scope.row就是当前的遍历项对象 -->
         <template slot-scope="scope">
            <img width="50" :src="scope.row.cover.images[0]" alt="">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布日期"
          width="180">
        </el-table-column>
        <el-table-column
          prop="status"
          label="发布状态">
        </el-table-column>
        <el-table-column
          label="发布状态">
          <template slot-scope="scope">
            <el-button plain type="success">修改</el-button>
            <el-button plain type="danger" @click='handleDelete(scope.row)'>删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- /table 表格 -->
      <!-- 分页 -->
      <!-- 1.分多少页
          每页多大，默认10条每页，接口也是默认10条
          有多少条数据
           2.页面改变，加载对应的页码数据
       -->
    <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          :disabled="articleLoading"
          @current-change="handleCurrentChange">
    </el-pagination>
    <!-- /分页 -->
    </el-card>
     <!-- /列表 -->
  </div>
</template>

<script>
// const userInfo = JSON.parse(window.localStorage.getItem('user_info'))
export default {
  name: 'ArticleList',
  data () {
    return {
      articles: [],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
        value1: ''
      },
      totalCount: 0,
      articleLoading: false
    }
  },
  created () {
    this.onloadArticles()
  },
  methods: {
    onloadArticles (page = 1) { // 函数参数的默认值
      this.articleLoading = true
      this.$http({
        method: 'GET',
        url: '/articles',
        // headers: { // 自定义发送请求头
        //   // Authorization: `Bearer ${userInfo.token}` // 注意 Bearer和token之间要有空格
        // },
        params: {
          page, // 请求数据的页码，不传默认为1
          per_page: 10 // 请求数据的每页大小，不传默认为10
        }
      }).then(data => {
        this.articles = data.results // 列表数据
        this.totalCount = data.total_count // 总记录数
        this.articleLoading = false
      })
    },
    onSubmit () {
      console.log('submit!')
    },
    handleCurrentChange (page) {
      this.onloadArticles(page)
    },
    handleDelete (article) {
      this.$http({
        method: 'DELETE',
        url: `/articles/${article.id}`
      }).then(data => {
        console.log(data)
      })
    }
  }
}
</script>

<style lang='less' scoped>
  .filter-card {
    margin-bottom: 20px
  }
  .list-table {
    margin-bottom: 30px
  }
</style>
