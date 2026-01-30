import { monthTotals, percent, quarterTotals, yearTotal } from "../src/lib/metrics";

const sampleTargets = [
  { month: 1, amount: 100 },
  { month: 2, amount: 200 },
  { month: 3, amount: 300 }
];
const sampleActuals = [
  { month: 1, amount: 80 },
  { month: 2, amount: 220 },
  { month: 3, amount: 240 }
];

const targetTotal = yearTotal(sampleTargets);
const actualTotal = yearTotal(sampleActuals);
const success = percent(actualTotal, targetTotal);

console.log("Target total", targetTotal);
console.log("Actual total", actualTotal);
console.log("Success", success.toFixed(2));
console.log("Month totals", monthTotals(sampleTargets));
console.log("Quarter totals", quarterTotals(sampleTargets));
