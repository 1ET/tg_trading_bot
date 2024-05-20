import { MyConversation, MyContext } from '@app/functions/grammy'
import { getPoolKeys } from "@app/database/api/api"
import { checkTokenInfo } from "@app/raydium/index"
import translations from '@app/routes/translations'
import { buyBox } from '@app/view/messagebox'
import { buySwapMenu } from '@app/view/menu'

let language: string = ""
// Conversation-Cvers
async function greetingCvers(conversation: MyConversation, ctx: MyContext) {
    language = 'English'

    switch (language) {
        case "English":
            await ctx.reply(translations.en.buySwapMenu.query);
            break;
        case "Chinese":
            await ctx.reply(translations.zh.buySwapMenu.query);
            break;
        default:
            break;
    }
    const { message } = await conversation.wait()
    // 查询池子获取token信息,并返回购买菜单
    await ctx.reply(`Welcome to the chat, ${message?.text}!`)
}

async function buySwapCvers(conversation: MyConversation, ctx: MyContext) {
    language = 'English'

    switch (language) {
        case "English":
            await ctx.reply(translations.en.buySwapMenu.query);
            break;
        case "Chinese":
            await ctx.reply(translations.zh.buySwapMenu.query);
            break;
        default:
            break;
    }
    const { message } = await conversation.wait()
    // console.log(message, '此处应该做校验---')
    const dexQuery = await checkTokenInfo(message?.text ?? '')
    if (dexQuery) {
        // 查询池子获取token信息,并返回购买菜单
        console.log('dexQuery===>', dexQuery)
        console.log('ctx===>', ctx.session)
        await ctx.reply(buyBox(1, 2), {
            parse_mode: "HTML", reply_markup: {
                inline_keyboard:
                    buySwapMenu
            },
        })
    } else {
        // 未找到交易对
        await ctx.reply(`未找到交易对`)
    }
}

// async function buySwap(params:type) {

// }

export {
    greetingCvers,
    buySwapCvers
}