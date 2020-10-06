import Bot from './bot';

//TODO refactor file to server and Using class Bot
Bot.start()
    .then(() => console.log('Bot started 🚀'))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
