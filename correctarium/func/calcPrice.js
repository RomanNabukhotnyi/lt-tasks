module.exports = (lang, type, count) =>{
    let price=lang === "en" ? count * 0.12 : count * 0.05;
    price = type === "other" ? price * 1.2 : price;
    if (lang === "en") {
        price = price < 120 ? 120 : price;
    } else {
        price = price < 50 ? 50 : price;
    }
    return price;
}