<template>
<div>
     <p>粉丝概况 Component</p>
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 600px;height:400px;"></div>
    <EChartsBar/>
</div>
</template>

<script>
// 1.npm i echarts
// 2.在使用的组件中加载 echarts
// 3.在绘图前我们需要为 ECharts 准备一个具备高宽的 DOM 容器。
// 4.基于DOM容器初始化echarts

import echarts from 'echarts'
import EChartsBar from './components/echarts-bar.vue'
export default {
  name: 'FansOverview',
  components: {
    EChartsBar
  },
  data () {
    return {}
  },
  mounted () {
    // 因为echarts 的初始化要操作DOM 所以代码写到mounted中
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    // 绘制图表
    myChart.setOption({
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      xAxis: { // x轴数据
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {}, // y轴配置项
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    })
  }
}
</script>

<style lang="less" scoped>
</style>
