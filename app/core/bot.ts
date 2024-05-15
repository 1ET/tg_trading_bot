import * as command from "@app/functions/commands";
import * as hears from "@app/functions/hears";
import { rediseInit } from '@app/database/redis'

/**
 * Start bot
 * =====================
 *
 * @contributors: Patryk Rzucidło [@ptkdev] <support@ptkdev.io> (https://ptk.dev)
 *
 * @license: MIT License
 *
 */
(async () => {
	await rediseInit();
	await command.quit();
	await command.start();
	await command.sendPhoto();
	await hears.text();
	await hears.inlineQuery();
	await hears.callbackQuery();
	await command.launch();
})();
