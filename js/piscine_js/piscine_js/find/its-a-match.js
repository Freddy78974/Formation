let normal = /hi/;
let begin = /^hi/;
let end = /hi$/;
let beginEnd = /^hi$/;

console.log(normal.test("llohi"))
console.log(begin.test("hi hello"))
console.log(end.test("hello hi"))
console.log(beginEnd.test("hi hello"))


