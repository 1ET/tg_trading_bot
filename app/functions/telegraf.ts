/**
 * Telegraf
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import { Telegraf, Scenes, session, Context } from "telegraf";
import configs from "@configs/config";
import stages from "@app/scenes/stage"

const bot = new Telegraf(configs.telegram.token);

bot.use(session())
bot.use(stages.middleware())

export { bot, Scenes };
export default bot;
