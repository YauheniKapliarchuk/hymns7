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

    activeAction = Action.EMPTY_ACTION;

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
            case Action.HYMNS_OF_HOPE_1997:
                this.activeAction = Action.GET_HYMN_DETAILS_97;
                keyboard = this.hymnsService.getHymns(chat_data.chat_id, 0, Action.GET_HYMN_DETAILS_97);
                this.sendMessage(bot, chat_data.chat_id, chat_data.message_id, constants.CHOOSE_HYMNS_OF_HOME, keyboard);
                break;
            case Action.HYMNS_OF_HOPE_2020:
                this.activeAction = Action.GET_HYMN_DETAILS_20;
                keyboard = this.hymnsService.getHymns(chat_data.chat_id, 0, Action.GET_HYMN_DETAILS_20);
                this.sendMessage(bot, chat_data.chat_id, chat_data.message_id, constants.CHOOSE_HYMNS_OF_HOME, keyboard);
                break;
            case Action.SUPPORT:
                this.sendMessage(bot, chat_data.chat_id, chat_data.message_id, constants.SUPPORT_MSG, keyboardHome.support);
                break;

            // HYMNS ACTIONS
            case Action.GET_HYMN_DETAILS_97:
                this.editMessage(bot, chat_data.chat_id, chat_data.message_id, hymnDetailsKeyboard(chat_data.chat_id, chat_data.UUID));
                break;
            case Action.NEXT_HYMNS:
                keyboard = this.hymnsService.getHymns(chat_data.chat_id, chat_data.nextIndex, this.activeAction);
                this.editMessage(bot, chat_data.chat_id, chat_data.message_id, keyboard);
                break;
            case Action.BACK_TO_HYMNS:
                keyboard = this.hymnsService.getHymns(chat_data.chat_id, 0, this.activeAction);
                this.editMessage(bot, chat_data.chat_id, chat_data.message_id, keyboard);
                break;
            case Action.BACK_TO_HOME:
                const text = `${constants.WELCOME_MESSAGE + chat_data.userName}. \n${constants.CHOOSE_OPTION}`;
                this.sendMessage(bot, chat_data.chat_id, chat_data.message_id, text, keyboardHome.home);
                break;
            case Action.GET_NOTES_OF_HYMN:
                this.sendPhoto(bot, chat_data.chat_id, chat_data.UUID, chat_data.type);
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
            .catch((error: void) =>
                logger.error('EDIT MESSAGE: ' + error + '❗❗❗'));
    };

    private sendPhoto = (bot: TelegramBot, chat_id: number, hymnUUID: number, fromAction: Action) => {
        const photoURL = Helper.getFileURL(hymnUUID, fromAction, this.activeAction);
        bot.sendPhoto(chat_id, photoURL)
            .then(() =>
                logger.info('❗ Hymn ' + fromAction + ' of ' + hymnUUID + ' and ACTION = ' + this.activeAction + ' was sanded! 👌❗'))
            .catch((error: void) =>
                logger.error(error + '❗❗❗'));
    }
}
