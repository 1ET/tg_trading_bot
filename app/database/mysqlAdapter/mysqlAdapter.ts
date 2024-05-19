export type { StorageAdapter } from 'grammy';
import { StorageAdapter } from 'grammy';
import mysql from "mysql2/promise"

// import { Pool } from "mysql2/typings/mysql/lib/Pool"

function buildQueryRunner(client: mysql.Connection) {
    return async (query: string, params?: string[]) => {
        const results = await client.query(query, params);

        return results;
    };
}

interface AdapterConstructor {
    client: mysql.Pool;
    tableName: string;
    query: (query: string, params?: string[] | undefined) => Promise<any>;
}

interface DbOject {
    key: string;
    value: string;
}

export class mysqlAdapter<T> implements StorageAdapter<T> {
    private tableName: string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private query = (_query: string, _params?: string[] | undefined): Promise<unknown> | unknown => null;

    /**
     * @private
     */
    private constructor(opts: AdapterConstructor) {
        this.tableName = opts.tableName;
        this.query = opts.query;
    }

    static async create(opts = { tableName: 'sessions' } as Omit<AdapterConstructor, 'query'>) {
        const queryString = "CREATE TABLE IF NOT EXISTS " + opts.tableName + "( `key` varchar (1000) NOT NULL DEFAULT '', `value` text NULL, unique `IDX_sessions` USING btree (`key`)) ENGINE = innodb "
        const query = buildQueryRunner(opts.client);
        await query(queryString);
        // await query(`CREATE UNIQUE INDEX IF NOT EXISTS IDX_${opts.tableName} ON "${opts.tableName}" ("key")`);

        return new mysqlAdapter({
            ...opts,
            query,
        });
    }

    private async findSession(key: string) {
        console.log('findSession===>', key)
        const [rows, fields] = (await this.query(`select * from "${this.tableName}" where key = ${key}`)) as DbOject[];
        const session = rows[0];

        return session;
    }

    async read(key: string) {
        console.log('read_key', key)
        const session = await this.findSession(key);

        if (!session) {
            return undefined;
        }

        return JSON.parse(session.value as string) as T;
    }

    async write(key: string, value: T) {
        console.log('write_key', key)
        await this.query(
            'INSERT IGNORE INTO ' + this.tableName + ' (`key`, `value`) VALUES ' + `('${key}', '${value}')`
        );
    }

    async delete(key: string) {
        await this.query(`delete from ${this.tableName} where key = ${key}`);
    }
}