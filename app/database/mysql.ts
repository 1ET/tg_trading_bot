import mysql from "mysql2/promise"
// import mysql from "mysql2/promise"
require('dotenv').config()
import bluebird from 'bluebird';
let mysqlPool: mysql.Pool
import { mysqlAdapter } from "@app/database/mysqlAdapter/mysqlAdapter"

// const mysqlInstanceAdapter = async () => {
//     let pools = mysql.createPool({
//         host: process.env.MYSQL_HOST,
//         port: Number(process.env.MYSQL_PORT),
//         user: process.env.MYSQL_USER,
//         password: process.env.MYSQL_PASSWORD,
//         database: process.env.MYSQL_USEDATABASE,
//         waitForConnections: true,
//         connectionLimit: 10,
//         maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
//         idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
//         queueLimit: 0,
//         enableKeepAlive: true,
//         keepAliveInitialDelay: 0,
//         Promise: bluebird,
//     })
//     const sqlAdapter = await mysqlAdapter.create({ tableName: 'sessions', client: pools })
//     console.log('sqlAdapter====>', sqlAdapter)
//     return sqlAdapter
// }

// const mysqlInstance = async () => {
//     let pools = mysql.createPool({
//         host: process.env.MYSQL_HOST,
//         port: Number(process.env.MYSQL_PORT),
//         user: process.env.MYSQL_USER,
//         password: process.env.MYSQL_PASSWORD,
//         database: process.env.MYSQL_USEDATABASE,
//         waitForConnections: true,
//         connectionLimit: 10,
//         maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
//         idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
//         queueLimit: 0,
//         enableKeepAlive: true,
//         keepAliveInitialDelay: 0,
//         Promise: bluebird,
//     })
//     return pools
// }

const mysqlInstance: mysql.Pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_USEDATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    Promise: bluebird,
})

export {
    // initMysqlConnection,
    mysqlPool,
    mysqlInstance
    // MySQL
}