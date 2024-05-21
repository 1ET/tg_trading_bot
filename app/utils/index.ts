function moneyFormat2(money) {
    money += ''
    //没有小数补齐这个0
    if (money.indexOf(".") == "-1") {
        money = money + ".00";
    } else {
        //有小数截取前二位小数
        money = money.substring(0, money.indexOf(".") + 3);
    }
    return money
}

function addressFormat14(address: string) {
    let frontStr = address.slice(0, 7)
    let back = address.slice(address.length - 7)
    return frontStr + "..." + back
}

export {
    moneyFormat2,
    addressFormat14
}