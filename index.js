const { Telegraf, Markup, Extra } = require('telegraf');
require('dotenv').config();
const youtubedl = require('youtube-dl')
const bot = new Telegraf('1966558366:AAHQHA14AR_ZwZ4EHBVM-kHoBhr3UECSUJE');

bot.start((ctx) => {
    ctx.reply('Приветствую ' + ((ctx.from['username'] ?? ctx.from['first_name']) + ' 👻. ') 
                + 'Я умею скачивать видео с YouTube 🖥'
                + '\nОтправляй мне ссылку и я пришлю тебе видео.'
                + '\nТолько не забудь подписаться на канал 👉 @saveyoutubevideo')
})

bot.on('message', async (ctx) => {
    const userMessage = ctx.message.text;
    const isYouTubeVideo = userMessage && 
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/.test(userMessage) &&
        !userMessage.includes('&list');
    
    if (isYouTubeVideo) {
        try {
            const chatMemberInfo = await ctx.telegram.getChatMember('@saveyoutubevideo', ctx.from.id);
            if (chatMemberInfo) {
                let video_id = userMessage.split('v=')[1];
                let ampersandPosition = video_id.indexOf('&');
                if(ampersandPosition != -1) {
                    video_id = video_id.substring(0, ampersandPosition);
                }

                const presaverUrl720 = `https://presaver.com/${video_id}/download/22`;
                const presaverUrl360 = `https://presaver.com/${video_id}/download/18`;

                bot.telegram.sendMessage(ctx.chat.id, 'А вот и ссылка👇. Кликай на разрешение которое хочешь скачать', {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: 'Скачать видео 720', url: presaverUrl720},
                                { text: 'Скачать видео 360', url: presaverUrl360}
                            ]
                        ]
                    }
                })
            }
        } catch(er) {
           ctx.reply('Подпишись на канал @saveyoutubevideo и сможешь скачивать видео 😄');
        }
    } else {
        ctx.reply('Пришлите мне корректную ссылку 😺')
    }
})

bot.launch();