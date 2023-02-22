import { ProductModel, ProductOption } from "../mysql/model/product.model";

export type ProductOrder = ProductModel & {
    option: ProductOption;
    quantity: number;
}