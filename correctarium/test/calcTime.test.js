const calcTime = require("../func/calcTime");

test("lang: en, mimetype: doc, count: 100", () => {
    expect(calcTime("en", "doc", 100)).toBe(1);
});

test("lang: en, mimetype: doc, count: 1000", () => {
    expect(calcTime("en", "doc", 1000)).toBe(3.5);
});

test("lang: en, mimetype: doc, count: 10000", () => {
    expect(calcTime("en", "doc", 10000)).toBe(30.5);
});

test("lang: en, mimetype: other, count: 10000", () => {
    expect(calcTime("en", "other", 10000)).toBe(36.6);
});

test("lang: ua, mimetype: doc, count: 1000", () => {
    expect(calcTime("ua", "doc", 1000)).toBe(1.2);
});

test("lang: ua, mimetype: doc, count: 10000", () => {
    expect(calcTime("ua", "doc", 10000)).toBe(8);
});

test("lang: ua, mimetype: doc, count: 2333", () => {
    expect(calcTime("ua", "doc", 2333)).toBe(2.2);
});