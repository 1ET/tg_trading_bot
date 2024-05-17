import { Composer, Context, Scenes, session, Telegraf, Format } from "telegraf";
import translations from '@app/routes/translations'

let language = "English"

const walletConfigurationScene = new Scenes.WizardScene(
    "buy",
    async (ctx: any) => {
        const { chat: { id: chatId }, message_id: messageId } = ctx.update.callback_query.message;
        await ctx.sendMessage(language === "English" ? translations.en.buyCoinTip : translations.zh.buyCoinTip, {
            reply_to_message_id: messageId
        });
        return ctx.wizard.next();
    },

    // async (ctx) => {
    //     const { chat: { id: chatId }, message_id: messageId } = ctx.update.message;

    //     await ctx.sendMessage("Where you'r from?", {
    //         reply_to_message_id: messageId
    //     });

    //     return ctx.wizard.next();
    // },

    async (ctx) => {
        // raydium fin token
        await ctx.reply("See ya!")
        return await ctx.scene.leave();
    },
)

const walletScene = walletConfigurationScene

export default walletScene;