import { Action } from '../resolvers/types/Action';
import constants from '../config/constants';
import menuButtons from '../resolvers/menuButtons';

const maxHymnsPerPage = 80;
const dataInRow = 8;

export default class HymnsService {
    // TODO add DB
    getHymns = (chatId: number, nextIndex: number, action: Action) => {
        const hymnsMassive = [];
        const countOfHymns = this.getMaxCountOfItems(action);

        let start = 1;
        let finish = 81;

        if (nextIndex !== 0) {
            start = nextIndex * maxHymnsPerPage + 1;
            finish = (nextIndex + 1) * maxHymnsPerPage;
        }

        nextIndex = nextIndex + 1;

        let isLastPage = false;

        for (let i = start; i < finish; i += dataInRow) {
            const row = [];

            for (let j = i; j < i + dataInRow; j++) {
                if (j <= countOfHymns) {
                    row.push({
                        text: j,
                        callback_data: JSON.stringify({
                            type: action,
                            UUID: j,
                            chatId
                        })
                    });
                } else {
                    isLastPage = true;
                }
            }

            hymnsMassive.push(row);
        }

        if (!isLastPage) {
            hymnsMassive.push([{
                text: constants.NEXT_HYMNS,
                callback_data: JSON.stringify({
                    type: Action.NEXT_HYMNS,
                    nextIndex,
                    chatId
                })
            }]);
        }

        hymnsMassive.push([menuButtons.back]);

        return hymnsMassive;
    };

    private getMaxCountOfItems = (action: Action) => {

        let count = 0;

        switch (action) {
            case Action.GET_HYMN_DETAILS_97:
                count = 385;
                break;
            case Action.GET_HYMN_DETAILS_20:
                count = 340;
                break;
            case Action.GET_PSALM_DETAILS:
                count = 525;
                break;
       }

       return count;
    }
}
