import { BaseSoftDeleteModel } from "./base-soft-delete.model";

export type ProductModel = BaseSoftDeleteModel & {
    goa_member_only: boolean,
    active: boolean,
    product_analysis: string[] | string,
    currency: string,
    product_code: string,
    product_description: string,
    product_name: string,
    product_options: ProductOption[] | string,
    stock_level: ProductStockLevelEnum,
    categories: string[] | string,
    imgs: string[] | string,
    sharing_goa_member: string,
    sharing_goa_farm: string,
    max_quantity:number,
};

export interface ProductOption {
    description: string;
    position: number;
    price: number;
}

export enum ProductStockLevelEnum {
    None = 0,
    Low = 1,
    Ok = 2,
    High = 3,
}