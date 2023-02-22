import { UserModel } from "..";
import { randomUUID } from "crypto";
import { CrudService } from "./crud.service";
import { LogUtil } from "../../utils/log.util";
import { ForgotPasswordRecordModel } from "../model/forgot-password-record.model";
import { OkPacket } from "mysql";
export class ForgotPasswordRecordService extends CrudService<ForgotPasswordRecordModel> {
    private TABLE_NAME = 'forgot_password_record';
    constructor() {
        super();
        this.enableSoftDelete();
    }
    async createForgotPasswordRecord(user_id: string) {
        let record: ForgotPasswordRecordModel = {
            forgot_token: randomUUID(),
            create_time: new Date(),
            user_id: user_id
        }
        return this.create(this.TABLE_NAME, record);
    }
    async findForgotPasswordRecord(forgot_token: string, user_id: string): Promise<ForgotPasswordRecordModel> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT *  FROM ?? WHERE forgot_token = ? AND user_id = ?;`, [this.TABLE_NAME, forgot_token, user_id]).then((res: ForgotPasswordRecordModel[]) => {
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
    async findForgotPasswordRecordByUser(user_id: string): Promise<ForgotPasswordRecordModel> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT *  FROM ?? WHERE user_id = ?;`, [this.TABLE_NAME, user_id]).then((res: ForgotPasswordRecordModel[]) => {
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

    async deleteForgotPasswordRecord(forgot_token: string): Promise<OkPacket> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query('DELETE FROM ?? WHERE  forgot_token = ?;', [this.TABLE_NAME, forgot_token]).then((res: OkPacket) => {
                    resolve(res);
                });
            } catch (err) {
                await connection.query("ROLLBACK");
                LogUtil.debug('ROLLBACK at Delete', err);
                reject(err);
            } finally {
                await connection.release();
            }
        });
    }

    async deleteForgotPasswordRecordOlderThan24Hours(): Promise<OkPacket> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                const hour_24 = new Date(new Date().getTime() - ((24 * 60) * 60 * 1000))
                await connection.query('DELETE FROM ?? WHERE  create_time < ?;', [this.TABLE_NAME, hour_24]).then((res: OkPacket) => {
                    resolve(res);
                });
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

