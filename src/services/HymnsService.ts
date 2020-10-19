import { Action } from '../resolvers/types/Action';
import constants from '../config/constants';

// TODO: add validation on count of hymns
// const countOfHymns = 385;
const maxHymnsPerPage = 80;
const dataInRow = 8;
let hymnsMassive: ({ text: number; callback_data: string; }[] | { text: string; callback_data: string; }[])[] = [];

export default class HymnsService {
    // TODO add DB
    getHymns = (chatId: number, nextIndex: number) => {
        hymnsMassive = [];

        // let index = 0;
        let start = 1;
        let finish = 81;

        if (nextIndex !== 0) {
            start = nextIndex * maxHymnsPerPage + 1;
            finish = (nextIndex + 1) * maxHymnsPerPage;
        }

        nextIndex = nextIndex + 1;

        for (let i = start; i < finish; i += dataInRow) {
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
            callback_data: JSON.stringify({
                type: Action.NEXT_HYMNS,
                nextIndex,
                chatId
            })
        }]);

        hymnsMassive.push([{
            text: constants.BACK,
            callback_data: 'back'
        }]);

        return hymnsMassive;
    }
}
