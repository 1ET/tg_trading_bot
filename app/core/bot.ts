import * as command from "@app/functions/commands";
import * as hears from "@app/functions/hears";
import { initCrypto } from "@app/crypto/index"
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
	// await rediseInit();
	// await initCrypto()
	await command.quit();
	await command.start();
	// await hears.text();
	await hears.inlineQuery();
	await hears.callbackQuery();
	await command.launch();
})();
