import Bot from './bot';

const bot = new Bot();

bot.start()
    .then(() => console.log('Bot started 🚀'))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
