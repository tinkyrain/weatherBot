require('dotenv').config();

const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('6534804298:AAEIx3gpMhiyalApu4X4iY_eIuZWO2ucu7w');

const API_KEY = process.env.API_KEY;

bot.start((ctx) => ctx.reply('Привет! Отправь мне свою геолокацию и я дам тебе данные о погоде! :)'));
bot.launch();

bot.on('message', (ctx) => {
    console.log('test');
    if(ctx.message.location){
        const weatherApiUrl = `https://openweathermap.org/data/2.5/weather?lat=${ctx.message.location.latitude}&lon=${ctx.message.location.longitude}&appid=439d4b8O4bc8187953eb36d2a8c26a02&lang=ru`;

        const response = axios.get(weatherApiUrl);
        ctx.reply(`${response.data}`);
    }
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));