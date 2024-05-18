/**
 * Telegraf Commands
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import bot from "@app/functions/telegraf";
import * as databases from "@app/functions/databases";
import config from "@configs/config";
import { launchPolling, launchWebhook } from "./launcher";
import { redis_client } from '@app/database/redis'
import { startMenu } from '@app/view/menu'
import { startBox } from '@app/view/messagebox'

let userSetting = {
	language: "English"
}
/**
 * command: /quit
 * =====================
 * If user exit from bot
 *
 */
const quit = async (): Promise<void> => {
	bot.command("quit", (ctx) => {
		ctx.telegram.leaveChat(ctx.message.chat.id);
		ctx.leaveChat();
	});
};

/**
 * command: /start
 * =====================
 * Send welcome message
 *
 */
const start = async (): Promise<void> => {
	bot.start((ctx) => {
		// await redis_client.hSet('key', 'field', 'value');
		// await redis_client.hGetAll('key');
		// redis_client.get(ctx.message.chat.id.toString())
		console.log('start===>', ctx.message.from.id)
		ctx.telegram.sendMessage(ctx.message.chat.id,
			startBox(),
			{
				parse_mode: 'HTML',
				reply_markup: {
					inline_keyboard:
						startMenu
				},
			});
	});
};

/**
 * Run bot
 * =====================
 * Send welcome message
 *
 */
const launch = async (): Promise<void> => {
	const mode = config.mode;
	if (mode === "webhook") {
		launchWebhook();
	} else {
		launchPolling();
	}
};

export { launch, quit, start, userSetting };
export default launch;
