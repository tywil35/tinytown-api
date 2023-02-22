import { CrudService } from "./crud.service";
import { InvoiceModel, InvoiceStatusEnum } from "../model/invoice.model";
import { InvoiceItemJoinProductModel, InvoiceItemModel } from "../model/invoice-item.model";
import { CurrencyEnum } from "../../enum/currency.enum";
export class OrderService extends CrudService<InvoiceModel> {
    private TABLE_NAME = 'invoices';
    constructor() {
        super();
        this.enableSoftDelete();
    }
    async createOrder(invoice: InvoiceModel) {
        invoice.create_time = new Date();
        invoice.touched_by = this.user_id;
        invoice.invoice_number = await this.count(this.TABLE_NAME);
        invoice.invoice_number++;
        return this.create(this.TABLE_NAME, invoice);
    }
    async find(id: string) {
        return this.read(this.TABLE_NAME, id);
    }
    async findAll() {
        return this.readAll(this.TABLE_NAME);
    }
    async updateOrder(product: InvoiceModel) {
        product.update_time = new Date();
        product.touched_by = this.user_id;
        return this.update(this.TABLE_NAME, product);
    }
    async deleteOrder(id: string) {
        if (!this.user_id) { throw Error('Cannot delete record without user'); }
        return this.delete(this.TABLE_NAME, id, this.user_id);
    }
    async createOrderItem(data: InvoiceItemModel): Promise<InvoiceItemModel> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query('INSERT INTO ?? SET ?;', ['invoice_items', data]).then((_: InvoiceItemModel) => {
                    resolve(data);
                });
            } catch (err) {
                await connection.query("ROLLBACK");
                reject(err);
            } finally {
                await connection.release();
            }
        });
    }
    async findOrderItem(id: string): Promise<InvoiceItemJoinProductModel[]> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                await connection.query(`SELECT products.product_code,products.product_name,invoice_items.product_quantity,invoice_items.product_option FROM invoice_items LEFT JOIN products ON invoice_items.product_id = products.id WHERE invoice_id = ?;`, [id]).then((res: InvoiceItemJoinProductModel[]) => {
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

    async findByFilter(filter: { status: InvoiceStatusEnum, goa: boolean, admin: boolean }): Promise<InvoiceModel[]> {
        const connection = await this.connection();
        return new Promise(async (resolve, reject) => {
            try {
                let where = ' AND ?? = ?';
                let search = ['invoice_status', filter.status];
                if (!filter.admin) {
                    where += ' AND ?? = ?';
                    search.push('currency', (filter.goa ? CurrencyEnum.CSRF : CurrencyEnum.RAND))
                }
                await connection.query(`SELECT * FROM ?? WHERE ?? IS NOT NULL${where};`, [this.TABLE_NAME, 'id', ...search]).then((res: InvoiceModel[]) => {
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
