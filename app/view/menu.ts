import translations from '@app/routes/translations'

const language = "English"

const startMenu = [
    [
        { text: language === "English" ? translations.en.startMenu.buy : translations.zh.startMenu.buy, callback_data: 'buy' },
        { text: language === "English" ? translations.en.startMenu.sell : translations.zh.startMenu.sell, callback_data: 'sell' },
    ],
    [
        { text: language === "English" ? translations.en.startMenu.position : translations.zh.startMenu.position, callback_data: 'position' },
        { text: language === "English" ? translations.en.startMenu.limit : translations.zh.startMenu.limit, callback_data: 'limit' },
        { text: language === "English" ? translations.en.startMenu.sniper : translations.zh.startMenu.sniper, callback_data: 'sniper' },
    ],
    [
        { text: language === "English" ? translations.en.startMenu.referrals : translations.zh.startMenu.referrals, callback_data: '/referrals' },
        { text: language === "English" ? translations.en.startMenu.setting : translations.zh.startMenu.setting, callback_data: '/setting' },
        { text: language === "English" ? translations.en.startMenu.withdraw : translations.zh.startMenu.withdraw, callback_data: '/Withdraw' },
    ],
    [
        { text: language === "English" ? translations.en.startMenu.help : translations.zh.startMenu.help, callback_data: '/help' },
        { text: language === "English" ? translations.en.startMenu.refresh : translations.zh.startMenu.refresh, callback_data: '/refresh' },
    ]
]

export {
    startMenu
}