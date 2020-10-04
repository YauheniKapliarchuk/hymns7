import Helper from './services/helper';
import { Message } from 'telegram-typings';
import constants from './config/constants';
import keyboard from './resolvers/keyboard';
// @ts-ignore
import * as TelegramBot from 'node-telegram-bot-api';
require('dotenv').config();

const Bot = {
    async start() {
        const bot = new TelegramBot(process.env.TOKEN, {
            polling: true
        });

        bot.onText(/\/start/, (msg: Message) => {
            sendHomeScreen(Helper.getChatId(msg), Helper.getUserName(msg));
        });

        const sendHomeScreen = (chatId: number, userName: string) => {
            bot.sendMessage(chatId, `${constants.WELCOME_MESSAGE + userName  }. \n${  constants.CHOOSE_OPTION}`, {
                reply_markup: {
                    keyboard: keyboard.home,
                    resize_keyboard: true
                }
            });
        };

        return bot;
    }
};

export default Bot;
