export { };

declare global {
    interface Array<T> {
        /**
         * Returns an array, each element of which is multiplied by the given factor, or by default 10.
         * @param {number} factor - Multiplier for each element
         */
        multiply(factor?: number): Array<T>;
        /**
         * Groups elements based on what callbackfn returns.
         * @param {Function} callbackfn - The function is called once for each element in the array.
         */
        groupBy<U extends string>(callbackfn: (value: T) => U, thisArg?: any): Record<U, T>;
        all(callbackfn: (value: T) => boolean): boolean;
        any(callbackfn: (value: T) => boolean): boolean;
    }
}

Array.prototype.multiply = function (this: Array<number>, factor?: number): Array<number> {
    return this.map(e => factor ? e * factor : e * 10);
}

Array.prototype.groupBy = function <T, U extends string>(callbackfn: (value: T) => U): Record<U, T> {
    return this.reduce((acc, e) => {
        acc[callbackfn(e)] ? acc[callbackfn(e)].push(e) : acc[callbackfn(e)] = [e];
        return acc;
    }, {});;
}

Array.prototype.all = function <T>(callbackfn: (value: T) => boolean): boolean {
    return this.every(e => callbackfn(e));
}

Array.prototype.any = function <T>(callbackfn: (value: T) => boolean): boolean {
    return this.some(e => callbackfn(e));
}

console.log('multiply:');
const arrayOfNumbers = [1, 2, 3, 4, 5];
console.log(arrayOfNumbers.multiply());
console.log(arrayOfNumbers.multiply(2));

console.log('groupBy:');
const data = [{ emoji: "😃", sad: false }, { emoji: "😊", sad: false }, { emoji: "😞", sad: true }, { emoji: "😟", sad: true }];
console.log(data.groupBy(entry => entry.sad ? "sad" : "happy"));

console.log('all:');
const isFruit = (item: string) => {
    return ['🍏', '🍎', '🍐', '🍊', '🍌'].indexOf(item) != -1;
};
console.log(['🍏', '🍎', '🍐', '🍊', '🍌'].all(isFruit));
console.log(['🍏', '🍎', '🍐', '🍊', '🍌', '🍄'].all(isFruit));

console.log('any:');
console.log(['🍄', '🍎'].any(isFruit));
console.log(['🍄'].any(isFruit));