export enum Action {
    START ='/start',

    //MENU BUTTONS
    HYMNS_OF_HOPE_1997 = 'get_hymns_of_hope_1997',
    HYMNS_OF_HOPE_2020 = 'get_hymns_of_hope_2020',
    PSALMS_OF_ZION = 'psalms_of_zion',
    SONGS = 'songs',
    SUPPORT = 'support',

    // HYMN ACTION BUTTONS
    GET_HYMN_DETAILS_97 = 'get_hymn_details_97',
    GET_HYMN_DETAILS_20 = 'get_hymn_details_20',
    BACK_TO_HOME = 'back_to_home',

    NEXT_HYMNS = 'next_hymns',
    BACK_TO_HYMNS = 'back_to_hymns',

    GET_NOTES_OF_HYMN = 'get_notes',
    GET_TEXT_OF_HYMN = 'get_text',

    GET_PSALM_DETAILS = 'get_psalms_details',
    GET_NOTES_OF_PSALM = 'get_psalms_notes',
    GET_TEXT_OF_PSALM = 'get_psalms_text',

    EMPTY_ACTION = 'empty_action',
}
