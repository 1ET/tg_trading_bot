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

/**
 * hears: any taxt
 * =====================
 * Listen any text user write
 *
 */
const text = async (): Promise<void> => {
	bot.on("text", (ctx) => {
		const Hi: string = "hi"
		if (ctx.update.message.text === Hi) {
			ctx.telegram.sendMessage(ctx.message.chat.id, "Hello dear user")
		} else {
			ctx.telegram.sendMessage(ctx.message.chat.id, `Your text --> ${ctx.update.message.text}`)
		}
	});
};

const callbackQuery = async (): Promise<void> => {
	bot.on("callback_query", async (ctx) => {
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
