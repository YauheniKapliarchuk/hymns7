import Helper from './services/helper';
import { Message } from 'telegram-typings';
import constants from './config/constants';
import keyboard from './resolvers/keyboard';
// @ts-ignore
import * as TelegramBot from 'node-telegram-bot-api';
import logger from "./config/logger_config";
import { dbConfig } from './config/db_config';
import menuButtons from "./resolvers/menuButtons";
import hymnsKeyboard from "./resolvers/hymns_keyboard";
require('dotenv').config();

class Bot {

    bot = new TelegramBot(process.env.TOKEN, {
        polling: true
    });

    constructor() {
        this.connectionToDateBase();
    }

    //TODO refactor this method. Move functions
    async start() {
        this.bot.onText(/\/start/, (msg: Message) => {
            sendHomeScreen(Helper.getChatId(msg), Helper.getUserName(msg));
        });

        this.bot.on('message', (msg: Message) => {
            const chatId = Helper.getChatId(msg);

            switch (msg.text) {
                case menuButtons.home.hymns_of_hope:
                    this.bot.sendMessage(chatId, constants.CHOOSE_HYMNS_OF_HOME, {
                        reply_markup: {
                            inline_keyboard: hymnsKeyboard.hymns
                        }
                    })
            }
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
        dbConfig
            .authenticate()
            .then(() => {
                logger.info('⛓️ Connection has been established successfully. 🧳');
            })
            .catch((error: void) => {
                logger.error('🆘 Unable to connect to the database: ', error);
            });
    }
}

export default Bot;
