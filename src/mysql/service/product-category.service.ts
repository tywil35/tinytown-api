import { CrudService } from "./crud.service";
import { LogUtil } from "../../utils/log.util";
import { OkPacket } from "mysql";
import { ProductCategoryModel } from "../model/product-category.model";
export class ProductCategoryService extends CrudService<ProductCategoryModel> {
    private TABLE_NAME = 'product_category';
    constructor() {
        super();
    }
    async createCategory(category: ProductCategoryModel) {
        return this.create(this.TABLE_NAME, category);
    }
    async findAll() {
        return this.readAll(this.TABLE_NAME);
    }
    async deleteCategoryOrProduct(id: string, category_id = true): Promise<OkPacket> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query('DELETE FROM ?? WHERE  ?? = ?;', [this.TABLE_NAME, (category_id ? 'category_id' : 'product_id'), id]).then((res: OkPacket) => {
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
    async deleteProductCategory(product_id: string, category_id: string): Promise<OkPacket> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query('DELETE FROM ?? WHERE  ?? = ? AND ?? = ?;', [this.TABLE_NAME, 'product_id', product_id, 'category_id', category_id]).then((res: OkPacket) => {
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
    async findProductCategory(product_id: string, category_id: string): Promise<ProductCategoryModel> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query('SELECT *  FROM ?? WHERE  ?? = ? AND ?? = ?;', [this.TABLE_NAME, 'product_id', product_id, 'category_id', category_id]).then((res: ProductCategoryModel[]) => {
                    resolve(res[0]);
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

