import mysql from "mysql2"
import { Pool, PoolOptions } from "mysql2/typings/mysql/lib/Pool"
require('dotenv').config()
import { MysqlDialect } from "kysely"
import { KyselyStore } from "./kysely"

interface NewPoolOpts {
    host?: string | undefined;
    port?: number | undefined;
    database?: string | undefined;
    user?: string | undefined;
    password?: string;
    /**
     * MySQL2 Pool options.
     *
     * Remember to install the db driver `'mysql2'`.
     *
     * @see {@link https://github.com/sidorares/node-mysql2#using-connection-pools Node MySQL 2 | Using connection pools}
     * */
    config?: Omit<PoolOptions, "host" | "port" | "database" | "user" | "password">;
    /** Table name to use for sessions. Defaults to "telegraf-sessions". */
    table?: string;
    /** Called on fatal connection or setup errors */
    onInitError?: (err: unknown) => void;
}

interface ExistingPoolOpts {
    /** If passed, we'll reuse this instance of MySQL2 Pool instead of creating our own. */
    pool: Pool;
    /** Table name to use for sessions. Defaults to "telegraf-sessions". */
    table?: string;
    /** Called on fatal connection or setup errors */
    onInitError?: (err: unknown) => void;
}

let mysqlPool: Pool
async function initMysqlConnection() {
    try {
        mysqlPool = mysql.createPool({
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
        })
        console.log('数据库连接成功')
    } catch (error) {
        console.log('数据库连接失败')
        process.exit(0)

    }
}

function onInitError(err) {
    console.log('onInitError===>', err)
}

function MySQL<Session>() {
    return KyselyStore<Session>({
        config: {
            dialect: new MysqlDialect({
                pool: mysql.createPool({
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
                }),
            }),
        },
        table: undefined,
        onInitError: onInitError,
    });
}

export {
    initMysqlConnection,
    mysqlPool,
    MySQL
}