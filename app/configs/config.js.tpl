module.exports = {
	// Server
	"server": {
		"port": 3031,
	},

	"telegram": { // from @botfather on telegram
		username: "Solana1T_bot",
		token: "6842799885:AAHIL8A8Z6Jayw-V1i0KDAXb0eQ0kF0ApNc",
	},

	mode: "poll", // or webhook
	webhook: {
		url: "https://sample.host.com:8443",
		port: 8443,
		certsPath: "certs",
		selfSigned: true
	},

	"databases": { users: "databases/users.json" },

	// Debug
	"debug": true,

	// LOGS
	"log": {
		"path": {
			"debug_log": "./logs/debug.log",
			"error_log": "./logs/errors.log"
		},
		"language": "en", // set language of log type, NOTE: please help with translations! (optional, default en - values: en|it|pl)
		"colors": "enabled",  // enable/disable colors in terminal (optional, default enabled - values: true|enabled or false|disabled)
		"debug": "enabled",   // enable/disable all logs with method debug (optional, default enabled - values: true|enabled or false|disabled)
		"info": "enabled",    // enable/disable all logs with method info (optional, default enabled - values: true|enabled or false|disabled)
		"warning": "enabled", // enable/disable all logs with method warning (optional, default enabled -  values: true|enabled or false|disabled)
		"error": "enabled",   // enable/disable all logs with method errors (optional, default enabled - values: true|enabled or false|disabled)
		"sponsor": "enabled", // enable/disable all logs with method sponsor (optional, default enabled - values: true|enabled or false|disabled)
		"write": "enabled",   // write the logs into a file, you need set path values (optional, default disabled - values: true|enabled or false|disabled)
		"type": "log"   // format of logs in files (optional, default log - values: log|json)
	}
};
