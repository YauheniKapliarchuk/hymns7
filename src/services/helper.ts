import { Message } from 'telegram-typings';
import logger from '../config/logger_config';

export default class Helper {
    static getChatId = (msg: Message) => {
        const chatId = msg.chat.id;
        logger.info(`HELPER_get_CHAT_ID: ${chatId}`);
        return chatId;
    };

    static getUserName = (msg: Message) => {
        const userName = `${msg.chat.first_name  } ${  msg.chat.last_name}`;
        logger.info(`HELPER_get_USER_NAME: ${userName}`);
        return userName;
    }
}
