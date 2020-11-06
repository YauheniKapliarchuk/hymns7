import { Message } from 'telegram-typings';
import logger from '../config/logger_config';
import { Action } from '../resolvers/types/Action';
import HYMNS_CONFIG from '../config/hymns_config';
import HYMNS_OF_HOPE__1997_CONFIG from "../config/data/hymns_of_hope_1997_config";

// TODO: add for pzalms
export default class Helper {
    static getChatDataByMessage = (msg: Message) => {
        const chatId = msg.chat.id;
        const userName = `${msg.chat.first_name} ${msg.chat.last_name}`;
        const message_id = msg.message_id;

        return {
            chat_id: chatId,
            userName,
            message_id
        };
    };

    static getChatDataByQuery = (query: any) => {
        const data = JSON.parse(query.data);
        const { type } = data;

        const userName = `${query.from.first_name} ${query.from.last_name}`;

        return {
            chat_id: query.from.id,
            message_id: query.message.message_id,
            type,
            userName,
            nextIndex: data.nextIndex,
            UUID: data.UUID
        };
    };

    static getChatId = (msg: Message) => {
        const chatId = msg.chat.id;
        logger.info(`HELPER_get_CHAT_ID: ${chatId}`);
        return chatId;
    };

    static getFileURL = (item_index: number, fromAction: Action, activeAction: Action) => {
        let fileURL = '';

        switch (activeAction) {
            case Action.GET_HYMN_DETAILS_97:
                fileURL = fromAction === Action.GET_NOTES_OF_HYMN ?
                    HYMNS_OF_HOPE__1997_CONFIG.notes[item_index] :
                    HYMNS_OF_HOPE__1997_CONFIG.text[item_index];
                break;
            case Action.GET_HYMN_DETAILS_20:
                fileURL = fromAction === Action.GET_NOTES_OF_HYMN ?
                    HYMNS_CONFIG.hymns_of_hope_2020_notes[item_index] :
                    HYMNS_CONFIG.hymns_of_hope_2020_text[item_index];
                break;
            default:
                logger.info('DEFAULT SWITCH CASE FILE_URL');
                break;
        }

        return fileURL;
    }
}
