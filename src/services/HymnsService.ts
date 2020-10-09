import { Action } from '../resolvers/types/Action';
import constants from '../config/constants';
// @ts-ignore
import * as TelegramBot from 'node-telegram-bot-api';

const countOfHymns = 80;
const dataInRow = 8;
const hymnsMassive: ({ text: number; callback_data: string; }[] | { text: string; callback_data: string; }[])[] = [];

export default class HymnsService {
    // TODO add DB
    getHymns = (chatId: number, bot: TelegramBot) => {
        for (let i = 1; i < countOfHymns; i += dataInRow) {
            const row = [];

            for (let j = i; j < i + dataInRow; j++) {
                row.push({
                    text: j,
                    callback_data: JSON.stringify({
                        type: Action.GET_HYMN_DETAILS,
                        hymnUUID: j,
                        chatId
                    })
                });
            }

            hymnsMassive.push(row);
        }

        hymnsMassive.push([{
            text: constants.NEXT_HYMNS,
            callback_data: 'next'
        }]);

        hymnsMassive.push([{
            text: constants.BACK,
            callback_data: 'back'
        }]);

        bot.sendMessage(chatId, constants.CHOOSE_HYMNS_OF_HOME, {
            reply_markup: {
                inline_keyboard: hymnsMassive
            }
        });
    }
}
