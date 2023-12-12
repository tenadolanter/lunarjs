import { solar2lunar, lunar2solar } from "../src/index.js";

const data = solar2lunar(2023, 12, 12);
const data1 = lunar2solar(2023, 11, 1);
console.log(data, data1);