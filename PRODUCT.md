# 产品文档

阳历﹑公历，以下统称为阳历

阴历﹑旧历﹑农历，以下统称为阴历

## 阴历的由来

阴历来源于古代星象家观察月亮的变化周期的结果，因为月亮的盈亏朔望周期非常明显，易于观测，所以远古的历法几乎都是阴历。

阴历没有规律可遵循，且都是由天文台观测计算，大部分阳历换阴历都是用查表法进行转换。

## 数据来源

- [香港天文台](https://gb.weather.gov.hk/gts/time/conversionc.htm) 获取阴历 1901年 - 2099年 数据
- [asia-home](https://www.asia-home.com/china/nongli/year/2101/lang/cn.php) 获取阴历 2100年数据

获取的数据格式如下：

```js
{
  // 阴历年份
  year: 1900,
  // 阴历年份正月初一对应的阳历月份
  firstMonth: 1,
  // 阴历年份正月初一对应的阳历日子
  firstDay: 31,
  // 是否为闰年
  isRun: false,
  // 是闰年的话闰几月，非闰年为 0
  runMonth: 8,
  // 是闰年的话闰月的天数，非闰年为 0
  runMonthDays: 29,
  // 阴历十二个月的每月天数
  monthsDays: [29, 30, 29, 29, 30, 29, 30, 30, 30, 30, 29, 30],
}
```

> 数据误差：由于计算数十年后的月相及节气时间可能会有数分钟的误差，若新月(即农历初一)或节气时间很接近午夜零时，相关农历月份或节气的日期可能会有一日之差别。

> 有闰月的年份中，农历节日只按原月算，不按闰月算，只有除夕例外，有闰腊月则过闰腊月除夕。

## 数据压缩

将 1900-2100 年的数据存起来，占用的体积大概是41k，作为包来说这个体积很大，这里存为十六进制数据，将数据压缩到4k。

如何压缩数据呢？查看数据规律，我们发现：

> 闰月天数：只有三种值，即 0、29、30，在计算的时候先判断是否为闰月，再计算天数，0 代表 29， 1 代表 30

> 1-12 月天数，天数可以为 29 和 30，分别用 0 和 1 表示

> 闰月月份，闰月可能为 1-12，因此我们使用4个二进制数表示，最大可以表示 16

用 17 个二进制数表示阴历数据信息，从右到左：

|      17      |       16-5       |   4-1    |
| :----------: | :--------------: | :------: |
| 表示闰月天数 | 1 到 12 月的天数 | 闰月月份 |

这里`transform/index.js`实现了一个简单的转换处理，将数据转换为1900-2100年依次按index排序的数组，数组的每一项里面存储了该年的阴历信息。

## 数据计算

> 已知 `阳历1900年的1月31日` 对应 `阴历1900年正月初一`

> 计算传入的日期，例如2023-12-08，到1900-1-31的天数，使用浏览器内置的Date.UTC计算，记为offset

> 从1900开始循环，每经过一次循环，offset减去当前年的天数，直到offset < 0，这时候可以获取阴历年

> 从1到12依次循环，计算消耗掉剩余offset时，月份和剩余天数
