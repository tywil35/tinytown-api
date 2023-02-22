import { ProductOption } from "./product.model";

export type InvoiceItemModel = {
    invoice_id: string,
    product_id: string,
    product_quantity: number,
    product_option: ProductOption | string,
};

export type InvoiceItemJoinProductModel = {
    product_code: string,
    product_name: string,
    product_quantity: number,
    product_option: ProductOption | string,
};
