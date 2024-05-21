import bot from "@app/functions/grammy";
import * as databases from "@app/functions/databases";
import config from "@configs/config";
import { launchPolling, launchWebhook } from "./launcher";
import { redis_client } from '@app/database/redis'
import { startMenu } from '@app/view/menu'
import { startBox } from '@app/view/messagebox'
import { getUserExit } from '@app/database/api/api'
import { checkBalance } from '@app/raydium/index'
import { moneyFormat2 } from '@app/utils/index'
let userSetting = {
	language: "English"
}

const quit = async (): Promise<void> => {
	bot.command("quit", (ctx) => {
		// ctx.telegram.leaveChat(ctx.message.chat.id);
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
	bot.command('start', async ctx => {
		console.log('start===>')
		if (ctx.from) {
			// 1. 查询数据库是否存在数据
			// 有数据
			const userExit = await getUserExit(ctx.from)
			if (userExit === false) {
				ctx.reply("serve error!")
				return
			}
			const userBalance = await checkBalance(userExit['pub'])
			const balanceFormat = moneyFormat2(userBalance * 1e-9)
			ctx.session.userInfo.key = userExit.id
			ctx.session.userInfo.value = {
				userName: userExit['userName'],
				pubkey: userExit['pub'],
				priKey: userExit['pri'],
				balance: balanceFormat
			}
			console.log(ctx.session)
			//  . 将策略和公钥写入session
			const startBoxParams = {
				pub: userExit['pub'],
				balance: balanceFormat
			}
			ctx.reply(startBox(startBoxParams),
				{
					parse_mode: 'HTML',
					reply_markup: {
						inline_keyboard:
							startMenu
					},
				}
			)
		} else {
			ctx.reply("serve error!")
		}
	})
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
		console.log('启动成功')
	}
};

export { launch, quit, start, userSetting };
export default launch;
