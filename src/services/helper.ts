import { Message } from 'telegram-typings';
import logger from '../config/logger_config';

export default class Helper {

    static getChatData = (msg: Message) => {
        const chatId = msg.chat.id;
        const userName = `${msg.chat.first_name  } ${  msg.chat.last_name}`;

        return {
            chat_id: chatId,
            userName: userName
        };
    };

    static getChatId = (msg: Message) => {
        const chatId = msg.chat.id;
        logger.info(`HELPER_get_CHAT_ID: ${chatId}`);
        return chatId;
    };

    static getUserName = (msg: Message) => {
        const userName = `${msg.chat.first_name  } ${  msg.chat.last_name}`;
        logger.info(`HELPER_get_USER_NAME: ${userName}`);
        return userName;
    };

    static getMessageId = (msg: Message) => {
        const messageId = msg.message_id;
        logger.info(`HELPER_get_MESSAGE_ID: ${messageId}`);
        return messageId;
    };

    static getCallBackData = (msg: Message) => {
        const data = { chatId: msg.chat.id, messageId: msg.message_id };
        logger.info(`HELPER_get_CALLBACK_DATA: ${JSON.stringify(data)}`);
        return data;
    }
}
