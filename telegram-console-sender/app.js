const { program } = require('commander');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TOKEN;
const chatId = process.env.CHAT_ID;

const bot = new TelegramBot(token);

program
    .name('app')
    .description('CLI sends messages from the console to the telegram bot')
    .version('0.0.1');

program
    .command('message')
    .alias('m')
    .argument('<message>', 'message to send')
    .description('Send message to Telegram Bot')
    .action(async message => {
        await bot.sendMessage(chatId, message);
    });

program
    .command('photo')
    .alias('p')
    .argument('<path>', 'path to photo')
    .description('Send photo to Telegram Bot. Just drag and drop it console after p-flag')
    .action(async path => {
        await bot.sendPhoto(chatId, path);
    });

program.parse();