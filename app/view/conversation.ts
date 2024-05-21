import { MyConversation, MyContext } from '@app/functions/grammy'
import { getPoolKeys } from "@app/database/api/api"
import { checkTokenInfo } from "@app/raydium/index"
import translations from '@app/routes/translations'
import { buyBox } from '@app/view/messagebox'
import { buySwapMenu, copyTradLevel1 } from '@app/view/menu'
import { startBox } from '@app/view/messagebox'
import { startMenu } from '@app/view/menu'
import { moneyFormat2 } from '@app/utils/index'


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
    let replyCtx
    switch (language) {
        case "English":
            replyCtx = await ctx.reply(translations.en.buySwapMenu.query);
            break;
        case "Chinese":
            replyCtx = await ctx.reply(translations.zh.buySwapMenu.query);
            break;
        default:
            break;
    }
    let userInputCtx = await conversation.wait()
    const { message } = userInputCtx
    const dexQuery = await checkTokenInfo(message?.text ?? '')
    if (dexQuery) {
        await ctx.deleteMessages([
            replyCtx.message_id,
            userInputCtx.message?.message_id
        ])
        // 查询池子获取token信息,并返回购买菜单
        await ctx.editMessageText(buyBox(dexQuery[0], ctx.session.userInfo.value), {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard:
                    buySwapMenu
            }
        })
        await refreshBuySwap(conversation, ctx, dexQuery, message)
    } else {
        // 未找到交易对
        await replyCtx.deleteMessage()
        await ctx.reply(`未找到交易对`)
        return
    }
}

async function refreshBuySwap(conversation, ctx, dexQuery, message) {
    console.log('执行refreshBuySwap')
    const response = await conversation.waitForCallbackQuery(["Back", "Refresh_Swap"]);
    if (response.match === "Back") {
        const startBoxParams = {
            pub: ctx.session.userInfo.value.pubkey,
            balance: moneyFormat2(ctx.session.userInfo.value.balance * 1e-9)
        }
        await ctx.editMessageText(startBox(startBoxParams), {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard:
                    startMenu
            }
        })
        return
    } else if (response.match === "Refresh_Swap") {
        let tempData = JSON.parse(JSON.stringify(dexQuery[0]))
        tempData.priceUsd = 0
        tempData.liquidity.usd = 0
        tempData.fdv = 0
        tempData.priceChange.h1 = 0
        tempData.priceChange.h24 = 0
        await ctx.editMessageText(buyBox(tempData, ctx.session.userInfo.value), {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard:
                    buySwapMenu
            }
        })
        const Refresh_Swap_DexQuery = await checkTokenInfo(message?.text ?? '')
        console.log('用户点击刷新')
        await ctx.editMessageText(buyBox(Refresh_Swap_DexQuery[0], ctx.session.userInfo.value), {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard:
                    buySwapMenu
            }
        })
        console.log('用户点击刷新-refreshBuySwap')
        await refreshBuySwap(conversation, ctx, dexQuery, message)
    }

}

async function copyTradeCvers(conversation: MyConversation, ctx: MyContext) {
    language = 'English'
    let replyCtx
    await ctx.editMessageText(
        `Copy Trade\n\nCopy Trade allows you to copy the buys and sells of any target wallet. \n🟢 Indicates a copy trade setup is active.\n🟠 Indicates a copy trade setup is paused.`,
        {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard:
                    copyTradLevel1()
            }
        }
    )
    const response = await conversation.waitForCallbackQuery(["NewCopy", "PauseAllCopy", "CopyTradeBack"])
    if (response.match === "NewCopy") {
        // const startBoxParams = {
        //     pub: ctx.session.userInfo.value.pubkey,
        //     balance: moneyFormat2(ctx.session.userInfo.value.balance * 1e-9)
        // }
        // await ctx.editMessageText(startBox(startBoxParams), {
        //     parse_mode: "HTML",
        //     reply_markup: {
        //         inline_keyboard:
        //             startMenu
        //     }
        // })
        await ctx.editMessageText(`To setup a new Copy Trade:
- Assign a unique name or “tag” to your target wallet, to make it easier to identify.
- Enter the target wallet address to copy trade.
- Enter the percentage of the target's buy amount to copy trade with, or enter a specific SOL amount to always use.
- Toggle on Copy Sells to copy the sells of the target wallet.
- Click “Add” to create and activate the Copy Trade.

To manage your Copy Trade:
- Click the “Active” button to “Pause” the Copy Trade.
- Delete a Copy Trade by clicking the “Delete” button.`, {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard:
                    startMenu
            }
        })
    } else if (response.match === "PauseAllCopy") {

        console.log('用户点击刷新-PauseAllCopy')
    } else if (response.match === "CopyTradeBack") {

        console.log('用户点击刷新-CopyTradeBack')
    }
    // await copyTradeAdd(conversation, ctx)
}

// async function copyTradeAdd(conversation, ctx) {
//     language = 'English'
//     let replyCtx
//     const response = await conversation.waitForCallbackQuery(["NewCopy", "Refresh_Swap"]);
//     if (response.match === "Back") {
//         const startBoxParams = {
//             pub: ctx.session.userInfo.value.pubkey,
//             balance: moneyFormat2(ctx.session.userInfo.value.balance * 1e-9)
//         }
//         await ctx.editMessageText(startBox(startBoxParams), {
//             parse_mode: "HTML",
//             reply_markup: {
//                 inline_keyboard:
//                     startMenu
//             }
//         })
//         return
//     } else if (response.match === "Refresh_Swap") {

//         console.log('用户点击刷新-refreshBuySwap')
//         // await refreshBuySwap(conversation, ctx, dexQuery, message)
//     }

// }

export {
    greetingCvers,
    buySwapCvers,
    copyTradeCvers
}