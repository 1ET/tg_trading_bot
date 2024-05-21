import bot from "@app/functions/grammy";
import { userSetting } from '@app/functions/commands'
import { setLanguage } from '@app/functions/ui'
// import { buyCoin } from '@app/functions/swap'
import * as Telegram from "@telegraf/types";
import { bold, fmt, hydrateReply, italic, link } from "@grammyjs/parse-mode";
import { startMenu, buySwapMenu } from '@app/view/menu'
import { startBox } from '@app/view/messagebox'
import { checkTokenInfo } from "@app/raydium/index"
import { buyBox } from '@app/view/messagebox'
import { moneyFormat2 } from '@app/utils/index'

const text = async (): Promise<void> => {
	bot.on("message", async (ctx) => {
		ctx.replyFmt(fmt`${bold(ctx.update.message.text ?? 'noText')}`)
	});
};

const callbackQuery = async (): Promise<void> => {
	bot.on("callback_query:data", async (ctx: any) => {
		console.log('Event_02', ctx.callbackQuery.data)
		switch (ctx.callbackQuery.data) {
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
					ctx.session = 9
					ctx.reply('sell')
				} catch (error) {
					console.log('用户点击Sell失败', error)
				}
				break;
			case 'Position':
				try {
					console.log('用户点击仓位', ctx)
					ctx.reply('Position')
				} catch (error) {
					console.log('用户点击仓位失败', error)
				}

				break;
			case 'Limit':
				console.log('用户点击限价单')
				ctx.reply('Limit')
				break;
			case 'CopyTrade':
				console.log('用户点击跟单')
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
				await ctx.conversation.enter("greetingCvers")
				// ctx.reply('Help')
				break;
			case 'Refresh':
				console.log('用户点击首页帮助')
				ctx.reply('Refresh')
				break;
			// case 'Back':
			// 	console.log('hears_Back')
			// 	const startBoxParams = {
			// 		pub: ctx.session.value.pubkey,
			// 		balance: moneyFormat2(ctx.session.value.balance * 1e-9)
			// 	}
			// 	await ctx.deleteMessages([ctx.callbackQuery.message.message_id])
			// 	await ctx.reply(startBox(startBoxParams), {
			// 		parse_mode: "HTML",
			// 		reply_markup: {
			// 			inline_keyboard:
			// 				startMenu
			// 		}
			// 	})
			// 	break;
			case 'a_swap':
				console.log('用户点击交易')
				ctx.answerCbQuery('a_swap')
				break;
			case 'a_limit':
				console.log('用户点击限价单')
				ctx.answerCbQuery('a_limit')
				break;
			case 'solhalf':
				console.log('用户点击买入0.5 sol')
				ctx.answerCbQuery('solhalf')
				break;
			case 'solhalf':
				console.log('用户点击买入0.5 sol')
				ctx.answerCbQuery('solhalf')
				break;
			case 'sol_1':
				console.log('用户点击买入1 sol')
				ctx.answerCbQuery('sol_1')
				break;
			case 'sol_3':
				console.log('用户点击买入3 sol')
				ctx.answerCbQuery('sol_3')
				break;
			case 'sol_custom':
				console.log('用户点击自定义数量')
				ctx.answerCbQuery('sol_custom')
				break;
			case 'slippage':
				console.log('用户点击滑点')
				ctx.answerCbQuery('15% slippage')
				break;
			case 'slippage_custom':
				console.log('用户点击自定义滑点')
				ctx.answerCbQuery('x slippage_custom')
				break;

			default:
				ctx.answerCbQuery('default')
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
