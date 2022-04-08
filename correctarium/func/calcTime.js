module.exports = (lang, type, count) => {
    let time = 0;
    if (lang === "en") {
        time = 0.5 + count / 333;
    } else {
        time = 0.5 + count / 1333;
    }
    time = type === "other" ? Math.floor((time * 1.2) * 10)/10 : Math.floor(time * 10)/10;
    time = time < 1 ? 1 : time;
    return time;
}