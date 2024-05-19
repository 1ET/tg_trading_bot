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

export {
    moneyFormat2
}