const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
require('dotenv').config();

const token = process.env.TOKEN;
const apiKey = process.env.API_KEY;

const getWeather = async () => {
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=Rivne,UKR&lang=ru&appid=${apiKey}`);
    const data = response.data;
    let map = data.list.reduce((acc, i) => {
        const date = new Date(i.dt * 1000).toLocaleDateString('ru', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        });
        const time = new Date(i.dt * 1000).toLocaleTimeString('ru', {
            hour: 'numeric',
            minute: 'numeric',
        });
        const temp = Math.round(i.main.temp - 273.15);
        const weather = `${time}, ощущается: ${temp >= 0 ? '+' : '-'}${temp}°С, ${i.weather[0].description}`;
        acc[date] = acc[date] ? [...acc[date], weather] : [weather];
        return acc;
    }, {});
    return map;
};

let exchangeRatesPrivateBank = {};
let exchangeRatesMonobank = {};

setInterval(async () => {
    const responsePrivatBank = await axios.get('https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11');
    const dataPrivatBank = responsePrivatBank.data;
    const rateUSDPrivatBank = dataPrivatBank.find(rate => rate.ccy === 'USD');
    const rateEURPrivatBank = dataPrivatBank.find(rate => rate.ccy === 'EUR');
    exchangeRatesPrivateBank['USD']=`${Number(rateUSDPrivatBank.buy).toFixed(2)} / ${Number(rateUSDPrivatBank.sale).toFixed(2)}`;
    exchangeRatesPrivateBank['EUR']=`${Number(rateEURPrivatBank.buy).toFixed(2)} / ${Number(rateEURPrivatBank.sale).toFixed(2)}`;

    const responseMonobank = await axios.get('https://api.monobank.ua/bank/currency');
    const dataMonobank = responseMonobank.data;
    const rateUSDMonobank = dataMonobank.find(rate => rate.currencyCodeA === 840);
    const rateEURMonobank = dataMonobank.find(rate => rate.currencyCodeA === 978);
    exchangeRatesMonobank['USD']=`${rateUSDMonobank.rateBuy.toFixed(2)} / ${rateUSDMonobank.rateSell.toFixed(2)}`;
    exchangeRatesMonobank['EUR']=`${rateEURMonobank.rateBuy.toFixed(2)} / ${rateEURMonobank.rateSell.toFixed(2)}`;
}, 65 * 1000);

try {
    const bot = new TelegramBot(token, { polling: true });

    bot.setMyCommands([
        {
            command: '/weather3',
            description: 'Прогноз погоды в городе Ровно с интервалом 3 часа',
        },
        {
            command: '/weather6',
            description: 'Прогноз погоды в городе Ровно с интервалом 6 часов',
        },
        {
            command: '/usd',
            description: 'Курс USD',
        },
        {
            command: '/eur',
            description: 'Курс EUR',
        }
    ]);

    bot.onText(/\/start/, async (msg) => {
        await bot.sendMessage(msg.chat.id, "Привет!", {
            "reply_markup": {
                "keyboard": [
                    ["Прогноз погоды в Ровно с интервалом 3 часа", "Прогноз погоды в Ровно с интервалом 6 часов"],
                    ["Курс USD", "Курс EUR"]
                ],
            }
        });
    });

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text;
        if (text === 'Прогноз погоды в Ровно с интервалом 3 часа' || text === '/weather3') {
            const weather = await getWeather();
            let result = 'Погода в Ровно:\n';
            Object.keys(weather).forEach(day => {
                result += `\n${day}:\n`;
                weather[day].forEach(time => {
                    result += `      ${time}\n`;
                });
            });
            await bot.sendMessage(chatId, result);
        }
        if (text === 'Прогноз погоды в Ровно с интервалом 6 часов' || text === '/weather6') {
            const weather = await getWeather();
            let result = 'Погода в Ровно:\n';
            Object.keys(weather).forEach(day => {
                result += `\n${day}:\n`;
                weather[day].forEach((time, index) => {
                    if (index % 2 != 0) {
                        result += `     ${time}\n`;
                    }
                });
            });
            await bot.sendMessage(chatId, result);
        }
        if (text === 'Курс USD' || text === '/usd') {
            let result = `USD->UAH:\n\t${exchangeRatesPrivateBank.USD} PrivatBank\n\t${exchangeRatesMonobank.USD} Monobank`;
            await bot.sendMessage(chatId, result);
        }
        if (text === 'Курс EUR' || text === '/eur') {
            let result = `EUR->UAH:\n\t${exchangeRatesPrivateBank.EUR} PrivatBank\n\t${exchangeRatesMonobank.EUR} Monobank`;
            await bot.sendMessage(chatId, result);
        }
    });

    console.log('Telegram bot succesfully started...')
} catch (error) {
    console.log(error)
}