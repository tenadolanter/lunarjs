import {
  cnWeeks,
  cnWeekPrefix,
  sFestival,
  lFestival,
  startYear,
  startMonth,
  startDay,
  endYear,
} from "./config.js";
import {
  lYearDays,
  lMonthDays,
  leapMonth,
  leapDays,
  toAstro,
  toGanZhiYear,
  toCnMonth,
  toCnDay,
  toZodiac,
} from "./utils.js";

/**
 * 传入阳历的年月日，获取详细的农历信息
 * @param { number } year 阳历年
 * @param { number } month 阳历月
 * @param { number } day 阳历日
 * @return { object } 日历的详细信息
 * @example solar2lunar(1905, 1, 1)
 *
 */
export const solar2lunar = (year, month, day) => {
  let y = parseInt(year);
  let m = parseInt(month);
  let d = parseInt(day);
  let objDate;
  if (!y) {
    objDate = new Date();
  } else {
    objDate = new Date(y, m - 1, d);
  }
  y = objDate.getFullYear();
  m = objDate.getMonth() + 1;
  d = objDate.getDate();
  // 星期几
  let week = objDate.getDay();
  const cnWeek = cnWeekPrefix + cnWeeks[week];
  if (week == 0) {
    week = 7;
  }
  // 是否今天
  let isToday = false;
  const todayObj = new Date();
  if (
    todayObj.getFullYear() == y &&
    todayObj.getMonth() + 1 == m &&
    todayObj.getDate() == d
  ) {
    isToday = true;
  }
  // 阳历日期处理
  const sDate = y + "-" + m + "-" + d;
  const sFestivalDate = m + "-" + d;
  const astro = toAstro(m, d);

  // 阴历处理
  // 阴历年份
  let offset =
    (Date.UTC(y, m - 1, d) - Date.UTC(startYear, startMonth - 1, startDay)) /
    86400000; // 一天的秒数
  // 通过计算1900年1月31号到现在的时间，判断是什么年份
  let temp = 0;
  let i;
  for (i = startYear; i <= endYear && offset > 0; i++) {
    temp = lYearDays(i);
    offset -= temp;
  }
  if (offset < 0) {
    offset += temp;
    i--;
  }
  const lYear = i;
  let leap = leapMonth(lYear);
  let isLeap = false;
  for (i = 1; i <= 12 && offset > 0; i++) {
    //闰月
    if (leap > 0 && i == leap + 1 && !isLeap) {
      --i;
      isLeap = true;
      temp = leapDays(lYear);
    } else {
      temp = lMonthDays(lYear, i);
    }
    if (!!isLeap && i === leap + 1) {
      isLeap = false;
    }
    offset -= temp;
  }
  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeap) {
      isLeap = false;
    } else {
      isLeap = true;
      --i;
    }
  }
  if (offset < 0) {
    offset += temp;
    --i;
  }
  let lMonth = i;
  let lDay = offset + 1;

  const lDate = lYear + "-" + lMonth + "-" + lDay;
  const lFestivalDate = lMonth + "-" + lDay;
  const cnYear = toGanZhiYear(lYear);
  // 月份
  const cnMonth = toCnMonth(lMonth);
  // 日
  const cnDay = toCnDay(lDay);
  // 生肖
  const zodiac = toZodiac(lYear);

  return {
    sDate: sDate,
    sYear: y,
    sMonth: m,
    sDay: d,
    sFestival: sFestival[sFestivalDate] || "",
    astro: astro,
    week: week,
    lDate: lDate,
    lYear: lYear,
    lMonth: lMonth,
    lDay: lDay,
    lFestival: lFestival[lFestivalDate] || "",
    cnYear: cnYear,
    // 闰
    cnMonth: (isLeap ? "\u95f0" : "") + cnMonth,
    cnDay: cnDay,
    cnWeek: cnWeek,
    zodiac: zodiac,
    isLeap: isLeap,
    isToday: isToday,
  };
};

/**
 * 传入阴历的年月日以及是否闰月，返回阳历的年月日
 * @param { number } year 阳历年
 * @param { number } month 阳历月
 * @param { number } day 阳历日
 * @param { boolean } isLeap 是否闰月
 * @return { object } 日历的详细信息
 * @example lunar2solar(1905, 1, 1, false)
 */
export const lunar2solar = (year, month, day, isLeap) => {
  y = parseInt(year);
  m = parseInt(month);
  d = parseInt(day);
  isLeap = !!isLeap;
  const leapMonth = leapMonth(y);
  if (isLeap && leapMonth !== m) {
    return -1;
  } //传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
  if (
    (y === endYear && m === 12 && d > 1) ||
    (y === startYear && m === startMonth && d < startDay)
  ) {
    return -1;
  } //超出了最大极限值
  const mday = lMonthDays(y, m);
  let _day = mday;
  //if month is leap, _day use leapDays method
  if (isLeap) {
    _day = leapDays(y, m);
  }
  //参数合法性效验
  if (y < startYear || y > endYear || d > _day) {
    return -1;
  }

  //计算农历的时间差
  let offset = 0;
  let i;
  for (i = startYear; i < y; i++) {
    offset += lYearDays(i);
  }
  let leap = 0,
    isAdd = false;
  for (i = 1; i < m; i++) {
    leap = leapMonth(y);
    if (!isAdd) {
      //处理闰月
      if (leap <= i && leap > 0) {
        offset += leapDays(y);
        isAdd = true;
      }
    }
    offset += lMonthDays(y, i);
  }
  //转换闰月农历 需补充该年闰月的前一个月的时差
  if (isLeap) {
    offset += day;
  }
  const strap = Date.UTC(startYear, startMonth, startDay - 1, 0, 0, 0);
  const calObj = new Date((offset + d - 31) * 86400000 + strap);
  const cY = calObj.getUTCFullYear();
  const cM = calObj.getUTCMonth() + 1;
  const cD = calObj.getUTCDate();

  return solar2lunar(cY, cM, cD);
};
