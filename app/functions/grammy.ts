import { Bot, session, type Context, SessionFlavor } from "grammy"
import configs from "@configs/config";
// import stages from "@app/scenes/stage"
// import { mysqlInstance } from "@app/database/mysql"
import { mysqlAdapter } from "@app/database/mysqlAdapter/mysqlAdapter"
import { limit } from "@grammyjs/ratelimiter";
import { freeStorage } from "@grammyjs/storage-free";
import { RedisAdapter } from '@grammyjs/storage-redis';
import { hydrateReply, type ParseModeFlavor } from "@grammyjs/parse-mode";
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
} from "@grammyjs/conversations"
import { greetingCvers, buySwapCvers, copyTradeCvers } from "@app/view/conversation"

interface SessionValue {
    userName: string;
    pubkey: string;
    priKey: string;
    balance: number;
}

interface SessionData {
    key: string;
    value: SessionValue;
}
type MyContext = Context & SessionFlavor<SessionData> & ConversationFlavor
type MyConversation = Conversation<MyContext>;
const bot = new Bot<ParseModeFlavor<MyContext>>(configs.telegram.token)

function initial(): SessionData {
    return {
        key: "1T", value: {
            userName: '1t',
            pubkey: '11',
            priKey: "22",
            balance: 0
        }
    };
}

// async function init() {
// bot.use(session({
//     initial,
//     storage: freeStorage<SessionData>(configs.telegram.token)
// }))
// bot.use(session())
// }
// init()
bot.use(session({ initial }))
bot.use(hydrateReply)
bot.use(limit())
bot.use(conversations())
// 对话框
bot.use(createConversation(greetingCvers))
bot.use(createConversation(buySwapCvers))
bot.use(createConversation(copyTradeCvers))

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
})

export { bot, type MyConversation, type MyContext };
export default bot;
