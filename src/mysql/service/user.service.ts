import { UserModel } from "..";
import { randomUUID } from "crypto";
import { CrudService } from "./crud.service";
import { LogUtil } from "../../utils/log.util";
import { UserProfileModel } from "../model/user.model";
export class UserService extends CrudService<UserModel> {
    private TABLE_NAME = 'users';
    constructor() {
        super();
        this.enableSoftDelete();
    }
    async createUser(user: UserModel) {
        user.id = randomUUID();
        user.create_time = new Date();
        user.touched_by = this.user_id;
        return this.create(this.TABLE_NAME, user);
    }
    async findUser(id: string) {
        return this.read(this.TABLE_NAME, id);
    }
    async findAllUsers() {
        return this.readAll(this.TABLE_NAME);
    }
    async updateUser(user: UserModel) {
        user.update_time = new Date();
        user.touched_by = this.user_id;
        return this.update(this.TABLE_NAME, user);
    }
    async recordUserLogin(user: UserModel) {
        user.login_time = new Date();
        return this.update(this.TABLE_NAME, user);
    }
    async deleteUser(id: string) {
        if (!this.user_id) { throw Error('Cannot delete record without user'); }
        return this.delete(this.TABLE_NAME, id, this.user_id);
    }
    async findUserByEmail(email: string): Promise<UserModel> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT *  FROM ?? WHERE email = ?;`, [this.TABLE_NAME, email]).then((res: UserModel[]) => {
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

    async findUserProfileById(id: string): Promise<UserProfileModel> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT ??, ??, ??, ??  FROM ?? WHERE ?? = ?;`, ['username', 'email', 'cell', 'address_line', this.TABLE_NAME, 'id', id]).then((res: UserModel[]) => {
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
}

