import { CrudService } from "./crud.service";
import { LogUtil } from "../../utils/log.util";
import { CategoryModel } from "../model/category.model";
import { CategoryFilter } from "../../interface/category-filter.interface";
import { OkPacket } from "mysql";
export class CategoryService extends CrudService<CategoryModel> {
    private TABLE_NAME = 'categories';
    constructor() {
        super();
    }
    async createCategory(category: CategoryModel) {
        return this.create(this.TABLE_NAME, category);
    }
    async findAllCategories() {
        return this.readAll(this.TABLE_NAME);
    }
    async updateCategory(category: CategoryModel): Promise<OkPacket> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query('UPDATE ?? SET ? WHERE  ?? = ?;', [this.TABLE_NAME, category, 'category_name', category.category_name]).then((res: OkPacket) => {
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
    async deleteCategory(id: string) {
        return this.delete(this.TABLE_NAME, id);
    }
    async findCategoryByName(category_name: string): Promise<CategoryModel> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT * FROM ?? WHERE category_name = ?;`, [this.TABLE_NAME, category_name]).then((res: CategoryModel[]) => {
                    resolve(res[0]);
                });
            } catch (err) {
                await connection.query("ROLLBACK");
                reject(err);
            } finally {
                await connection.release();
            }
        });
    }
    async findCategoriesByFilter(filter: CategoryFilter): Promise<CategoryModel[]> {
        const search: (string | boolean | string[])[] = [];
        let where = '';
        if (filter.category_name) {
            search.push('category_name', '%' + filter.category_name + '%');
            where += ` AND UPPER(??) LIKE UPPER(?)`;
        }
        search.push('goa_member_only', filter.goa != undefined && filter.goa);
        where += ` AND ?? = ?`;
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT ?? FROM ?? WHERE ?? = ?${where};`, ['category_name', this.TABLE_NAME, 'active', true, ...search]).then((res: CategoryModel[]) => {
                    resolve(res);
                });
            } catch (err) {
                await connection.query("ROLLBACK");
                reject(err);
            } finally {
                await connection.release();
            }
        });
    }
    async findAllPublicCategories(): Promise<CategoryModel[]> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ?;`, ['category_name', this.TABLE_NAME, 'goa_member_only', false, 'active', true]).then((res: CategoryModel[]) => {
                    resolve(res);
                });
            } catch (err) {
                await connection.query("ROLLBACK");
                reject(err);
            } finally {
                await connection.release();
            }
        });
    }
}

