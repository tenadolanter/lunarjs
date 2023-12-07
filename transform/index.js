// 根据lunar信息，将大的json数据转换为16进制数据
import lunarInfo from "./lunarInfo.js";
let result = [];
Object.values(lunarInfo).forEach(item => {
  let data = parseInt(item.runMonth);
  item.monthsDays.reverse().forEach((day, index) => {
    const value = day - 29;
    const _index = index + 4;
    if(value === 0) {
      data = data & ~(1 << _index);
    } else {
      data = data | (1 << _index);
    }
    if(item.isRun) {
      const value = item.runMonthDays - 29;
      if(value === 0) {
        data = data & ~(1 << 16);
      } else {
        data = data | (1 << 16);
      }
    }
  })
  data = '0x' + parseInt(data).toString(16);
  result.push(data);
});
const filePath = "./src/lunar.js";
import path from "path"
import fs from "fs";
const cwd = process.cwd();
const configPath = path.join(cwd, filePath);
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(configPath, `export default []`, (err) => {
    if (err) {
      console.log(err);
      process.exit(2);
    }
  });
}
fs.writeFileSync(configPath, `export default [${result}];`, (err) => {
  if (err) {
    console.log(err);
    process.exit(2);
  }
});


