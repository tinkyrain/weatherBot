require('dotenv').config();

const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_KEY);

async function getData(ctx, city){
    const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=23b4efd808e30bf5cdf4eb817c1da6e5&units=metric&lang=ru`;

    const response = await axios.get(weatherApiUrl);
    
    return response;
}

bot.start((ctx) => ctx.replyWithHTML("Привет!👋 \n\n" + "Просто назови мне город, чтобы узнать погоду☀️"));

bot.on('message', (ctx) => {
    const response = getData(ctx, ctx.message.text);
    ctx.reply('aaa');
});

bot.launch();