"use strict";
exports.__esModule = true;
Array.prototype.multiply = function (factor) {
    return this.map(function (e) { return factor ? e * factor : e * 10; });
};
Array.prototype.groupBy = function (callbackfn) {
    return this.reduce(function (acc, e) {
        acc[callbackfn(e)] ? acc[callbackfn(e)].push(e) : acc[callbackfn(e)] = [e];
        return acc;
    }, {});
    ;
};
Array.prototype.all = function (callbackfn) {
    return this.every(function (e) { return callbackfn(e); });
};
Array.prototype.any = function (callbackfn) {
    return this.some(function (e) { return callbackfn(e); });
};
console.log('multiply:');
var arrayOfNumbers = [1, 2, 3, 4, 5];
console.log(arrayOfNumbers.multiply());
console.log(arrayOfNumbers.multiply(2));
console.log('groupBy:');
var data = [{ emoji: "😃", sad: false }, { emoji: "😊", sad: false }, { emoji: "😞", sad: true }, { emoji: "😟", sad: true }];
console.log(data.groupBy(function (entry) { return entry.sad ? "sad" : "happy"; }));
console.log('all:');
var isFruit = function (item) {
    return ['🍏', '🍎', '🍐', '🍊', '🍌'].indexOf(item) != -1;
};
console.log(['🍏', '🍎', '🍐', '🍊', '🍌'].all(isFruit));
console.log(['🍏', '🍎', '🍐', '🍊', '🍌', '🍄'].all(isFruit));
console.log('any:');
console.log(['🍄', '🍎'].any(isFruit));
console.log(['🍄'].any(isFruit));
