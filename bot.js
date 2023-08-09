//Читаем файл .env
require('dotenv').config();

const { Telegraf } = require('telegraf');
const dateFormat = require('dateformat');
const axios = require('axios');

//Подключаем бота
const bot = new Telegraf(process.env.BOT_KEY);

//Функция для вывода информации
function displayData(response, ctx){
    //Получение и преобразование текущей даты с сервера
    let date = new Date(response.data.dt * 1000);

    //Объект с данными, которые мы будем отправлять пользователю
    const objData = {
        //Город
        city: response.data.name,
        //Описание погоды
        description: response.data.weather[0].description,
        //Температура
        temp: Math.round(response.data.main.temp),
        //Температура чувствуется как
        feels: Math.round(response.data.main.feels_like),
        //Максимальная температура в течении дня
        max_temp: Math.round(response.data.main.temp_min),
        //Минимальная температура в течении дня
        min_temp: Math.round(response.data.main.temp_max),
        //Скорость ветра в м/c
        speed: response.data.wind.speed,
        //Скорость порывов ветра в м/c
        //если данных не будет, то просто выводим Н/Д
        gust: typeof response.data.wind['gust'] === 'undefined' ? 'н/д' : response.data.wind.gust,
        //Дата
        date: dateFormat(date, 'mm/dd/yyyy'),
    };

    //Сообщение, которое мы будем отправлять пользователю
    let message = 
        `🏙 Город: ${objData.city} \n\n`+
        `🪟 За окном: ${objData.description}\n\n`+
        `🌡Температура: ${objData.temp} °C \n`+
        `🌡Чувствуется как: ${objData.feels} °C\n`+
        `🌡Минимальная температура: ${objData.min_temp} °C\n`+
        `🌡Максимальная температура: ${objData.max_temp} °C\n\n`+
        `🌬Скорость ветра: ${objData.speed} м/c \n`+
        `🌬Скорость порывов ветра: ${objData.gust} м/c \n\n`+
        `Данные актуальны на: ${objData.date} \n\n` +
        `Просто назови мне город, чтобы узнать погоду☀️`
    ;
    
    //Отправка сообщения
    ctx.replyWithHTML(message);
}

//Функция получения данных
async function getData(ctx, city){
    try{
        //Обращаемся к API
        const weatherApiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=23b4efd808e30bf5cdf4eb817c1da6e5&units=metric&lang=ru`;
        //Ответ от API записываем в переменную response
        const response = await axios.get(weatherApiUrl);

        displayData(response, ctx);
    } catch(e) {
        ctx.replyWithHTML("Произошла ошибка, мы не нашли город который вы указали :( \n\n" + "Назовите другой город☀️");
    }
}

//При старте бота выдаём сообщение
bot.start((ctx) => ctx.replyWithHTML("Привет!👋 \n\n" + "Просто назови мне город, чтобы узнать погоду☀️"));

//При отправлении любого сообщения боту будем делать запрос
//На получение данных о погоде

bot.on('message', (ctx) => {
    getData(ctx, ctx.message.text);
});

bot.launch();