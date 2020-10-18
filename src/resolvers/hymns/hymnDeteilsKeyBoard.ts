import {Action} from "../types/Action";

export const hymnDetailsKeyboard = (chatId: number) => {
    return [
        [
            {
                text: 'Ноты',
                callback_data: 'Notes'
            },
            {
                text: 'Текст',
                callback_data: 'Text'
            }
        ],
        [
            {
                text: 'Назад',
                callback_data: JSON.stringify({
                    type: Action.BACK_TO_HYMNS,
                    chatId
                })
            }
        ]
    ]
};