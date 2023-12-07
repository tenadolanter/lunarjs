import lunar from "./lunar.js";
import {
  startYear,
  astroDays,
  astroStrings,
  Gan,
  Zhi,
  cnMonths,
  cnMonthSuffix,
  cnDays,
  cnDayUnits,
  cnZodiac,
} from "./config.js";
/**
 * 获取阴历年的天数
 * @param { number } - year 阴历年份
 * @return { number }
 */
export const lYearDays = (year) => {
  // 12个月，默认每个月29天，剩余的是0还是1存储在十六进制数据中
  let sum = 12 * 29;
  // 获取十六进制表示数据里面的第5-16位数据(从右向左)
  // 1000000000000000 0x8000
  // 1000 0x8
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += lunar[year - startYear] & i ? 1 : 0;
  }
  return sum + leapDays(year);
};

/**
 * 返回农历年普通月份的天数
 * @param { number } - year 阴历年份
 * @param { number } - month 阴历月份
 * @return { number }
 */
export const lMonthDays = (year, month) => {
  return lunar[year - startYear] & (0x10000 >> month) ? 30 : 29;
};

/**
 * 返回农历年哪一个月是闰月，如果没有则返回0
 * @param { number } - year 阴历年份
 * @return { number }
 */
export const leapMonth = (year) => {
  // 获取十六进制表示数据里面的第1-4位数据(从右向左)
  // 1111 0xf 按位与计算，获取最后4位数据
  return lunar[year - startYear] & 0xf;
};

/**
 * 返回农历年闰月的天数
 * @param { number } - year 阴历年份
 * @return { number }
 */
export const leapDays = (year) => {
  // 获取十六进制表示数据里面的第17位数据(从右向左)
  // 10000000000000000 0x10000
  if (!!leapMonth(year)) {
    return lunar[year - startYear] & 0x10000 ? 30 : 29;
  }
  return 0;
};

/**
 * 根据阳历月份和日期，获取星座
 * @param { number } - month 月份
 * @param { number } - day 日期
 * @return { string } - 星座
 */
export const toAstro = (month, day) => {
  const index = (month * 2 - (day < astroDays[month - 1] ? 2 : 0)) / 2;
  return astroStrings[index];
};

export const toGanZhiYear = (lYear) => {
  const ganKey = (lYear - 4) % 10;
  const zhiKey = (lYear - 4) % 12;
  // 年
  return Gan[ganKey] + Zhi[zhiKey] + "\u5e74";
};

export const toCnMonth = (lMonth) => {
  let s = cnMonths[lMonth - 1];
  //加上月字
  s += cnMonthSuffix;
  return s;
};

export const toCnDay = (lDay) => {
  let result;
  if (lDay === 10) {
    // 初十
    result = "\u521d\u5341";
  } else if (lDay === 20) {
    // 二十
    result = "\u4e8c\u5341";
  } else if (lDay === 30) {
    // 三十
    result = "\u4e09\u5341";
  } else {
    result = cnDays[Math.floor(lDay / 10)];
    result += cnDayUnits[lDay % 10];
  }
  return result;
};

export const toZodiac = (lYear) => {
  const key = (lYear - 4) % 12;
  return cnZodiac[key];
};
