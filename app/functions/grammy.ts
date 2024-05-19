/**
 * Telegraf
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
import { Telegraf, Scenes } from "telegraf";
import { Bot, session, Context, SessionFlavor } from "grammy"
import configs from "@configs/config";
import stages from "@app/scenes/stage"
// import { mysqlInstance } from "@app/database/mysql"
import { mysqlAdapter } from "@app/database/mysqlAdapter/mysqlAdapter"
import { limit } from "@grammyjs/ratelimiter";
import { freeStorage } from "@grammyjs/storage-free";
import { RedisAdapter } from '@grammyjs/storage-redis';

interface SessionData {
    key: string;
    value: string;
}
type MyContext = Context & SessionFlavor<SessionData>
const bot = new Bot<MyContext>(configs.telegram.token)

function initial(): SessionData {
    return { key: "test", value: "testValue" };
}

async function init() {
    bot.use(session({
        initial,
        // storage: freeStorage<SessionData>(configs.telegram.token)
    }))
}
init()
// bot.use(session({
//     initial,
//     storage: freeStorage<SessionData>(configs.telegram.token)
// }))

bot.use(limit())
bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help text" },
    { command: "settings", description: "Open settings" },
])

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    console.log(`Some error was catch: `, e);
});


export { bot, Scenes };
export default bot;
