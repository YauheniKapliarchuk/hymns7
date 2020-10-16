import Helper from './services/helper';
import { Message } from 'telegram-typings';
// @ts-ignore
import * as TelegramBot from 'node-telegram-bot-api';
import logger from './config/logger_config';
import { dbConfig } from './config/db_config';
import menuButtons from './resolvers/menuButtons';
import HomeScreenService from './services/HomeScreenService';
import HymnsService from './services/HymnsService';
import { Action } from './resolvers/types/Action';

require('dotenv').config();

class Bot {
    bot = new TelegramBot(process.env.TOKEN, {
        polling: true
    });

    homeScreenService = new HomeScreenService();
    hymnsService = new HymnsService();

    constructor() {
        this.connectionToDateBase();
    }

    async start() {
        this.bot.onText(/\/start/, (msg: Message) => {
            this.homeScreenService.sendHomeScreen(Helper.getChatId(msg), Helper.getUserName(msg), this.bot);
        });

        this.bot.on('message', (msg: Message) => {
            const chatId = Helper.getChatId(msg);

            switch (msg.text) {
                case menuButtons.home.hymns_of_hope:
                    this.bot.sendMessage(chatId, 'Выберите гимн', {
                        reply_markup: {
                            inline_keyboard: this.hymnsService.getHymns(chatId)
                        }
                    });
                    break;
                default:
                    logger.info('DEFAULT SWITCH CASE');
                    break;
            }
        });

        this.bot.on('polling_error', console.log);

        // TODO: see documentation for this
        this.bot.on('callback_query', (query: any) => {
            const data = JSON.parse(query.data);
            // const message = JSON.parse(query.message);
            const { type } = data;
            const chatId = data.chatId;

            const message_id = query.message.message_id;

            logger.warn(`${'DATA MARKUP: ' + ' : '}${  chatId}`);

            // TODO: Refactoring
            switch (type) {
                case Action.GET_HYMN_DETAILS:
                    logger.warn(`${'DATA MARKUP 13: ' + ' : '}${  chatId  } : ${  message_id  } : ${   query.inline_message_id}`);

                    this.bot.editMessageReplyMarkup({
                        inline_keyboard: [
                            [
                                {
                                    text: 'Ноты',
                                    callback_data: 'Notes'
                                },
                                {
                                    text: 'Текст',
                                    callback_data: 'Text'
                                }
                            ],
                            [
                                {
                                    text: 'Назад',
                                    callback_data: JSON.stringify({
                                        type: Action.BACK_TO_HYMNS,
                                        chatId
                                    })
                                }
                            ]
                        ]
                    }, {
                        chat_id: chatId,
                        message_id
                    });

                    break;
                case Action.BACK_TO_HYMNS:
                    logger.warn(`${'DATA MARKUP 14: ' + ' : '}${  chatId  } : ${  message_id}`);
                    this.bot.editMessageReplyMarkup({
                        inline_keyboard: this.hymnsService.getHymns(chatId)
                    }, {
                        chat_id: chatId,
                        message_id
                    });
                    break;
            }

            // TODO: prepare keyboard for aother types
            logger.info(`INFO FROM DATA: ${  data.chatId  } :: ${  data.hymnUUID}`);
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
