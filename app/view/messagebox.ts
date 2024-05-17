import translations from '@app/routes/translations'

let language: string = ""

function startBox() {
    language = 'English'
    let publicKey = 'GUVkvJbzTpXJM9Bqnk873m2on2VL3zvgtnS8tXYKbEL5'
    let startBoxUI: string = ''
    switch (language) {
        case 'English':
            startBoxUI = `<b>${translations.en.start.welcome}</b>\n <b>${translations.en.start.chain}</b>\n <code>${publicKey}</code> <b>${translations.en.tapToCopy}</b>\n<code>${translations.en.start.balance} 0 Sol ($0.00)</code> \n\n${translations.en.start.tip}\n`
            break;
        case 'Chinese':
            startBoxUI = `<b>${translations.zh.start.welcome}</b>\n <b>${translations.zh.start.chain}</b>\n <code>${publicKey}</code> <b>${translations.zh.tapToCopy}</b>\n<code>${translations.zh.start.balance} 0 Sol ($0.00)</code> \n\n${translations.zh.start.tip}\n`
            break;

        default:
            break;
    }
    return startBoxUI
}

function buyBox() {
    language = 'English'
    let publicKey = 'GUVkvJbzTpXJM9Bqnk873m2on2VL3zvgtnS8tXYKbEL5'
    let startBoxUI: string = ''
    switch (language) {
        case 'English':
            startBoxUI = `<b>${translations.en.buy}</b>\n <b>${translations.en.buy}</b> <code>$CUSHI</code> ${translations.en.icon.market}\n <code>${publicKey}</code> <b>${translations.en.tapToCopy}</b>\n\n${translations.en.start.balance}: <b>0 Sol</b> \n${translations.en.buySwap.renounced}\n ${translations.en.buySwap.wait1}\n ${translations.en.buySwap.wait2}`
            break;
        case 'Chinese':
            startBoxUI = `<b>${translations.zh.buy}</b>\n <b>${translations.zh.buy}</b> <code>$CUSHI</code> ${translations.zh.icon.market}\n <code>${publicKey}</code> <b>${translations.zh.tapToCopy}</b>\n\n${translations.zh.start.balance}: <b>0 Sol</b> \n${translations.zh.buySwap.renounced}\n ${translations.zh.buySwap.wait1}\n ${translations.zh.buySwap.wait2}`
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