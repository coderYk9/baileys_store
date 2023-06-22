import type { ConnectionConfig, Connection } from "mariadb";
import mariadb from "mariadb";
const dbconfig: ConnectionConfig = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'baileys',
    'port': 3306,
    'trace': true,
    'compress': true,
    'insertIdAsNumber': true,
    //'supportBigNumbers': true
};
import  invariant  from "tiny-invariant";
class DB {
    public static conn: Connection;
    public static async conection() {
        try {

            this.conn = await mariadb.createConnection(dbconfig)

        } catch (error) {
            invariant(error, 'Unable To unitailse Mysql')

        }
    };

    public static async query(sql: string, params?: any): Promise<any> {


        if (!this.conn) { await this.conection() }

        try {
            const rows = this.conn.query(sql, params)
            return rows
        } catch (error) {
            invariant(error,'Dad Querry Happens');
        }


    };
    public static async select(table: string, fileds: string | Array<string>, condition: { where: string, params: Array<any>|null}): Promise<unknown> {
        let sql: string
        if (condition) {
            sql = `SELECT ${fileds.toString()} FROM ${table} WHERE ${condition['where']}`
        }
        else {
            sql = `SELECT ${fileds.toString()} FROM ${table}`
        }

        try {
            const rows = await this.query(sql, condition['params'] ?? null)
            return rows
        } catch (error) {
            invariant(error,'Unable To unitailse Mysql')

        }

    };

}
export default DB