import { Message } from 'telegram-typings';
import logger from '../config/logger_config';

export default class Helper {
    static getChatDataByMessage = (msg: Message) => {
        const chatId = msg.chat.id;
        const userName = `${msg.chat.first_name  } ${  msg.chat.last_name}`;
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

        const userName = `${query.from.first_name  } ${  query.from.last_name}`;
        return {
            chat_id: query.from.id,
            message_id: query.message.message_id,
            type,
            userName,
            nextIndex: data.nextIndex
        };
    };

    static getChatId = (msg: Message) => {
        const chatId = msg.chat.id;
        logger.info(`HELPER_get_CHAT_ID: ${chatId}`);
        return chatId;
    };
}
