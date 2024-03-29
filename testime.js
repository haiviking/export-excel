// Lấy ngày đầu tiên của năm hiện tại
var firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);

// Lấy ngày cuối cùng của năm hiện tại
var lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

console.log("Ngày đầu tiên của năm:", firstDayOfYear.toDateString());
console.log("Ngày cuối cùng của năm:", lastDayOfYear.toDateString());


console.log(firstDayOfYear.getMonth());
console.log(lastDayOfYear.getMonth());