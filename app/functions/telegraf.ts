/**
 * Telegraf
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import { Telegraf, Scenes, Context, session } from "telegraf";
import configs from "@configs/config";
import stages from "@app/scenes/stage"
import { MySQL } from "@app/database/mysql"


const bot = new Telegraf(configs.telegram.token);

bot.use(session())
// bot.use(session({
//     store: MySQL(), getSessionKey: (ctx) => (
//         ctx.callbackQuery && ctx.callbackQuery.inline_message_id) ||
//         (ctx.from && ctx.chat && `${ctx.from.id}:${ctx.chat.id}`),
// }))
// bot.use(session({ defaultSession: () => ({ yourProp: 'hello' }) }));
bot.use(stages.middleware())

export { bot, Scenes };
export default bot;
