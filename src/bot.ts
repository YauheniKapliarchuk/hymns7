import Helper from './services/helper';
import { Message } from 'telegram-typings';
import constants from './config/constants';
import keyboard from './resolvers/keyboard';
// @ts-ignore
import * as TelegramBot from 'node-telegram-bot-api';
import logger from "./config/logger_config";
require('dotenv').config();

class Bot {

    bot = new TelegramBot(process.env.TOKEN, {
        polling: true
    });

    constructor() {
        this.connectionToDateBase();
    }

    async start() {
        this.bot.onText(/\/start/, (msg: Message) => {
            sendHomeScreen(Helper.getChatId(msg), Helper.getUserName(msg));
        });

        const sendHomeScreen = (chatId: number, userName: string) => {
            this.bot.sendMessage(chatId, `${constants.WELCOME_MESSAGE + userName  }. \n${  constants.CHOOSE_OPTION}`, {
                reply_markup: {
                    keyboard: keyboard.home,
                    resize_keyboard: true
                }
            });
        };

        return this.bot;
    }

    //TODO implementation connection to DB
    connectionToDateBase() {
        logger.info('Cottection to DataBase');
    }
}

export default Bot;
