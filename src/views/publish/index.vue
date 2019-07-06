<template>
  <el-card class="publish-card">
    <div slot="header" class="header">
      <span>发布文章</span>
      <div>
        <el-button type="success"
         @click="handlePublish(false)"
         :loading="publishLoading"
         >{{ isEdit? '修改' : '发布'}}</el-button>
        <el-button type="primary"
         @click="handlePublish(true)"
         :loading="publishLoading"
         >存入草稿</el-button>
      </div>
    </div>
    <el-form v-loading="isEdit && editLoading">
      <el-form-item >
        <el-input type="text" v-model="articleForm.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item>
             <quill-editor v-model="articleForm.content"
                ref="myQuillEditor"
                :options="editorOption"
              >
            </quill-editor>
      </el-form-item>
      <el-form-item label="封面">
      </el-form-item>
      <el-form-item label="频道">
        <!--
          组件通信
          父传子：Props Down
          子传父:Events Up
         -->
         <!-- <article-channel
          :value="articleForm.channel_id"
          @input="articleForm.channel_id=$event"
         >
        </article-channel> -->
        <!--
          v-model就是
          :value="articleForm.channel_id"
          @input="articleForm.channel_id=$event"
          的简写
         -->
        <article-channel
        v-model="articleForm.channel_id"
         >
        </article-channel>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import ArticleChannel from '@/components/article-channel'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
// 如果是更新，则在第一次更新数据后开启监视
// 如果是添加，则一上来就开启监视
// 如果是从更新页面导航到发布页面，则清空表单数据
// 如果是从发布页面导航到发布页面，则重新加载编辑

// import { constants } from 'crypto'
export default {
  name: 'AppPublish',
  components: {
    ArticleChannel,
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: '', // 标题
        content: '', // 内容
        cover: { // 封面
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: [] // 图片
        },
        channel_id: '' // 频道
      },
      editorOption: {}, //  富文本编辑器相关参数选项
      editLoading: false,
      publishLoading: false,
      formDirty: false,
      firstEditData: false
    }
  },
  /**
   * 监视器，我们可以监视组价实例中的成员
   * 当成员发生改变时，监视函数会被调用
   * 注意：这里配置的监视无法取消，会重复监视
   *   如果需要一个可以取消的监视，则需要通过this.$watch发方式进行监视
   */
  // watch: {
  //   articleForm: {
  //     handler () { // 当被监视数据发生改变时会被调用
  //     // 如果是第一次编辑更新导致的数据的改变，不让this.formDirty为true
  //       if (this.firstEditData) {
  //         this.formDirty = false
  //       } else {
  //         this.formDirty = true
  //       }
  //     },
  //     deep: true // 对象、数组类型需要配置深度监视，普通数据不需要
  //     // immidiate: true或false 默认只有当被监视成员发生改变时才会调用监视函数，如果希望初始的时候就调用一次，则可以配置该值为true
  //   }
  // },
  computed: {
    editor () {
      return this.$refs.myQuillEditor.quill
    },
    isEdit () {
      return this.$route.name === 'publish-edit'
    },
    articleId () {
      return this.$route.params.id
    }
  },
  created () {
    if (this.isEdit) {
      this.loadArticle()
    }
    // 如果是发布页面，则直接开启监视
    if (this.$route.name === 'publish') {
      this.watchForm()
    }
  },
  mounted () {
    console.log('this is current quill instance object', this.editor)
  },

  methods: {
    loadArticle () {
      this.editLoading = true
      this.$http({
        method: 'GET',
        url: `/articles/${this.articleId}`
      }).then(data => {
        // 编辑页面，修改表单数据，动态加载表单内容
        // 这个数据的修改也会触发对表单数据的监视
        // 这个数据非用户修改的数据，所以不需要监视

        this.articleForm = data
        this.editLoading = false
        // this.watchForm()
        this.$nextTick(() => {
          // 更新数据加载号以后开始监视
          this.watchForm()
        })
      }).catch(err => [
        console.log(err),
        this.$message.error('加载文章详情失败')
      ])
    },
    handlePublish (draft = false) {
      this.publishLoading = true
      if (this.isEdit) {
        // 执行编辑操作
        this.handleSubmitEdit(draft).then(() => {
          this.publishLoading = false
        })
      } else {
        // 执行添加操作
        this.handleSubmitAdd(draft).then(() => {
          this.publishLoading = false
        })
      }
    },
    handleSubmitEdit (draft) {
      return this.$http({
        method: 'PUT',
        url: `/articles/${this.articleId}`,
        data: this.articleForm,
        params: {
          draft
        }
      }).then(data => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('修改失败')
      })
    },
    handleSubmitAdd (draft) {
      return this.$http({
        method: 'POST',
        url: '/articles',
        data: this.articleForm,
        params: {
          draft
        }
      }).then(data => {
        this.$message({
          type: 'success',
          message: '发布成功'
        })
      }).catch(err => {
        console.log(err)
        this.$message.error('发布失败')
      })
    },
    watchForm () {
      const unWatch = this.$watch('articleForm', function () {
        this.formDirty = true
        // 关闭监视器
        unWatch()
      }, {
        deep: true
      })
    }
  },
  // components: {}
  /**
   * 要从当前导航到另一个路由时触发
   * 我们可以在这里控制路由离开的行为
   * 例如，如果当前页面有未保存的数据，我们就提示用户
   */
  beforeRouteLeave (to, from, next) {
    // 如果当前页面有未保存的数据，
    if (!this.formDirty) {
      return next()
    }
    const answer = window.confirm('当前有未保存的数据，确认离开吗？')
    if (answer) {
      next()
    } else {
      next(false)
    }
  }
}
</script>
<style lang="less" scoped>
.publish-card {
  min-height: 100%;
   .header {
   display: flex;
   justify-content: space-between;
   align-items: center
   }
 }
</style>
