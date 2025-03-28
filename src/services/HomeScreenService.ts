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
import * as fs from "fs";

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
            case Action.PSALMS_OF_ZION:
                this.activeAction = Action.GET_PSALM_DETAILS;
                keyboard = this.hymnsService.getHymns(chat_data.chat_id, 0, Action.GET_PSALM_DETAILS);
                this.sendMessage(bot, chat_data.chat_id, chat_data.message_id, constants.CHOOSE_PSALMS_OF_ZION, keyboard);
                break;
            case Action.SUPPORT:
                this.sendMessage(bot, chat_data.chat_id, chat_data.message_id, constants.SUPPORT_MSG, keyboardHome.support);
                break;

            // HYMNS & PSALMS ACTIONS
            case Action.GET_HYMN_DETAILS_97:
            case Action.GET_HYMN_DETAILS_20:
            case Action.GET_PSALM_DETAILS:
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
            case Action.GET_TEXT_OF_HYMN:
            case Action.GET_NOTES_OF_PSALM:
            case Action.GET_TEXT_OF_PSALM:
                this.sendHymnContent(bot, chat_data.chat_id, chat_data.message_id, chat_data.UUID, chat_data.type, hymnDetailsKeyboard(chat_data.chat_id, chat_data.UUID));
                break;
            default:
                logger.info('DEFAULT SWITCH CASE callback_query');
                break;
        }
    };

    private sendMessage = (bot: TelegramBot, chat_id: number, message_id: number, text: string, keyboard: ({
        text: number;
        callback_data: string;
    }[] | { text: string; callback_data: string; }[])[]) => {
        bot.deleteMessage(chat_id, message_id);
        bot.sendMessage(chat_id, text, {
            reply_markup: {
                inline_keyboard: keyboard
            },
        })
            .then(() => logger.info('Send Message 💨  ----- '));
    };

    private editMessage = (bot: TelegramBot, chat_id: number, message_id: string, keyboard: ({
        text: number;
        callback_data: string;
    }[] | { text: string; callback_data: string; }[])[]) => {
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

    // private sendPhoto = (bot: TelegramBot, chat_id: number, hymnUUID: number, fromAction: Action) => {
    //     const photoURL = Helper.getHymnContent(hymnUUID, fromAction, this.activeAction);
    //     bot.sendPhoto(chat_id, photoURL)
    //         .then(() =>
    //             logger.info('❗ Hymn ' + fromAction + ' of ' + hymnUUID + ' and ACTION = ' + this.activeAction + ' was sanded! 👌❗'))
    //         .catch((error: void) =>
    //             logger.error(error + '❗❗❗'));
    // }

    /**
     * Sends hymn or psalm content based on user selection.
     */
    private sendHymnContent = async (
        bot: TelegramBot,
        chat_id: number,
        message_id: string,
        hymnIndex: number,
        fromAction: Action,
        keyboard: ({ text: number; callback_data: string; }[] | { text: string; callback_data: string; }[])[]
    ) => {
        try {
            // Fetch hymn or psalm content
            const content = Helper.getHymnContent(hymnIndex, fromAction, this.activeAction);

            if (!content) {
                await bot.sendMessage(chat_id, 'Error: Hymn content not found.');
                return;
            }

            // Attempt to delete the previous message
            await bot.deleteMessage(chat_id, message_id).catch((error: any) => {
                logger.warn(`⚠️ Failed to delete message ${message_id}: ${error}`);
            });

            // Send hymn content (either image or text)
            if (fromAction === Action.GET_NOTES_OF_HYMN || fromAction === Action.GET_NOTES_OF_PSALM) {
                const stats = fs.statSync(content);
                const fileSizeInMB = stats.size / (1024 * 1024);

                if (fileSizeInMB < 1) {
                    await bot.sendPhoto(chat_id, content);
                    logger.info(`✅ Notes (ID: ${hymnIndex}) sent as an image.`);
                } else {
                    await bot.sendDocument(chat_id, content);
                    logger.info(`✅ Notes (ID: ${hymnIndex}) sent as a document.`);
                }
            } else {
                await bot.sendMessage(chat_id, content);
                logger.info(`✅ Text (ID: ${hymnIndex}) sent as text.`);
            }

            // Send additional test message with a keyboard
            await bot.sendMessage(chat_id, `Гимн/Псалм - ${hymnIndex}`, {
                reply_markup: { inline_keyboard: keyboard }
            });
            logger.info('✅ Test message sent successfully.');
        } catch (error) {
            logger.error(`❌ Error in sendHymnContent: ${error}`);
        }
    };

}
