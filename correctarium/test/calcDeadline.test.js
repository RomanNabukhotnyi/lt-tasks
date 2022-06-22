const calcDeadline = require("../func/calcDeadline");

let start = new Date(2022, 2, 22, 10).getTime();
let end = new Date(2022, 2, 22, 19).getTime();

test("time: 10, now: 2022-03-22 Tue 19:00", () => {
  expect(calcDeadline(10, start, end, new Date(2022, 2, 22, 19).getTime())).toStrictEqual(new Date(2022, 2, 24, 11).getTime());
});

test("time: 9, now: 2022-03-22 Tue 6:00", () => {
  expect(calcDeadline(9, start, end, new Date(2022, 2, 22, 6).getTime())).toStrictEqual(new Date(2022, 2, 22, 19).getTime());
});

test("time: 9, now: 2022-03-22 Tue 22:00", () => {
  expect(calcDeadline(9, start, end, new Date(2022, 2, 22, 22).getTime())).toStrictEqual(new Date(2022, 2, 23, 19).getTime());
});

test("time: 9, now: 2022-04-02 Sat 09:00", () => {
  expect(calcDeadline(9, new Date(2022, 3, 2, 10).getTime(), new Date(2022, 3, 2, 19).getTime(), new Date(2022, 3, 2, 9).getTime()))
    .toStrictEqual(new Date(2022, 3, 4, 19).getTime());
});

test("time: 9, now: 2022-04-03 Sun 09:00", () => {
  expect(calcDeadline(9, new Date(2022, 3, 3, 10).getTime(), new Date(2022, 3, 3, 19).getTime(), new Date(2022, 3, 3, 9).getTime()))
    .toStrictEqual(new Date(2022, 3, 4, 19).getTime());
});

test("time: 9, now: 2022-04-01 Fri 15:00", () => {
  expect(calcDeadline(9, new Date(2022, 3, 1, 10).getTime(), new Date(2022, 3, 1, 19).getTime(), new Date(2022, 3, 1, 15).getTime()))
    .toStrictEqual(new Date(2022, 3, 4, 15).getTime());
});