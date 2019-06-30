<template>
    <div>
      <!-- 筛选区域 -->
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <span>筛选条件</span>
      </div>
        <el-form ref="form" :model="filterParams" label-width="80px">
       <el-form-item label="状态">
        <el-radio-group v-model="filterParams.status">
          <el-radio  label="">全部</el-radio>
          <el-radio v-for="(item, index) in statTypes"
           :key="item.lable"
           :label="index + ''"
           >{{ item.lable }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="频道">
        <el-select v-model="filterParams.channel_id" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option
          v-for="item in channels"
          :key="item.id"
          :label="item.name"
          :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动形式">
        <el-date-picker
        value-format="yyyy-MM-dd"
        v-model="filterParams.begin_end_pubdate"
        @change="handleDateChange"
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
        <span>共找到{{ totalCount }}条符合条件的内容</span>
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
          label="发布状态">
          <template slot-scope="scope">
          <el-tag :type="statTypes[scope.row.status].type">{{ statTypes[scope.row.status].lable }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
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
          total:总记录数
          current-page：当前页码
           2.页面改变，加载对应的页码数据
       -->
    <el-pagination
          background
          layout="prev, pager, next"
          :total="totalCount"
          :disabled="articleLoading"
          :current-page="page"
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
      totalCount: 0,
      articleLoading: false,
      page: 1,
      statTypes: [
        {
          type: 'info',
          lable: '草稿'
        },
        {
          type: '',
          lable: '待审核'
        },
        {
          type: 'success',
          lable: '审核通过'
        },
        {
          type: 'warning',
          lable: '审核失败'
        },
        {
          type: 'danger',
          lable: '已删除'
        }
      ],
      channels: [], // 频道列表
      filterParams: { // 文章查询条件参数
        status: '', // 文章状态
        channel_id: '', // 频道id
        begin_pubdate: '', // 开始时间
        end_pubdate: '' // 结束时间
      },
      begin_end_pubdate: []
    }
  },
  created () {
    // 加载文章列表
    this.onloadArticles()
    // 加载文章频道
    this.onloadChanmels()
  },
  methods: {
    onloadArticles (page = 1) { // 函数参数的默认值
      this.articleLoading = true
      const filterData = {}
      for (let key in this.filterParams) {
        if (this.filterParams[key]) {
          filterData[key] = this.filterParams[key]
        }
      }
      // console.log(filterData)

      this.$http({
        method: 'GET',
        url: '/articles',
        // headers: { // 自定义发送请求头
        //   // Authorization: `Bearer ${userInfo.token}` // 注意 Bearer和token之间要有空格
        // },
        params: {
          page, // 请求数据的页码，不传默认为1
          per_page: 10, // 请求数据的每页大小，不传默认为10
          ...filterData
        }
      }).then(data => {
        this.articles = data.results // 列表数据
        this.totalCount = data.total_count // 总记录数
        this.articleLoading = false
      })
    },
    onSubmit () {
      this.page = 1 // 让分页组件的代码回到第一页
      this.onloadArticles() // 加载第一页的数据
    },
    handleCurrentChange (page) {
      this.page = page
      // 当页码发生改变的时候，请求对应页码的数据
      this.onloadArticles(page)
    },
    onloadChanmels () {
      this.$http({
        method: 'GET',
        url: '/channels'
      }).then(data => {
        this.channels = data.channels
      })
    },
    handleDelete (article) {
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 发送删除请求
        this.$http({
          method: 'DELETE',
          url: `/articles/${article.id}`
        }).then(data => {
          // 提示删除成功
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // console.log(data)
          // 重新加载数据列表
          this.onloadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDateChange (value) {
      // console.log(value)
      this.filterParams.begin_pubdate = value[0]
      this.filterParams.end_pubdate = value[1]
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
