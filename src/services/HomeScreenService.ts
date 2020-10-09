import constants from '../config/constants';
import keyboard from '../resolvers/keyboard';
// @ts-ignore
import * as TelegramBot from 'node-telegram-bot-api';

export default class HomeScreenService {
    sendHomeScreen = (chatId: number, userName: string, bot: TelegramBot) => {
        bot.sendMessage(chatId, `${constants.WELCOME_MESSAGE + userName  }. \n${  constants.CHOOSE_OPTION}`, {
            reply_markup: {
                keyboard: keyboard.home,
                resize_keyboard: true
            }
        });
    };
}
