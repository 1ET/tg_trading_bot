import bot from "@app/functions/grammy";
import { userSetting } from '@app/functions/commands'
import { setLanguage } from '@app/functions/ui'
// import { buyCoin } from '@app/functions/swap'
import { bold, fmt, hydrateReply, italic, link } from "@grammyjs/parse-mode";
import { startMenu, buySwapMenu } from '@app/view/menu'
import { startBox } from '@app/view/messagebox'
import { checkTokenInfo } from "@app/raydium/index"
import { buyBox } from '@app/view/messagebox'
import { moneyFormat2 } from '@app/utils/index'
import translations from '@app/routes/translations'
import { InlineKeyboard } from 'grammy'
import { addCopyStrategy, pauseAllStrategy } from '@app/database/api/api'
import { getUserExit } from '@app/database/api/api'
import { checkBalance } from '@app/raydium/index'
import { conversations } from "@grammyjs/conversations";

const addTradeMenuKeybord = (params = {}) => {
	const keyboard = new InlineKeyboard()
		.text("target", "Target").row()
		.text("Pause All", "BuyAmount").text("⬅ Back", "CopySell").row()
		.text("➕ Add", "Add").row()

	return keyboard
}

const text = async (): Promise<void> => {
	bot.on("message", async (ctx) => {
		console.log('onmessage')
		// ctx.replyFmt(fmt`${bold(ctx.update.message.text ?? 'noText')}`)
	});
};

const callbackQuery = async (): Promise<void> => {
	bot.on("callback_query:data", async (ctx: any) => {
		let callBackData = ctx.callbackQuery.data.split("-")
		let callBackEvent = callBackData[0]
		let callBackParams = callBackData[1]
		console.log('Event_02', callBackData)
		switch (callBackEvent) {
			case 'Chinese':
				console.log('用户点击Chinese')
				userSetting.language = "Chinaese"
				setLanguage(ctx)
				ctx.reply(ctx.callbackQuery.data)
				break;
			case 'English':
				userSetting.language = "English"
				setLanguage(ctx)
				ctx.reply(ctx.callbackQuery.data)
				break;
			case 'Buy':
				console.log('用户点击购买')
				await ctx.conversation.enter("buySwapCvers")
				break;
			case 'Sell':
				try {
					console.log('用户点击出售')
					// ctx.session = 9
					ctx.reply('sell')
				} catch (error) {
					console.log('用户点击Sell失败', error)
				}
				break;
			case 'Position':
				console.log('用户点击仓位', ctx)
				ctx.reply('Position')
				break;
			case 'Target':
				console.log('用户点击Target')
				await ctx.conversation.enter("copyTraderListTargetCvers")
				break;
			case 'Limit':
				console.log('用户点击限价单')
				ctx.reply('Limit')
				break;
			case 'CopyTrade':
				console.log('用户点击跟单', ctx.conversation)
				await ctx.conversation.enter("copyTradeCvers")
				break;
			case 'NewCopy':
				console.log('用户点击NewCopy')
				await ctx.editMessageText(translations.en.addTargetTip, {
					parse_mode: "HTML",
					reply_markup: addTradeMenuKeybord()
				})
				break;
			case 'Add':
				console.log('用户点击Add')
				// 存入数据库-并且
				let addParams = {
					add: '',
					target: callBackParams,
					buyAmount: "10%",
					copySell: 1,
					buyGas: "0.0015 SOL",
					sellGas: "0.0015 SOL",
					slippage: "15%",
				}
				let insertData = await addCopyStrategy(ctx.from.id, addParams)
				console.log('insertData===》', insertData)
				// 返回copyList
				await ctx.conversation.enter("copyTradeCvers")
				break;
			case 'Sniper':
				console.log('用户点击狙击')
				ctx.reply('Sniper')
				break;
			case 'Referrals':
				console.log('用户点击推荐')
				ctx.reply('Referrals')
				break;
			case 'Setting':
				console.log('用户点击首页设置')
				ctx.reply('Setting')
				break;
			case 'Withdraw':
				console.log('用户点击提现')
				ctx.reply('Withdraw')
				break;
			case 'Help':
				console.log('用户点击帮助-help弹窗')
				ctx.reply(translations.en.helpText)
				break;
			case 'Refresh':
				console.log('用户点击首页帮助')
				break;
			case 'CopyTradeBack':
				const userExit = await getUserExit(ctx.from)
				if (userExit === false) {
					ctx.reply("serve error!")
					return
				}
				const userBalance = await checkBalance(userExit['pub'])
				const balanceFormat = moneyFormat2(userBalance * 1e-9)
				const startBoxParams = {
					pub: userExit['pub'],
					balance: balanceFormat
				}
				ctx.editMessageText(startBox(startBoxParams),
					{
						parse_mode: 'HTML',
						reply_markup: {
							inline_keyboard:
								startMenu
						},
					}
				)
				break;
			case 'PauseAllCopy':
				// 1. 暂停所有跟单
				await pauseAllStrategy(ctx.from.id)
				// 2. 重新渲染跟单列表
				try {
					console.log('需要修改')
					await ctx.conversation.enter("copyTradeCvers")
				} catch (error) {
					console.log('不需要修改')
				}
				break;
			case 'a_swap':
				console.log('用户点击交易')
				ctx.answerCallbackQuery('a_swap')
				break;
			case 'a_limit':
				console.log('用户点击限价单')
				ctx.answerCallbackQuery('a_limit')
				break;
			case 'solhalf':
				console.log('用户点击买入0.5 sol')
				ctx.answerCallbackQuery('solhalf')
				break;
			case 'solhalf':
				console.log('用户点击买入0.5 sol')
				ctx.answerCallbackQuery('solhalf')
				break;
			case 'sol_1':
				console.log('用户点击买入1 sol')
				ctx.answerCallbackQuery('sol_1')
				break;
			case 'sol_3':
				console.log('用户点击买入3 sol')
				ctx.answerCallbackQuery('sol_3')
				break;
			case 'sol_custom':
				console.log('用户点击自定义数量')
				ctx.answerCallbackQuery('sol_custom')
				break;
			case 'slippage':
				console.log('用户点击滑点')
				ctx.answerCallbackQuery('15% slippage')
				break;
			case 'slippage_custom':
				console.log('用户点击自定义滑点')
				ctx.answerCallbackQuery('x slippage_custom')
				break;

			default:
				// ctx.answerCallbackQuery('default')
				break;
		}
	});
};

const inlineQuery = async (): Promise<void> => {
	bot.on("inline_query", async (ctx) => {
		console.log('inline_query===>', ctx)
		// console.log('callback_query===>', ctx.update.data)
	});
};

export { text, callbackQuery, inlineQuery };
export default text;
