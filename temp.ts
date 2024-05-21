import { Bot, Context, session } from "grammy";
import {
    type Conversation,
    type ConversationFlavor,
    conversations,
    createConversation,
} from "@grammyjs/conversations";

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

const bot = new Bot<MyContext>("6842799885:AAHIL8A8Z6Jayw-V1i0KDAXb0eQ0kF0ApNc");

bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

/** 定义对话 */
async function greeting(conversation: MyConversation, ctx: MyContext) {
    do {
        await ctx.reply("发给我一张照片！");
        ctx = await conversation.wait();

        if (ctx.message?.text === "/cancel") {
            await ctx.reply("呜呜，被取消了，我走了！");
            return;
        }
    } while (!ctx.message?.photo);
}

bot.use(createConversation(greeting));

bot.command("start", async (ctx) => {
    // 进入你声明的 “greeting” 函数
    await ctx.conversation.enter("greeting");
});




bot.start();