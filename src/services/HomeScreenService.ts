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

export default class HomeScreenService {

    hymnsService = new HymnsService();

    // SEND Home Screen -----------------------------------------------------------------------------------
    sendHomeScreen = (bot: TelegramBot, msg: Message) => {

        const chat_data = Helper.getChatDataByMessage(msg);

        switch (msg.text) {
            case Action.START:
                const text = `${constants.WELCOME_MESSAGE + chat_data.userName}. \n${constants.CHOOSE_OPTION}`;
                this.sendMessage(bot, chat_data.chat_id, chat_data.message_id, text, keyboardHome.home);
                break;
            default:
                logger.info('DEFAULT SWITCH CASE');
                break;
        }
    };

    // EDIT Home Screen -----------------------------------------------------------------------------------
    editHomeScreen = (bot: TelegramBot, query: any) => {
        const chat_data = Helper.getChatDataByQuery(query);

        let keyboard = [];

        switch (chat_data.type) {
            // MENU BUTTONS
            case Action.HYMNS_OF_HOPE:
                keyboard = this.hymnsService.getHymns(chat_data.chat_id, 0);
                this.sendMessage(bot, chat_data.chat_id, chat_data.message_id, constants.CHOOSE_HYMNS_OF_HOME, keyboard);
                break;
            case Action.GET_HYMN_DETAILS:
                this.editMessage(bot, chat_data.chat_id, chat_data.message_id, hymnDetailsKeyboard(chat_data.chat_id));
                break;
            case Action.SUPPORT:
                this.sendMessage(bot, chat_data.chat_id, chat_data.message_id, constants.SUPPORT_MSG, keyboardHome.support);
                break;

            // HYMNS ACTIONS
            case Action.NEXT_HYMNS:
                keyboard = this.hymnsService.getHymns(chat_data.chat_id, chat_data.nextIndex);
                this.editMessage(bot, chat_data.chat_id, chat_data.message_id, keyboard);
                break;
            case Action.BACK_TO_HYMNS:
                keyboard = this.hymnsService.getHymns(chat_data.chat_id, 0);
                this.editMessage(bot, chat_data.chat_id, chat_data.message_id, keyboard);
                break;
            case Action.BACK_TO_HOME:
                const text = `${constants.WELCOME_MESSAGE + chat_data.userName}. \n${constants.CHOOSE_OPTION}`;
                this.sendMessage(bot, chat_data.chat_id, chat_data.message_id, text, keyboardHome.home);
                break;
            default:
                logger.info('DEFAULT SWITCH CASE callback_query');
                break;
        }
    };

    private sendMessage = (bot: TelegramBot, chat_id: number, message_id: number, text: string, keyboard: ({ text: number; callback_data: string; }[] | { text: string; callback_data: string; }[])[]) => {
        bot.deleteMessage(chat_id, message_id);
        bot.sendMessage(chat_id, text, {
            reply_markup: {
                inline_keyboard: keyboard
            },
        })
            .then(() => logger.info('Send Message 💨  ----- '));
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
    };
}
