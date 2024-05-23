import { mysqlInstance } from "@app/database/mysql"
import { encrypted } from "@app/crypto/index"
import { generateWallet } from "@app/raydium/helpers/wallet"
import { moneyFormat2 } from "@app/utils/index"

async function getUserExit(userInfo) {
    let querySql = `SELECT  * FROM user WHERE  id = '${userInfo.id}';`
    const results = await mysqlInstance.query(querySql)
    console.log('getUserExit==>', results)
    if (results[0][0]) {
        //  用户存在, 返回查询的数据
        return results[0][0]
    } else {
        //  用户不存在, 初始化数据, 生成钱包
        const newPair = generateWallet()
        const pri = newPair.priKey
        // const pri = encrypted(newPair.priKey)
        let userInitInfo = {
            id: userInfo.id,
            userName: userInfo.username,
            language_code: userInfo.language_code,
            pub: newPair.publicKey,
            pri,
            referrals: null,
        }
        let sqlStr = `INSERT IGNORE INTO user (id, userName, language_code, pub, pri, referrals) VALUES (${userInitInfo.id}, '${userInitInfo.userName}', '${userInitInfo.language_code}', '${userInitInfo.pub}', '${userInitInfo.pri}', 123);`
        const results = await mysqlInstance.query(sqlStr)
        console.log('插入')
        if (!results[0]['fieldCount']) {
            return userInitInfo
        } else {
            return false
        }
    }
}

async function getPoolKeys(baseMint: string, quoteMint: string = "So11111111111111111111111111111111111111112") {
    let querySql = `SELECT * FROM raydium_pool WHERE baseMint = '${baseMint}' AND quoteMint = '${quoteMint}' LIMIT 5 OFFSET 0`
    const results = await mysqlInstance.query(querySql)
    console.log(results[0][0], '__results__')
    if (results[0][0]) {
        //  存在, 返回查询的数据
        return results[0][0]
    } else {
        //  不存在,返回 空数组
        return false
    }

}

async function getCopyStrategy(userID: string) {
    let querySql = `SELECT * FROM strategy_copy WHERE userId = "${userID}"`
    const results = await mysqlInstance.query(querySql)
    if (results[0][0]) {
        //  存在, 返回查询的数据
        return results[0]
    } else {
        //  不存在,返回 空数组
        return []
    }
}

async function addCopyStrategy(userID: string, strategy: any) {
    let querySql = `INSERT INTO strategy_copy (userId, copyStrage, idx, isPaused, target) VALUES ('${userID}', '{"buyGas":"${strategy.buyGas}","maxMcap":"${strategy.buyGas}","minMcap":"0","sellGas":"0.0015","copySell":"true","slippage":"15","buyPercen":"50%","minLiquidity":"100","targetWallet":"${strategy.target}"}', null, 1, '${strategy.target}');`
    const results = await mysqlInstance.query(querySql)
    console.log(results[0][0], '__results__')
    if (results[0][0]) {
        //  存在, 返回查询的数据
        return results[0][0]
    } else {
        //  不存在,返回 空数组
        return false
    }
}

async function pauseAllStrategy(userID: string) {
    let querySql = `UPDATE strategy_copy SET isPaused =0 WHERE userId= '${userID}';`
    const results = await mysqlInstance.query(querySql)
    console.log(results[0][0], '__results__')
    if (results[0][0]) {
        //  存在, 返回查询的数据
        return results[0][0]
    } else {
        //  不存在,返回 空数组
        return false
    }
}

export {
    getUserExit,
    getPoolKeys,
    getCopyStrategy,
    addCopyStrategy,
    pauseAllStrategy
}