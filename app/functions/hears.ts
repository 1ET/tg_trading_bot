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
			case 'buy':
				console.log('用户点击购买')
				buyCoin(ctx)
				ctx.answerCbQuery('buy')
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
