import { mysqlInstance } from "@app/database/mysql"
import { encrypted } from "@app/crypto/index"
import { generateWallet } from "@app/raydium/helpers/wallet"
import { moneyFormat2 } from "@app/utils/index"

async function getUserExit(userInfo) {
    let querySql = `SELECT  * FROM user WHERE  id = '${userInfo.id}';`
    const results = await mysqlInstance.query(querySql)
    if (results[0][0].id) {
        // 5340665667
        //  用户存在, 返回查询的数据
        return results[0][0]
    } else {
        //  用户不存在, 初始化数据, 生成钱包
        const newPair = generateWallet()
        const pri = encrypted(newPair.priKey)
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

export {
    getUserExit
}