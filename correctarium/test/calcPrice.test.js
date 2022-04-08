const calcPrice = require("../func/calcPrice");

test("lang: en, mimetype: doc, count: 100", () => {
    expect(calcPrice("en", "doc", 100)).toBe(120);
});

test("lang: en, mimetype: doc, count: 1000", () => {
    expect(calcPrice("en", "doc", 1000)).toBe(120);
});

test("lang: en, mimetype: doc, count: 10000", () => {
    expect(calcPrice("en", "doc", 10000)).toBe(1200);
});

test("lang: en, mimetype: other, count: 10000", () => {
    expect(calcPrice("en", "other", 10000)).toBe(1440);
});

test("lang: ua, mimetype: doc, count: 1000", () => {
    expect(calcPrice("ua", "doc", 1000)).toBe(50);
});

test("lang: ua, mimetype: doc, count: 10000", () => {
    expect(calcPrice("ua", "doc", 10000)).toBe(500);
});

test("lang: ua, mimetype: doc, count: 2333", () => {
    expect(calcPrice("ua", "doc", 2333)).toBe(116.65);
});