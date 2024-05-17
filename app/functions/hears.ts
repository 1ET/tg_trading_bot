/**
 * Telegraf Hears
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import bot from "@app/functions/telegraf";
import { userSetting } from '@app/functions/commands'
import { setLanguage } from '@app/functions/ui'
import { buyCoin } from '@app/functions/swap'
import * as Telegram from "@telegraf/types";

/**
 * hears: any taxt
 * =====================
 * Listen any text user write
 *
 */
const text = async (): Promise<void> => {
	// bot.on("text", (ctx) => {
	// 	const Hi: string = "hi"
	// 	console.log('ctx.message.chat.id===》', ctx.message.chat.id)
	// 	if (ctx.update.message.text === Hi) {
	// 		ctx.telegram.sendMessage(ctx.message.chat.id, "Hello dear user")
	// 	} else {
	// 		ctx.telegram.sendMessage(ctx.message.chat.id, `Your text --> ${ctx.update.message.text}`)
	// 	}
	// });
};

const callbackQuery = async (): Promise<void> => {
	bot.on("callback_query", async (ctx: any) => {
		console.log('Event', ctx.callbackQuery.data)
		switch (ctx.callbackQuery.data) {
			case 'Chinese':
				userSetting.language = "Chinaese"
				setLanguage(ctx)
				ctx.answerCbQuery(ctx.callbackQuery.data)
				break;
			case 'English':
				userSetting.language = "English"
				setLanguage(ctx)
				ctx.answerCbQuery(ctx.callbackQuery.data)
				break;
			case 'Buy':
				console.log('用户点击购买')
				buyCoin(ctx)
				ctx.answerCbQuery('buy')
				break;
			case 'Sell':
				console.log('用户点击出售123')
				ctx.answerCbQuery('sell')
				break;
			case 'Position':
				console.log('用户点击仓位')
				ctx.answerCbQuery('sell')
				break;
			case 'Limit':
				console.log('用户点击限价单')
				ctx.answerCbQuery('Limit')
				break;
			case 'Sniper':
				console.log('用户点击狙击')
				ctx.answerCbQuery('Sniper')
				break;
			case 'Referrals':
				console.log('用户点击推荐')
				ctx.answerCbQuery('Referrals')
				break;
			case 'Setting':
				console.log('用户点击首页设置')
				ctx.answerCbQuery('Setting')
				break;
			case 'Withdraw':
				console.log('用户点击提现')
				ctx.answerCbQuery('Withdraw')
				break;
			case 'Help':
				console.log('用户点击帮助')
				ctx.answerCbQuery('Help')
				break;
			case 'Refresh':
				console.log('用户点击首页帮助')
				ctx.answerCbQuery('Refresh')
				break;
			case 'refresh_swap':
				console.log('用户点击refresh_swap')
				ctx.answerCbQuery('refresh_swap')
				break;
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
