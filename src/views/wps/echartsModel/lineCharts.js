export function lineData(data, maxLength, title = '', type = 'line', barType) {
    //y轴最大最小值的数据
    let list = []
    let obj = {
        absolute_value: null,
        year_on_year: null,
        month_on_month: null,
    }
    //刻度间距
    let interval = 5;
    let leftMin = 0;
    let allMath = 0;
    let max1 = 0;
    let min4 = 0;
    let max4 = 0;
    //获取第一行x轴的数据
    function getFirstxAxisData() {
        let xData = []
        for (let i in data) {
            xData.unshift(i)
        }
        return xData
    }
    //获取其他行x轴的数据
    function getxAxisData(type) {
        let list = []
        for (let i in data) {
            Object.keys(data[i]).forEach(item => {
                if (item == type) {
                    list.unshift((data[i][type] == 'null' || data[i][type] == null) ? '--' : data[i][type])
                }
            })
        }
        return list
    }
    //获取series的数据
    function getSeriesData(type) {
        let list = []
        for (let i in data) {
            Object.keys(data[i]).forEach(item => {
                if (item == type) {
                    if ((data[i][type] == 'null' || data[i][type] == null) || (type != 'absolute_value' && Math.abs(data[i][type]) >= 400)) {
                        list.unshift('--')
                    } else {
                        list.unshift(data[i][type])
                    }
                }
            })
        }
        return list
    }
    //获取最大值
    function getMaxData(data) {
        return Math.round(Math.max(...data.map(Math.abs))) + 1;
    }
    //排序最小值
    function sortMin(data) {
        return data.sort(function (a, b) {
            return a - b
        })[0]
    }
    //排序最大值
    function sortMax(data) {
        return data.sort(function (a, b) {
            return b - a
        })[0]
    }
    //获取y轴最大最小值的数据
    (function getNewSeriesData() {
        for (let i in obj) {
            let arr = []
            for (let item in data) {
                Object.keys(data[item]).forEach(key => {
                    if (key == i) {
                        if (((data[item][i] == 'null' || data[item][i] == null) || (i != 'absolute_value' && Math.abs(data[item][i]) >= 400))) {
                            arr.push('0')
                        } else {
                            arr.push(data[item][i])
                        }
                    }
                })
            }
            list.push(arr)
        }
        max1 = getMaxData(list[0])
        var max2 = getMaxData(list[1])
        var max3 = getMaxData(list[2])
        max4 = sortMax([max2, max3])
        var min1 = sortMin(list[0])
        var min2 = sortMin(list[1])
        var min3 = sortMin(list[2])
        min4 = sortMin([min1, min2, min3])
        let baseJZ = 20
        max4 = (Math.floor(max4 / baseJZ) + 1) * baseJZ
        min4 = (Math.floor(min4 / baseJZ)) * baseJZ
        interval = (max4 + Math.abs(min4)) / baseJZ;
        if (min4 < 0) {
            allMath = max4 + Math.abs(min4);
            let newinterval = interval * (max4 / allMath)
            max1 = Math.ceil(max1 / newinterval) * newinterval
            leftMin = (max1 / (max4 / allMath) - max1)
        }
    })();
    return {
        title: {
            text: title,
            textStyle:{
                fontSize:14
            }
        },
        animation: false,
        grid: {
            x: 180,
            x2: 100,
            y2: 210
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(50,50,50,0.7)',
            textStyle: {
                color: '#fff'
            },
        },
        legend: {
            align: "right",
            itemGap: 30,
            orient: "vertical",
            textStyle: {
                color: "#000",
                fontSize: 18
            },
            bottom: 56,
            left: 20,
        },
        toolbox: {
            show: false,
            top: '10%',
            feature: {
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ["line", "bar"] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        xAxis: [
            {
                type: "category",
                max: maxLength - 1,
                interval: Math.ceil(maxLength - 1) / maxLength - 1,
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    fontWeight: "bold",
                    show: true,
                    textStyle: {
                        fontSize: 15
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: '#000'
                    },
                },
                data: getFirstxAxisData(),
                axisPointer: {
                    type: "shadow"
                }
            },
            {
                position: "bottom", // 将分组x轴位置定至底部，不然默认在顶部
                offset: 0, // 向下偏移，使分组文字显示位置不与原x轴重叠
                axisLine: {
                    show: false,
                    onZero: false
                },
                axisTick: {
                    length: -160, // 延长刻度线做分组线
                    inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
                    lineStyle: { color: "#000" } // 非必须，仅为了演示，明显标示出分组刻度线
                },
                max: maxLength - 1,
                interval: 1,
                axisLabel: {
                    inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
                    interval: 0 // 强制显示全部刻度名
                },
                data: [""]
            },
            {
                position: "bottom", // 将分组x轴位置定至底部，不然默认在顶部
                offset: 0, // 向下偏移，使分组文字显示位置不与原x轴重叠
                max: maxLength - 1,
                interval: Math.ceil(maxLength - 1) / maxLength - 1,
                axisTick: {
                    length: 0, // 延长刻度线做分组线
                    inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
                    lineStyle: { color: "#000" } // 非必须，仅为了演示，明显标示出分组刻度线
                },
                axisLabel: {
                    inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
                    interval: 0 // 强制显示全部刻度名
                }
            },
            {
                position: "bottom", // 将分组x轴位置定至底部，不然默认在顶部
                offset: 36, // 向下偏移，使分组文字显示位置不与原x轴重叠
                max: maxLength - 1,
                interval: Math.ceil(maxLength - 1) / maxLength - 1,
                axisTick: {
                    length: 0, // 延长刻度线做分组线
                    inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
                    lineStyle: { color: "#000" } // 非必须，仅为了演示，明显标示出分组刻度线
                },
                axisLabel: {
                    inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
                    interval: 0 // 强制显示全部刻度名
                }
            },
            {
                position: "bottom", // 将分组x轴位置定至底部，不然默认在顶部
                offset: 75, // 向下偏移，使分组文字显示位置不与原x轴重叠
                max: maxLength - 1,
                interval: 1,
                axisTick: {
                    length: 0, // 延长刻度线做分组线
                    inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
                    lineStyle: { color: "#000" } // 非必须，仅为了演示，明显标示出分组刻度线
                },
                axisLabel: {
                    fontSize: 15,
                    color: '#000',
                    fontWeight: "bold",
                    inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
                    interval: 0 // 强制显示全部刻度名
                },
                data: getxAxisData('absolute_value')
            },
            {
                position: "bottom", // 将分组x轴位置定至底部，不然默认在顶部
                offset: 120, // 向下偏移，使分组文字显示位置不与原x轴重叠
                max: maxLength - 1,
                interval: Math.ceil(maxLength - 1) / maxLength - 1,
                axisTick: {
                    length: 0, // 延长刻度线做分组线
                    inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
                    lineStyle: { color: "#000" } // 非必须，仅为了演示，明显标示出分组刻度线
                },
                axisLabel: {
                    fontSize: 15,
                    color: '#000',
                    fontWeight: "bold",
                    inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
                    interval: 0 // 强制显示全部刻度名
                },
                data: getxAxisData('year_on_year')
            },
            {
                position: "bottom", // 将分组x轴位置定至底部，不然默认在顶部
                offset: 160, // 向下偏移，使分组文字显示位置不与原x轴重叠
                max: maxLength - 1,
                interval: 1,
                axisTick: {
                    length: 0, // 延长刻度线做分组线
                    inside: true, // 使刻度线相对轴线在上面与原x轴相接，默认在轴线下方
                    lineStyle: { color: "#000" } // 非必须，仅为了演示，明显标示出分组刻度线
                },
                axisLabel: {
                    fontSize: 15,
                    color: '#000',
                    fontWeight: "bold",
                    inside: true, // 使刻度名称相对轴线在上面与原x轴相接，默认在轴线下方
                    interval: 0 // 强制显示全部刻度名
                },
                data: getxAxisData('month_on_month')
            }
        ],
        // yAxis: {},
        yAxis: [
            {
                type: 'value',
                position: 'left',
                interval: (max1 + leftMin) / interval,
                min: -leftMin,
                max: max1,
                axisLabel: {
                    formatter: function (val) {
                        if (val != '0') {
                            return Math.floor(val)
                        } else {
                            return val
                        }
                    },
                    fontWeight: "bold",
                    textStyle: {
                        fontSize: 16,
                        color: '#000',
                    }
                },
                nameTextStyle: {
                    fontSize: 16,
                    color: '#000',
                }
            },
            {
                type: 'value',
                position: 'right',
                interval: allMath / interval,
                min: min4,
                max: max4,
                axisLine:{
                    show: true,
                    onZero:false
                },
                axisLabel: {
                    formatter: function (val) {
                        if (val != '0') {
                            return val + '%'
                        } else {
                            return val
                        }
                    },
                    fontWeight: "bold",
                    textStyle: {
                        fontSize: 16,
                        color: '#000',
                    }
                },
                nameTextStyle: {
                    fontSize: 16,
                    color: '#000',
                }
            },
        ],
        series: [
            {
                yAxisIndex: 0,
                animation: false,
                name: '绝对值',
                key: 'absolute_value',
                type: barType ?? type,
                data: getSeriesData('absolute_value'),
            },
            {
                yAxisIndex: 1,
                animation: false,
                name: '同比增幅(%)',
                key: 'year_on_year',
                type: type,
                data: getSeriesData('year_on_year'),
            },
            {
                yAxisIndex: 1,
                animation: false,
                name: '环比增幅(%)',
                key: 'month_on_month',
                type: type,
                data: getSeriesData('month_on_month'),
            },
        ]
    };
}