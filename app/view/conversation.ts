import { MyConversation, MyContext } from '@app/functions/grammy'
import { getPoolKeys } from "@app/database/api/api"
import { checkTokenInfo } from "@app/raydium/index"
import translations from '@app/routes/translations'
import { buyBox } from '@app/view/messagebox'
import { buySwapMenu, addTradeMenu } from '@app/view/menu'
import { startBox } from '@app/view/messagebox'
import { InlineKeyboard } from 'grammy'
import { startMenu } from '@app/view/menu'
import { moneyFormat2, addressFormat14 } from '@app/utils/index'
import { getCopyStrategy } from '@app/database/api/api'

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
        await ctx.editMessageText(buyBox(dexQuery[0], ctx.session.value), {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard:
                    buySwapMenu
            }
        })
        await refreshBuySwap(conversation, ctx, dexQuery, message)
    } else {
        // 未找到交易对
        await ctx.deleteMessages([
            replyCtx.message_id,
            userInputCtx.message?.message_id
        ])
        await ctx.reply(`未找到交易对`)
        return
    }
}

async function refreshBuySwap(conversation, ctx, dexQuery, message) {
    console.log('执行refreshBuySwap')
    const response = await conversation.waitForCallbackQuery(["Back", "Refresh_Swap"]);
    if (response.match === "Back") {
        const startBoxParams = {
            pub: ctx.session.value.pubkey,
            balance: moneyFormat2(ctx.session.value.balance * 1e-9)
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
        await ctx.editMessageText(buyBox(tempData, ctx.session.value), {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard:
                    buySwapMenu
            }
        })
        const Refresh_Swap_DexQuery = await checkTokenInfo(message?.text ?? '')
        console.log('用户点击刷新')
        await ctx.editMessageText(buyBox(Refresh_Swap_DexQuery[0], ctx.session.value), {
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

interface CopyStrage {
    userId: string,
    copyStrage?: {
        buyGas: string,
        maxMcap: string,
        minMcap: string,
        sellGas: string,
        copySell: string,
        slippage: string,
        buyPercen: string,
        minLiquidity: string,
        targetWallet: string
    },
    idx?: number,
    isPaused: number
}

const copyTradLevel1Keyboard = () => {
    const keyboard = new InlineKeyboard()
        .text("➕ New", "NewCopy").row()
        .text("Pause All", "PauseAllCopy").row()
        .text("⬅ Back", "CopyTradeBack").row()
    return keyboard
}
const addTradeMenuKeybord = (params = {}) => {
    const keyboard = new InlineKeyboard()
        .text("target", "Target").row()
        .text("Pause All", "BuyAmount").text("⬅ Back", "CopySell").row()
        .text("➕ Add", "Add").row()

    return keyboard
}

// 用户在首页点击跟单列表页面
async function copyTradeCvers(conversation: MyConversation, ctx: MyContext) {
    language = 'English'
    // @ts-ignore
    let userStrage: CopyStrage[] = await getCopyStrategy(ctx.from?.id ?? "")
    let userStrageStr = ''
    if (userStrage) {
        userStrage.forEach((item, index) => {
            userStrageStr += `\n${item.isPaused ? "🟢" : "🟠"} Copy${index} — <code>${addressFormat14(item.copyStrage?.targetWallet ?? "")}</code> <a href="https://solscan.io/account/${item.copyStrage?.targetWallet ?? ""}">🅴</a>`
        })
    }
    await ctx.editMessageText(
        `<b>Copy Trade</b>\n\nCopy Trade allows you to copy the buys and sells of any target wallet. \n🟢 Indicates a copy trade setup is active.\n🟠 Indicates a copy trade setup is paused.\n ${userStrageStr}`,
        {
            parse_mode: "HTML",
            reply_markup: copyTradLevel1Keyboard()
        }
    )
    return
    const response = await conversation.waitForCallbackQuery(["PauseAllCopy", "CopyTradeBack"])

    // const response = await conversation.waitForCallbackQuery(["NewCopy", "PauseAllCopy", "CopyTradeBack"])
    // 4DdrfiDHpmx55i4SPssxVzS9ZaKLb8qr45NKY9Er9nNh
    console.log('response.match', response.match)
    if (response.match === "NewCopy") {

        // await editCopyTrader(ctx, conversation, editMenu, container)
        // NewCopy进入

        // await editCopyTrader(ctx, conversation, editMenu)
    } else if (response.match === "PauseAllCopy") {

        console.log('用户点击刷新-PauseAllCopy')
    } else if (response.match === "CopyTradeBack") {

        console.log('用户点击刷新-CopyTradeBack')
    }
    return
}

async function copyTraderListTargetCvers(conversation: MyConversation, ctx: MyContext) {
    let editMenu = {
        add: '',
        target: "",
        buyAmount: "100%",
        copySell: 1,
        buyGas: "0.0015 SOL",
        sellGas: "0.0015 SOL",
        slippage: "15%",
    }
    let replyCtx = await ctx.reply("Enter the target wallet address to copy trade")
    let userInputCtx = await conversation.wait()
    //     差一个校验-如果是自己的账户就不做操作
    // await new Promise<never | void>(async (resolve, reject) => {
    //     console.log('__Promise__', userInputCtx.message?.text)
    //     const { message } = userInputCtx
    //     console.log('__message__', message?.text)
    //     if (editMenu.target === message?.text?.trim()) {
    //         console.log('无操作返回')
    //         await ctx.deleteMessages([
    //             replyCtx.message_id,
    //             userInputCtx.message?.message_id ?? -1
    //         ])
    //     } else if (message?.text?.trim() === ctx.session.value.pubkey) {
    //         console.log('相同token提示')
    //         await ctx.deleteMessages([
    //             replyCtx.message_id,
    //             userInputCtx.message?.message_id ?? -1
    //         ])
    //         await ctx.answerCallbackQuery('You cannot copy trade to your own wallet.')
    //         await conversation.wait();
    //     } else (
    //         resolve()
    //     )
    // })
    const { message } = userInputCtx
    console.log('不同数据加入数据库-存入到add参数中', ctx.callbackQuery?.message?.message_id)

    editMenu.target = message?.text?.trim() ?? ""
    // 还需要把上一个卡片删除掉
    await ctx.deleteMessages([
        ctx.callbackQuery?.message?.message_id ?? -1,
        replyCtx.message_id,
        userInputCtx.message?.message_id ?? -1
    ])
    editMenu.add = '-' + message?.text?.trim() ?? ""
    await ctx.reply(translations.en.addTargetTip, {
        parse_mode: "HTML",
        reply_markup: {
            inline_keyboard:
                addTradeMenu(editMenu)
        }
    })
    return
}

export {
    greetingCvers,
    buySwapCvers,
    copyTradeCvers,
    copyTraderListTargetCvers
}