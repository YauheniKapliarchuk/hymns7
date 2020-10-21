// @ts-ignore
import * as TelegramBot from 'node-telegram-bot-api';
import HymnsService from "./HymnsService";
import {Action} from "../resolvers/types/Action";
import logger from "../config/logger_config";
import {hymnDetailsKeyboard} from "../resolvers/hymns/hymnDetailsKeyBoard";
import {Message} from "telegram-typings";
import Helper from "./helper";
import keyboardHome from "../resolvers/keyboard";
import constants from "../config/constants";
import menuButtons from "../resolvers/menuButtons";

export default class HomeScreenService {

    hymnsService = new HymnsService();

    // SEND Home Screen -----------------------------------------------------------------------------------
    sendHomeScreen = (bot: TelegramBot, msg: Message) => {

        const chat_data = Helper.getChatData(msg);

        let keyboard = [];

        switch (msg.text) {
            case Action.START:
                const text = `${constants.WELCOME_MESSAGE + chat_data.userName}. \n${constants.CHOOSE_OPTION}`;
                this.sendMessageForCommands(bot, chat_data.chat_id, text, keyboardHome.home);
                break;
            case menuButtons.home.hymns_of_hope:
                keyboard = this.hymnsService.getHymns(chat_data.chat_id, 0);
                this.sendMessage(bot, chat_data.chat_id, constants.CHOOSE_HYMNS_OF_HOME, keyboard);
                break;
            default:
                logger.info('DEFAULT SWITCH CASE');
                break;
        }
    };

    private sendMessage = (bot: TelegramBot, chat_id: number, text: string, keyboard: ({ text: number; callback_data: string; }[] | { text: string; callback_data: string; }[])[]) => {
        bot.sendMessage(chat_id, text, {
            reply_markup: {
                inline_keyboard: keyboard
            },
        })
    };

    private sendMessageForCommands = (bot: TelegramBot, chat_id: number, text: string, keyboard: string[][]) => {
        bot.sendMessage(chat_id, text, {
            reply_markup: {
                keyboard: keyboard,
                resize_keyboard: true
            },
        })
    };
    // ----------------------------------------------------------------------------------------------------

    // EDIT Home Screen -----------------------------------------------------------------------------------
    editHomeScreen = (bot: TelegramBot, query: any) => {
        const data = JSON.parse(query.data);
        const {type} = data;

        const chat_id = data.chatId;
        const message_id = query.message.message_id;

        let keyboard = [];

        switch (type) {
            case Action.GET_HYMN_DETAILS:
                this.editMessage(bot, chat_id, message_id, hymnDetailsKeyboard(chat_id));
                break;
            case Action.NEXT_HYMNS:
                keyboard = this.hymnsService.getHymns(chat_id, data.nextIndex);
                this.editMessage(bot, chat_id, message_id, keyboard);
                break;
            case Action.BACK_TO_HYMNS:
                keyboard = this.hymnsService.getHymns(chat_id, 0);
                this.editMessage(bot, chat_id, message_id, keyboard);
                break;
            default:
                logger.info('DEFAULT SWITCH CASE callback_query');
                break;
        }
    };

    private editMessage = (bot: TelegramBot, chat_id: number, message_id: string, keyboard: ({ text: number; callback_data: string; }[] | { text: string; callback_data: string; }[])[]) => {
        bot.editMessageReplyMarkup({
            inline_keyboard: keyboard
        }, {
            chat_id: chat_id,
            message_id
        })
            .then(() => logger.info('Edit Message ✅  ----- '))
            .catch( );
    }
}
