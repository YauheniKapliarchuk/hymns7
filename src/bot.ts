import {Message} from 'telegram-typings';
// @ts-ignore
import * as TelegramBot from 'node-telegram-bot-api';
import logger from './config/logger_config';
import {dbConfig} from './config/db_config';
import HomeScreenService from './services/HomeScreenService';

require('dotenv').config();

class Bot {
    bot = new TelegramBot(process.env.TOKEN, {
        polling: true
    });

    homeScreenService = new HomeScreenService();

    constructor() {
        this.connectionToDateBase();
    }

    async start() {

        this.bot.on('text', (msg: Message) => {
            this.homeScreenService.sendHomeScreen(this.bot, msg);
        });

        this.bot.on('callback_query', (query: any) => {
            this.homeScreenService.editHomeScreen(this.bot, query);
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
