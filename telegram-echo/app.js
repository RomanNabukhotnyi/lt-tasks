const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios').default;
require('dotenv').config();

const token = process.env.TOKEN;

try {
    const bot = new TelegramBot(token, { polling: true });

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id;
        const text = msg.text.trim();
        if (text === 'photo') {
            console.log(`Пользователь ${msg.chat.first_name} ${msg.chat.last_name} запросил картинку.`);
            const response = await axios.get('https://picsum.photos/200/300', {
                responseType: 'arraybuffer'
            });
            await bot.sendPhoto(chatId, response.data);
        } else {
            console.log(`Пользователь ${msg.chat.first_name} ${msg.chat.last_name} написал: ${text}`);
            await bot.sendMessage(chatId, `Вы написали: "${text}"`);
        }
    });
    console.log('Telegram bot succesfully started...')
} catch (error) {
    console.log(error);
}