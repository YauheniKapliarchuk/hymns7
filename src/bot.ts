import Helper from './services/helper';
import { Message } from 'telegram-typings';
import constants from './config/constants';
// @ts-ignore
import * as TelegramBot from 'node-telegram-bot-api';
import logger from "./config/logger_config";
import { dbConfig } from './config/db_config';
import menuButtons from "./resolvers/menuButtons";
import hymnsKeyboard from "./resolvers/hymns_keyboard";
import HomeScreenService from "./services/HomeScreenService";
require('dotenv').config();

class Bot {

    bot = new TelegramBot(process.env.TOKEN, {
        polling: true
    });

    homeScreenService = new HomeScreenService();

    constructor() {
        this.connectionToDateBase();
    }

    //TODO refactor this method. Move functions
    async start() {
        this.bot.onText(/\/start/, (msg: Message) => {
            this.homeScreenService.sendHomeScreen(Helper.getChatId(msg), Helper.getUserName(msg), this.bot);
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

        return this.bot;
    }

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
