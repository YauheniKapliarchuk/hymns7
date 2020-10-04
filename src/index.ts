import Bot from './bot';

Bot.start()
    .then(() => console.log('Bot started 🚀'))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
