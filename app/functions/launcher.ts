import bot from "./grammy";

import config from "@configs/config";
import fs from "fs";
import localtunnel from "localtunnel";
import { run } from "@grammyjs/runner";


const launchPolling = (): void => {
	let runner = run(bot)
	const stopRunner = () => {
		console.log('launchPolling===>退出')
		runner.isRunning() && runner.stop()
	}
	process.once("SIGINT", stopRunner)
	process.once("SIGTERM", stopRunner)
};

const launchSelfSigned = async (webhookUrl: string, secretPath: string) => {
	const { port } = config.webhook;
	const path = `${process.cwd()}/certs`;
	const cert = fs.readFileSync(`${path}/PUBLIC.pem`);
	const pk = fs.readFileSync(`${path}/PK.key`);
	const tlsOptions = {
		key: pk,
		cert: cert,
	};
	// await bot.launch({
	// 	webhook: {
	// 		tlsOptions,
	// 		hookPath: secretPath,
	// 		port: port,
	// 	},
	// });
	// bot.telegram.setWebhook(`${webhookUrl}${secretPath}`, {
	// 	certificate: {
	// 		source: cert,
	// 	},
	// });
};

// const launchLocalTunnel = async (secretPath: string, port: number) => {
// 	const tunnel = await localtunnel({ port });
// 	bot.launch({
// 		webhook: {
// 			domain: tunnel.url,
// 			hookPath: secretPath,
// 			port: port,
// 		},
// 	});
// };

// const launchWebhook = async (): Promise<void> => {
// 	const { port, url, selfSigned } = config.webhook;
// 	const secretPath = `/telegraf/${bot.secretPathComponent()}`;

// 	// Set telegram webhook
// 	// this runs localtunnel to develop the bot on localhost
// 	// acts as a reverse proxy for telegrm calls to our websocket
// 	const webhookUrl = url;
// 	if (config.debug) {
// 		return launchLocalTunnel(secretPath, port);
// 	} else if (selfSigned) {
// 		return launchSelfSigned(webhookUrl, secretPath);
// 	} else {
// 		return bot.launch({
// 			webhook: {
// 				domain: webhookUrl,
// 				hookPath: secretPath,
// 				port: port,
// 			},
// 		});
// 	}
// };

const launchWebhook = () => { }

export { launchPolling, launchWebhook };
