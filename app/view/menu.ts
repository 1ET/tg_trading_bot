import translations from '@app/routes/translations'
import { moneyFormat2, addressFormat14 } from '@app/utils/index'

const language = "English"

const startMenu = [
    [
        { text: language === "English" ? translations.en.startMenu.buy : translations.zh.startMenu.buy, callback_data: 'Buy' },
        { text: language === "English" ? translations.en.startMenu.sell : translations.zh.startMenu.sell, callback_data: 'Sell' },
    ],
    [
        { text: language === "English" ? translations.en.startMenu.position : translations.zh.startMenu.position, callback_data: 'Position' },
        { text: language === "English" ? translations.en.startMenu.copyTrade : translations.zh.startMenu.copyTrade, callback_data: 'CopyTrade' },
        { text: language === "English" ? translations.en.startMenu.sniper : translations.zh.startMenu.sniper, callback_data: 'Sniper' },
    ],
    [
        { text: language === "English" ? translations.en.startMenu.referrals : translations.zh.startMenu.referrals, callback_data: 'Referrals' },
        { text: language === "English" ? translations.en.startMenu.setting : translations.zh.startMenu.setting, callback_data: 'Setting' },
        { text: language === "English" ? translations.en.startMenu.withdraw : translations.zh.startMenu.withdraw, callback_data: 'Withdraw' },
    ],
    [
        { text: language === "English" ? translations.en.startMenu.help : translations.zh.startMenu.help, callback_data: 'Help' },
        { text: language === "English" ? translations.en.startMenu.refresh : translations.zh.startMenu.refresh, callback_data: 'Refresh' },
    ]
]

const buySwapMenu = [
    [
        { text: language === "English" ? translations.en.buySwapMenu.back : translations.zh.buySwapMenu.back, callback_data: 'Back' },
        { text: language === "English" ? translations.en.buySwapMenu.refresh : translations.zh.buySwapMenu.refresh, callback_data: 'Refresh_Swap' },
    ],
    [
        { text: language === "English" ? translations.en.buySwapMenu.swap : translations.zh.buySwapMenu.swap, callback_data: 'a_swap' },
        { text: language === "English" ? translations.en.buySwapMenu.limit : translations.zh.buySwapMenu.limit, callback_data: 'a_limit' },
    ],
    [
        { text: language === "English" ? translations.en.buySwapMenu.solhalf : translations.zh.buySwapMenu.solhalf, callback_data: '/solhalf' },
        { text: language === "English" ? translations.en.buySwapMenu.sol_1 : translations.zh.buySwapMenu.sol_1, callback_data: '/sol_1' },
        { text: language === "English" ? translations.en.buySwapMenu.sol_3 : translations.zh.buySwapMenu.sol_3, callback_data: '/sol_3' },
    ],
    [
        // { text: language === "English" ? translations.en.buySwapMenu.sol_5 : translations.zh.buySwapMenu.sol_5, callback_data: '/sol_5' },
        // { text: language === "English" ? translations.en.buySwapMenu.sol_10 : translations.zh.buySwapMenu.sol_10, callback_data: '/sol_10' },
        { text: language === "English" ? translations.en.buySwapMenu.sol_custom : translations.zh.buySwapMenu.sol_custom, callback_data: '/sol_custom' },
    ],
    [
        { text: language === "English" ? translations.en.buySwapMenu.slippage : translations.zh.buySwapMenu.slippage, callback_data: '/slippage' },
        { text: language === "English" ? translations.en.buySwapMenu.slippage_custom : translations.zh.buySwapMenu.slippage_custom, callback_data: '/slippage_custom' },
    ]
]

const copyTradLevel1 = () => {
    return [
        [
            { text: language === "English" ? translations.en.copyTrade.new : translations.zh.copyTrade.new, callback_data: 'NewCopy' },
        ],
        [
            { text: language === "English" ? translations.en.copyTrade.pauseAll : translations.zh.copyTrade.pauseAll, callback_data: 'PauseAllCopy' },
        ],
        [
            { text: language === "English" ? translations.en.copyTrade.back : translations.zh.copyTrade.back, callback_data: 'CopyTradeBack' },
        ],
    ]
}

const addTradeMenu = (tradeSetting) => {
    return [
        // [
        //     { text: language === "English" ? translations.en.newCopyTrade.tag : translations.zh.newCopyTrade.tag, callback_data: 'NewCopy' },
        // ],
        [
            { text: (language === "English" ? translations.en.newCopyTrade.target : translations.zh.newCopyTrade.target) + `: ${addressFormat14(tradeSetting.target)}`, callback_data: 'Target' },
        ],
        [
            { text: (language === "English" ? translations.en.newCopyTrade.buyAmount : translations.zh.newCopyTrade.buyAmount) + `: ${tradeSetting.buyAmount}`, callback_data: 'BuyAmount' },
            { text: (language === "English" ? translations.en.newCopyTrade.copySell : translations.zh.newCopyTrade.copySell) + `: ${tradeSetting.copySell ? "✅ Yes" : "❌ No"}`, callback_data: 'CopySell' },
        ],
        [
            { text: (language === "English" ? translations.en.newCopyTrade.buyGas : translations.zh.newCopyTrade.buyGas) + `: ${tradeSetting.buyGas}`, callback_data: 'BuyGas' },
            { text: (language === "English" ? translations.en.newCopyTrade.sellGas : translations.zh.newCopyTrade.sellGas) + `: ${tradeSetting.sellGas}`, callback_data: 'SellGas' },
        ],
        [
            { text: (language === "English" ? translations.en.newCopyTrade.slippage : translations.zh.newCopyTrade.slippage) + `: ${tradeSetting.slippage}`, callback_data: 'Slippage' },
        ],
        [
            { text: language === "English" ? translations.en.newCopyTrade.add : translations.zh.newCopyTrade.add, callback_data: 'Add' + tradeSetting.add },
        ],
        [
            { text: language === "English" ? translations.en.newCopyTrade.back : translations.zh.newCopyTrade.back, callback_data: 'Back' },
        ],
    ]
}


export {
    startMenu,
    buySwapMenu,
    copyTradLevel1,
    addTradeMenu
}