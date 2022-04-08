const parse = (results, string, start = 0) => {
  while (start + 1 < string.length) {
    start++;
    let tmp = string.split("");
    tmp[start] = "." + tmp[start];
    tmp = tmp.join("");
    results.push(tmp);
    parse(results, tmp, start + 1);
  }
};

string = "abcd";
let results = new Array(string);
parse(results, string);
console.log(results);
