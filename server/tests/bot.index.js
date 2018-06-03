const bot = require('./bot');

setInterval(() => {
    const aa = bot.register().then(() => {

    })
}, 10000);

bot.register()