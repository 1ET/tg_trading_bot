import translations from '@app/routes/translations'


let language: string = ""

function startBox(boxParams) {
    language = 'English'
    let publicKey = boxParams.pub
    let balance = boxParams.balance
    let startBoxUI: string = ''
    switch (language) {
        case 'English':
            startBoxUI = `<b>${translations.en.start.welcome}</b>\n <b>${translations.en.start.chain}</b>\n <code>${publicKey}</code> <b>${translations.en.tapToCopy}</b>\n<code>${balance} Sol ($0.00)</code> \n\n${translations.en.start.tip}\n`
            break;
        case 'Chinese':
            startBoxUI = `<b>${translations.zh.start.welcome}</b>\n <b>${translations.zh.start.chain}</b>\n <code>${publicKey}</code> <b>${translations.zh.tapToCopy}</b>\n<code>${balance} Sol ($0.00)</code> \n\n${translations.zh.start.tip}\n`
            break;

        default:
            break;
    }
    return startBoxUI
}

function buyBox(tokenInfo: any, userInfo: any) {
    language = 'English'
    let startBoxUI: string = ''
    switch (language) {
        case 'English':
            startBoxUI = `<b>${translations.en.buy}</b> <code>${tokenInfo.baseToken.symbol}</code> ${translations.en.icon.market}\n <code>${tokenInfo.baseToken.address}</code> <b>${translations.en.tapToCopy}</b>\n\n${translations.en.start.balance}: <b>${userInfo.balance} SOL</b> \n${translations.en.buySwap.renounced}\n ${translations.en.buySwap.price}: <b>$${tokenInfo.priceUsd}</b> — ${translations.en.buySwap.liq}: <b>$${tokenInfo.liquidity.usd}</b> — ${translations.en.buySwap.mc}: <b>$${tokenInfo.fdv}</b> \n ${translations.en.buySwap.time1h}: <b>$${tokenInfo.priceChange.h1}%</b> — ${translations.en.buySwap.time24h}: <b>$${tokenInfo.priceChange.h24}%</b>`
            break;
        case 'Chinese':
            startBoxUI = `<b>${translations.zh.buy}</b> <code>${tokenInfo.baseToken.symbol}</code> ${translations.zh.icon.market}\n <code>${tokenInfo.baseToken.address}</code> <b>${translations.zh.tapToCopy}</b>\n\n${translations.zh.start.balance}: <b>${userInfo.balance} SOL</b> \n${translations.zh.buySwap.renounced}\n ${translations.zh.buySwap.price}: <b>$${tokenInfo.priceUsd}</b> — ${translations.zh.buySwap.liq}: <b>$${tokenInfo.liquidity.usd}</b> — ${translations.zh.buySwap.mc}: <b>$${tokenInfo.fdv}</b> \n ${translations.en.buySwap.time1h}: <b>$${tokenInfo.priceChange.h1}%</b> — ${translations.en.buySwap.time24h}: <b>$${tokenInfo.priceChange.h24}%</b>`
            break;
        default:
            break;
    }
    return startBoxUI
}

export {
    startBox,
    buyBox
}