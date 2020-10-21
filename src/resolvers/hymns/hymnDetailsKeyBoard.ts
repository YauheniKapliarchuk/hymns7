import { Action } from '../types/Action';
import constants from '../../config/constants';

export const hymnDetailsKeyboard = (chatId: number) => {
    return [
        [
            {
                text: constants.NOTES,
                callback_data: 'Notes'
            },
            {
                text: constants.TEXT,
                callback_data: 'Text'
            }
        ],
        [
            {
                text: constants.BACK,
                callback_data: JSON.stringify({
                    type: Action.BACK_TO_HYMNS,
                    chatId
                })
            }
        ]
    ];
};
