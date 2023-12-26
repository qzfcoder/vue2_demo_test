<template>
    <div class="charts">
        <div id="barCharts" :style="{ width: width, height: height }"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts';
export default {
    props: {
        width: {
            type: String,
            default: "300px"
        },
        height: {
            type: String,
            default: '100%'
        },
        echartsType:{
            type:String,
            default:'bar'
        }
    },
    data() {
        return {
            myChart:{}
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.loadEchart()
        })
    },
    methods: {
        loadEchart() {
            let xAxisdata
            let seriesData
            let myChart = echarts.init(document.getElementById("barCharts")) 
            var option
            option = {
                xAxis:[
                    {
                        type:'category',
                        data:xAxisdata
                    }
                ],
                yAxis:[
                    {
                        type:'value',
                    }
                ],
                series:[
                    {
                        type:this.echartsType,
                        data:seriesData
                    }
                ]
            }
            myChart.setOption(option)
            let that = this
            window.addEventListener("resize", () => {
                let option = that.option
                myChart.setOption(option)
                myChart.resize()
            })
        },
        exportEcharts(title,echartsBox,type){
            let myChart = echarts.getInstanceByDom(document.getElementById("barCharts"))
            // if()
            let picInfo = myChart.getDataURL({
                type:'png',
                pixelRatio:1,
                backgroundColor:'white'
            })
            const elink = document.createElement("a")
            elink.download = title
            elink.style.display = 'none'
            elink.href = picInfo
        }
    },
    watch:{
        option(){
            this.loadEchart()
        }
    }
}
</script>

<style>
.charts{
    height: 90%;
}
</style>