import { Bot, session, Context, SessionFlavor } from "grammy"
import configs from "@configs/config";
// import stages from "@app/scenes/stage"
// import { mysqlInstance } from "@app/database/mysql"
import { mysqlAdapter } from "@app/database/mysqlAdapter/mysqlAdapter"
import { limit } from "@grammyjs/ratelimiter";
import { freeStorage } from "@grammyjs/storage-free";
import { RedisAdapter } from '@grammyjs/storage-redis';
import { hydrateReply } from "@grammyjs/parse-mode";
import type { ParseModeFlavor } from "@grammyjs/parse-mode";
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
} from "@grammyjs/conversations"

interface SessionData {
    key: string;
    value: unknown;
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

async function init() {
    bot.use(session({
        initial,
        // storage: freeStorage<SessionData>(configs.telegram.token)
    }))
}
init()
bot.use(hydrateReply)
bot.use(limit())
bot.use(conversations())
bot.use(createConversation(greeting))

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

async function greeting(conversation: MyConversation, ctx: MyContext) {
    await ctx.reply("Hi there! What is your name?");
    const { message } = await conversation.wait();
    await ctx.reply(`Welcome to the chat, ${message?.text}!`);
}

export { bot };
export default bot;
