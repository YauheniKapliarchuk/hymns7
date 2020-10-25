import constants from '../config/constants';
import { Action } from './types/Action';

const menuButtons = {
    home: {
        hymns_of_hope: {
            text: constants.HYMNS_OF_HOPE,
            callback_data: JSON.stringify({
                type: Action.HYMNS_OF_HOPE_1997
            })
        },
        hymns_of_hope_2020: {
            text: constants.HYMNS_OF_HOPE_2020,
            callback_data: JSON.stringify({
                type: Action.HYMNS_OF_HOPE_2020
            })
        },
        psalms_of_zion: {
            text: constants.PSALMS_OF_ZION,
            callback_data: JSON.stringify({
                type: Action.PSALMS_OF_ZION
            })
        },
        songs: {
            text: constants.SONGS,
            callback_data: JSON.stringify({
                type: Action.SONGS
            })
        },
        support: {
            text: constants.SUPPORT,
            callback_data: JSON.stringify({
                type: Action.SUPPORT
            })
        }
    },
    back: {
        text: constants.BACK_TO_HOME,
        callback_data: JSON.stringify({
            type: Action.BACK_TO_HOME
        })
    }
};

export default menuButtons;
