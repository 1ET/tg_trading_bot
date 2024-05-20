import { Composer, Context, Scenes, session, Telegraf, Format } from "telegraf";
import translations from '@app/routes/translations'
import { buyBox } from '@app/view/messagebox'
import { buySwapMenu } from '@app/view/menu'

let language = "English"

const walletConfigurationScene = new Scenes.WizardScene(
    "buy",
    async (ctx: any) => {
        const { chat: { id: chatId }, message_id: messageId } = ctx.update.callback_query.message;
        await ctx.sendMessage(language === "English" ? translations.en.buyCoinTip : translations.zh.buyCoinTip, {
            reply_to_message_id: messageId
        });
        // return ctx.wizard.next();
        return await ctx.scene.leave();
    },

    // async (ctx) => {
    //     // raydium fin token
    //     await ctx.telegram.sendMessage(ctx.message.chat.id,
    //         buyBox(),
    //         {
    //             parse_mode: 'HTML',
    //             reply_markup: {
    //                 inline_keyboard:
    //                     buySwapMenu
    //             },
    //         })
    //     return await ctx.scene.leave();
    // },
)

const walletScene = walletConfigurationScene

export default walletScene;