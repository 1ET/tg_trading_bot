import translations from '@app/routes/translations'
import bot from "@app/functions/telegraf";
import * as tt from 'telegraf'
import exp from 'constants';
import { redis_client } from '@app/database/redis'


const menu = [
    [
        { text: '🇬🇧 ENGLISH', callback_data: 'English' },
        { text: '🇨🇳 CHINESE', callback_data: 'Chinese' },
    ],
    [
        { text: '⚽ NEOEVM', callback_data: 'neoevm' },
        { text: '⚾ Ethereum', callback_data: 'goerli' },
    ],
    [
        { text: '✋ Import Wallet', callback_data: '/privatekey' },
        { text: '🆕 Generate Wallet', callback_data: '/generatewallet' },
        { text: '🔎 Check Wallet', callback_data: '/check' },
    ],
    [
        { text: 'Wallet 1⃣️', callback_data: '/wallet1' },
        { text: 'Wallet 2⃣️', callback_data: '/wallet2' },
        { text: 'Wallet 3⃣️', callback_data: '/wallet3' },
    ],

    [
        { text: '⚠️ Check Token Contract', callback_data: '/tokensecurity' },
        { text: '⚠️ Check Deployment Contract', callback_data: '/addresssecurity' },
    ],

    [{ text: '💗 Referral Program', callback_data: '/Referral' }],
    [{ text: '🔥 Look Gems', url: 't.me/respect_gems_bot?start' }],
]

const menuC = [
    [
        { text: '🇬🇧 英语', callback_data: 'English' },
        { text: '🇨🇳 中文', callback_data: 'Chinese' },
    ],
    [
        { text: '⚽ neo链', callback_data: 'neoevm' },
        { text: '⚾ 以太链', callback_data: 'goerli' },
    ],
    [
        { text: '✋ 导入钱包', callback_data: '/privatekey' },
        { text: '🆕 生成钱包', callback_data: '/generatewallet' },
        { text: '🔎 查看钱包', callback_data: '/check' },
    ],
    [
        { text: '钱包 1⃣️', callback_data: '/wallet1' },
        { text: '钱包 2⃣️', callback_data: '/wallet2' },
        { text: '钱包 3⃣️', callback_data: '/wallet3' },
    ],

    [
        { text: '⚠️ 检测合约', callback_data: '/tokensecurity' },
        { text: '⚠️ 检测部署钱包', callback_data: '/addresssecurity' },
    ],

    [{ text: '💗 推广链接', callback_data: '/Referral' }],
    [{ text: '🔥 查看Gems', url: 't.me/respect_gems_bot?start' }],
]

async function setLanguage(ctx: any) {
    if (!ctx) return
    const language = ctx.callbackQuery.data
    const text = language === "Chinese" ? translations.zh.language : translations.en.language
    let chatId = ctx.callbackQuery.message.chat.id
    let messageId = ctx.callbackQuery.message.message_id
    ctx.telegram.editMessageText(
        chatId,
        messageId,
        null,
        text,
        {
            parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard:
                    language === 'English' ? menu : menuC,
            },
        }
    )

    ctx.telegram.sendMessage(
        chatId,
        language === 'English'
            ? `🎉The language has been switched: Englsih🎉`
            : `🎉语言已经切换为: 中文🎉`
    )
}

export {
    setLanguage
}