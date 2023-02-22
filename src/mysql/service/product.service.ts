import { ProductModel } from "../model/product.model";
import { randomUUID } from "crypto";
import { CrudService } from "./crud.service";
import { ProductFilter } from "../../interface/product-filter.interface";
import { LogUtil } from "../../utils/log.util";
export class ProductService extends CrudService<ProductModel> {
    private TABLE_NAME = 'products';
    constructor() {
        super();
        this.enableSoftDelete();
    }
    async createProduct(product: ProductModel) {
        product.id = randomUUID();
        product.create_time = new Date();
        product.touched_by = this.user_id;
        return this.create(this.TABLE_NAME, product);
    }
    async findProduct(id: string) {
        return this.read(this.TABLE_NAME, id);
    }
    async findAllProducts() {
        return this.readAll(this.TABLE_NAME);
    }
    async findProductsByFilter(filter: ProductFilter): Promise<ProductModel[]> {
        const search: (string | boolean | string[])[] = [];
        let where = '';
        if (filter.product_code) {
            search.push('product_code', filter.product_code);
            where += ` AND ?? LIKE ?`;
        }
        if (filter.product_id) {
            search.push('id', filter.product_id);
            where += ` AND ?? = ?`;
        }
        if (filter.product_name) {
            search.push('product_name', '%' + filter.product_name + '%');
            where += ` AND UPPER(??) LIKE UPPER(?)`;
        }
        search.push('goa_member_only', filter.goa != undefined && filter.goa);
        where += ` AND ?? = ?`;
        if (filter.categories && filter.categories.length > 0) {
            search.push('id', 'product_id', 'product_category', 'category_id', 'category_name', 'categories', 'category_name', filter.categories);
            where += ` AND ?? IN (SELECT ?? FROM ?? WHERE ?? IN (SELECT ?? FROM ?? WHERE ?? IN (?)))`;
        }
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT * FROM ?? WHERE ?? = ? AND ?? <> ?${where};`, [this.TABLE_NAME, 'active', true, 'stock_level', 0, ...search]).then((res: ProductModel[]) => {
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
    async findProductsByFilterAdmin(filter: ProductFilter): Promise<ProductModel[]> {
        const search: (string | boolean | string[])[] = [];
        let where = '';
        if (filter.product_code) {
            search.push('product_code', filter.product_code);
            where += ` AND ?? LIKE ?`;
        }
        if (filter.product_id) {
            search.push('id', filter.product_id);
            where += ` AND ?? = ?`;
        }
        if (filter.product_name) {
            search.push('product_name', '%' + filter.product_name + '%');
            where += ` AND UPPER(??) LIKE UPPER(?)`;
        }
        search.push('goa_member_only', filter.goa != undefined && filter.goa);
        where += ` AND ?? = ?`;
        if (filter.categories && filter.categories.length > 0) {
            search.push('id', 'product_id', 'product_category', 'category_id', 'category_name', 'categories', 'category_name', filter.categories);
            where += ` AND ?? IN (SELECT ?? FROM ?? WHERE ?? IN (SELECT ?? FROM ?? WHERE ?? IN (?)))`;
        }
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT * FROM ?? WHERE ?? IS NOT NULL${where};`, [this.TABLE_NAME, 'id', ...search]).then((res: ProductModel[]) => {
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
    async updateProduct(product: ProductModel) {
        product.update_time = new Date();
        product.touched_by = this.user_id;
        return this.update(this.TABLE_NAME, product);
    }
    async deleteProduct(id: string) {
        if (!this.user_id) { throw Error('Cannot delete record without user'); }
        return this.delete(this.TABLE_NAME, id, this.user_id);
    }

    async findProductByProductCode(product_code: string): Promise<ProductModel> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT * FROM ?? WHERE product_code = ?;`, [this.TABLE_NAME, product_code]).then((res: ProductModel[]) => {
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
    async findAllPublicProducts(): Promise<ProductModel[]> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT * FROM ?? WHERE goa_member_only = false AND active = true AND stock_level <> 0;`, [this.TABLE_NAME]).then((res: ProductModel[]) => {
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

