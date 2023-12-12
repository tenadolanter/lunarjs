## 介绍

js工具库，处理阳历与阴历相互转换，获取指定日期的农历、节日，星座、生肖等信息。本文很多部分使用了[https://github.com/jjonline/calendar.js](https://github.com/jjonline/calendar.js)的代码，感谢作者。

## 使用

### 0、安装

```bash
npm install @tenado/lunarjs

# yarn
yarn add  @tenado/lunarjs
```

### 1、调用

阳历转换为阴历

```js
import lunarjs from "@tenado/lunarjs";
const data = lunarjs.solar2lunar(2023, 12, 8);
console.log(data);
```

阴历转换为阳历

```js
import lunarjs from "@tenado/lunarjs";
const data = lunarjs.lunar2solar(2023, 12, 8);
console.log(data);
```

### 3、返回结果说明

| 名称      | 说明     | 示例       |
| --------- | -------- | ---------- |
| sDate     | 阳历日期 | 2023-12-8  |
| sYear     | 阳历年份 | 2023       |
| sMonth    | 阳历月份 | 12         |
| sDay      | 阳历天数 | 8          |
| sFestival | 阳历节日 | 情人节       |
| astro     | 星座     | 射手座     |
| week      | 第几周   | 5          |
| lDate     | 阴历日期 | 2023-10-27 |
| lYear     | 阴历年份 | 2023       |
| lMonth    | 阴历月份 | 10         |
| lDay      | 阴历天数 | 27         |
| lFestival | 阴历节日 | 元宵节       |
| cnYear    | 中国年   | 癸卯年     |
| cnMonth   | 中国月   | 十月       |
| cnDay     | 中国日   | 廿七       |
| cnWeek    | 中国周   | 星期五     |
| zodiac    | 生肖     | 兔         |
| isLeap    | 是否闰年 | false      |
| isToday   | 是否今天 | true       |
