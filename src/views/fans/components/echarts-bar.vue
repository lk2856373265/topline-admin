<template>
<!-- 准备一个画布容器 -->
<!--
不要使用id操作DOM，还是会有冲突的问题
vue 中获取DOM 的方式
1.给节点声明ref
2.this.$refs.ref名字 来访问
一个组件中不要有同名ref
 -->
  <div ref="main" style="width: 600px;height:400px;"></div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: '',
  data () {
    return {}
  },
  mounted () {
    // 初始化图表组件
    this.initChart()
    // 发请求，更新数据
  },
  methods: {
    initChart () {
      var myChart = echarts.init(this.$refs.main)
      // 显示标题，图例和空的坐标轴
      myChart.setOption({
        title: {
          text: '异步数据加载示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: []
        }]
      })
    }
  }
}
</script>

<style>
</style>
