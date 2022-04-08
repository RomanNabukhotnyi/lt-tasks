const MINUTE = 60 * 1000;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

let now = new Date(Math.ceil(new Date().getTime() / (HOUR / 2)) * (HOUR / 2));
let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10).getTime();
let end = start + HOUR * 9;

const calcDeadline = (t, s = start, e = end, d = now.getTime()) => {
    let time = t;
    let start = s;
    let end = e;
    let deadline = d;
    if (time == 0) {
        return deadline;
    }
    if (deadline < start) {
        deadline = start;
    }
    else if (deadline > end) {
        start = start + DAY;
        end = end + DAY;
        deadline = start;
    }
    let tmp = new Date(deadline);
    if (tmp.getDay() == 6 || tmp.getDay() == 0) {
        start = start + DAY;
        end = end + DAY;
        deadline = start;
    }
    else if ((end - deadline) / HOUR < time) {
        time = time - (end - deadline) / HOUR;
        start = start + DAY;
        end = end + DAY;
        deadline = start;
    } else {
        deadline = deadline + time * HOUR;
        time = 0;
    }
    return calcDeadline(time, start, end, deadline);
}
module.exports = calcDeadline;