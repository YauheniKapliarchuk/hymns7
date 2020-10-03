import * as TelegramBot from 'node-telegram-bot-api';
require('dotenv').config()

const Bot = {
    async start() {
        const bot = new TelegramBot(process.env.TOKEN, {
            polling: true
        });

        bot.on("message", (msg) => {
            console.log(msg);
        });

        return bot;
    }
};

export default Bot;