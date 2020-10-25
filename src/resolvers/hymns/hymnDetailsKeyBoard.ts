import { Action } from '../types/Action';
import constants from '../../config/constants';

export const hymnDetailsKeyboard = (chat_id: number, item_index: number) => {
    return [
        [
            {
                text: constants.NOTES,
                callback_data: JSON.stringify({
                    type: Action.GET_NOTES_OF_HYMN,
                    UUID: item_index,
                    chat_id
                })
            },
            {
                text: constants.TEXT,
                callback_data: JSON.stringify({
                    type: Action.GET_TEXT_OF_HYMN,
                    UUID: item_index,
                    chat_id
                })
            }
        ],
        [
            {
                text: constants.BACK,
                callback_data: JSON.stringify({
                    type: Action.BACK_TO_HYMNS,
                    chat_id
                })
            }
        ]
    ];
};
