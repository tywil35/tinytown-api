import { MySqlDb } from '../db';
import { OkPacket } from 'mysql';
import { LogUtil } from '../../utils/log.util';

export class CrudService<T> {
    protected softDelete: boolean = false;
    protected user_id: string | undefined = undefined;
    setUserId(user_id?: string) {
        this.user_id = user_id;
    }
    protected enableSoftDelete() { this.softDelete = true };
    protected disableSoftDelete() { this.softDelete = false };
    protected async connection() { return MySqlDb.Connection(); }
    protected async create(table: string, data: T): Promise<T> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query('INSERT INTO ?? SET ?;', [table, data]).then((res: T) => {
                    LogUtil.debug('inserted data', res);
                    resolve(data);
                });
            } catch (err) {
                await connection.query("ROLLBACK");
                LogUtil.debug('ROLLBACK at Read', err);
                reject(err);
            } finally {
                await connection.release();
            }
        });
    }
    protected async read(table: string, id: string): Promise<T> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT *  FROM ?? WHERE id = ?${this.softDelete ? ' AND delete_time IS NULL' : ''};`, [table, id]).then((res: T[]) => {
                    resolve(res[0]);
                });
            } catch (err) {
                await connection.query("ROLLBACK");
                LogUtil.debug('ROLLBACK at Read', err);
                reject(err);
            } finally {
                await connection.release();
            }
        });
    }
    protected async count(table: string): Promise<number> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT COUNT(*)  AS count_amnt FROM ??;`, [table]).then((res: { count_amnt: number }[]) => {
                    resolve(res[0].count_amnt);
                });
            } catch (err) {
                await connection.query("ROLLBACK");
                LogUtil.debug('ROLLBACK at Read All', err);
                reject(err);
            } finally {
                await connection.release();
            }
        });
    }
    protected async readAll(table: string): Promise<T[]> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT *  FROM ??${this.softDelete ? ' WHERE delete_time IS NULL' : ''};`, [table]).then((res: T[]) => {
                    resolve(res);
                });
            } catch (err) {
                await connection.query("ROLLBACK");
                LogUtil.debug('ROLLBACK at Read All', err);
                reject(err);
            } finally {
                await connection.release();
            }
        });
    }
    protected async update(table: string, data: any): Promise<OkPacket> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query('UPDATE ?? SET ? WHERE  id = ?;', [table, data, data.id]).then((res: OkPacket) => {
                    resolve(res);
                });
            } catch (err) {
                await connection.query("ROLLBACK");
                LogUtil.debug('ROLLBACK at Read', err);
                reject(err);
            } finally {
                await connection.release();
            }
        });
    }
    protected async delete(table: string, id: string, touched_by?: string): Promise<OkPacket> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                if (this.softDelete) {
                    await connection.query('DELETE FROM ?? WHERE  id = ?;', [table, id]).then((res: OkPacket) => {
                        resolve(res);
                    });
                } else {
                    await connection.query('UPDATE ?? SET delete_time = ? , touched_by = ? WHERE  id = ?;', [table, new Date(), touched_by, id]).then((res: OkPacket) => {
                        resolve(res);
                    });
                }
            } catch (err) {
                await connection.query("ROLLBACK");
                LogUtil.debug('ROLLBACK at Delete', err);
                reject(err);
            } finally {
                await connection.release();
            }
        });
    }
}
