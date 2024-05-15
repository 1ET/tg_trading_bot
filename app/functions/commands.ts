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

const menu = [
	[
		{ text: '🇬🇧 ENGLISH', callback_data: 'English' },
		{ text: '🇨🇳 CHINESE', callback_data: 'Chinese' },
	],
	[
		{ text: '⚽ NEOEVM', callback_data: 'neoevm' },
		{ text: '⚾ Ethereum', callback_data: 'goerli' },
	],
	[
		{ text: '✋ Import Wallet', callback_data: '/privatekey' },
		{ text: '🆕 Generate Wallet', callback_data: '/generatewallet' },
		{ text: '🔎 Check Wallet', callback_data: '/check' },
	],
	[
		{ text: 'Wallet 1⃣️', callback_data: '/wallet1' },
		{ text: 'Wallet 2⃣️', callback_data: '/wallet2' },
		{ text: 'Wallet 3⃣️', callback_data: '/wallet3' },
	],

	[
		{ text: '⚠️ Check Token Contract', callback_data: '/tokensecurity' },
		{ text: '⚠️ Check Deployment Contract', callback_data: '/addresssecurity' },
	],

	[{ text: '💗 Referral Program', callback_data: '/Referral' }],
	[{ text: '🔥 Look Gems', url: 't.me/respect_gems_bot?start' }],
];
const menuC = [
	[
		{ text: '🇬🇧 英语', callback_data: 'English' },
		{ text: '🇨🇳 中文', callback_data: 'Chinese' },
	],
	[
		{ text: '⚽ neo链', callback_data: 'neoevm' },
		{ text: '⚾ 以太链', callback_data: 'goerli' },
	],
	[
		{ text: '✋ 导入钱包', callback_data: '/privatekey' },
		{ text: '🆕 生成钱包', callback_data: '/generatewallet' },
		{ text: '🔎 查看钱包', callback_data: '/check' },
	],
	[
		{ text: '钱包 1⃣️', callback_data: '/wallet1' },
		{ text: '钱包 2⃣️', callback_data: '/wallet2' },
		{ text: '钱包 3⃣️', callback_data: '/wallet3' },
	],

	[
		{ text: '⚠️ 检测合约', callback_data: '/tokensecurity' },
		{ text: '⚠️ 检测部署钱包', callback_data: '/addresssecurity' },
	],

	[{ text: '💗 推广链接', callback_data: '/Referral' }],
	[{ text: '🔥 查看Gems', url: 't.me/respect_gems_bot?start' }],
];
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
 * command: /photo
 * =====================
 * Send photo from picsum to chat
 *
 */
const sendPhoto = async (): Promise<void> => {
	bot.command("photo", (ctx) => {
		ctx.replyWithPhoto("https://picsum.photos/200/300/");
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
		// redis_client.get(ctx.message.chat.id.toString())
		ctx.telegram.sendMessage(ctx.message.chat.id,
			userSetting.language === 'English'
				? `Welcome to the RΞSPECT Bot! 😄\n🤖Customize your meme trades with our bot! \n🚀Whether it's a bullish run or a bearish slide📉\n<b>💥You'll catch it!</b> \n🤔️No need to constantly watch the market's ups and downs. \n💼Let us handle it for you!\n\nJust follow me:\nStep 1: Network Selection(Default Mainnet)\nStep 2: click Import Wallet or Generate Wallet\nStep 3: choose a Wallet to operate\n`
				: `欢迎来到 RΞSPECT Bot！ 😄\n🤖我们的目标是帮住你定制meme交易并严格执行！\n🚀无论是看涨还是看跌📉\n<b>💥您都能抓住它！</b>\n🤔️无需持续关注市场的涨跌。\n💼让我们来替您处理！\n\n只需跟随以下步骤：\n第一步：网络选择（默认neoevm）\n第二步：点击导入钱包或生成钱包\n第三步：选择要操作的钱包\n`,
			{
				parse_mode: 'HTML',
				reply_markup: {
					inline_keyboard:
						userSetting.language === 'English' ? menu : menuC,
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

export { launch, quit, sendPhoto, start, userSetting };
export default launch;
