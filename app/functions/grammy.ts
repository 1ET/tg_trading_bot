import { Bot, session, type Context, SessionFlavor, GrammyError, HttpError } from "grammy"
import configs from "@configs/config";
import { limit } from "@grammyjs/ratelimiter";
import { hydrateReply, type ParseModeFlavor } from "@grammyjs/parse-mode";
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
} from "@grammyjs/conversations"
import { greetingCvers, buySwapCvers, copyTradeCvers, copyTraderListCvers, copyTraderListTargetCvers } from "@app/view/conversation"
import { sequentialize } from "@grammyjs/runner";
import { RedisAdapter } from "@grammyjs/storage-redis";
import IORedis from "ioredis";

interface SessionData {
    key: string;
    value: SessionValue;
}
interface SessionValue {
    userName: string;
    pubkey: string;
    priKey: string;
    balance: number;
}
type MyContext = Context & SessionFlavor<SessionData> & ConversationFlavor
type MyConversation = Conversation<MyContext>;
const bot = new Bot<ParseModeFlavor<MyContext>>(configs.telegram.token)

function getSessionKey(ctx: Context) {
    return ctx.chat?.id.toString();
}

function initial(): SessionData {
    return {
        key: "1T", value: {
            userName: '1t',
            pubkey: '11',
            priKey: "22",
            balance: 0
        }
    }
}

const redisInstance = new IORedis({
    port: 6379, // Redis port
    host: "127.0.0.1", // Redis host
    password: "ZUBNSFKSeH1s2VYiBj7ckUppnVAxhtqA54/dCpR2MSKnvnh3ZH6GdAyrPhlHI2EUUKJ3m6tJtcTlkWyt",
});
const storage = new RedisAdapter({ instance: redisInstance, ttl: 10 });
bot.use(
    session({
        storage,
        initial,
    }),
)
bot.use(hydrateReply)
bot.use(limit())
bot.use(conversations())
// bot.use(sequentialize(getSessionKey))
// 对话框
bot.use(createConversation(greetingCvers))
bot.use(createConversation(buySwapCvers))
bot.use(createConversation(copyTradeCvers))
bot.use(createConversation(copyTraderListCvers))
bot.use(createConversation(copyTraderListTargetCvers))

bot.api.setMyCommands([
    { command: "start", description: "Start the bot" },
    { command: "help", description: "Show help text" },
    { command: "settings", description: "Open settings" },
])

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram:", e);
    } else {
        console.error("Unknown error:", e);
    }
})

export { bot, type MyConversation, type MyContext };
export default bot;
