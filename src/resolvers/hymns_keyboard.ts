const countOfHymns = 80;
const dataInRow = 8;
const hymnsMassive = [];

//TODO move this logic to resolver
for (var i = 1; i < countOfHymns; i += dataInRow ) {
    const row = [];

    for (var j = i; j < i + dataInRow; j++ ){
        row.push({
            text: j,
            callback_data: j
        })
    }

    hymnsMassive.push(row);
}

hymnsMassive.push([{
    text: 'Следующие',
    callback_data: 'next'
}]);

hymnsMassive.push([{
    text: 'Вернуться в главное меню',
    callback_data: 'back'
}]);

const hymnsKeyboard = {
    hymns: hymnsMassive
};

export default hymnsKeyboard;