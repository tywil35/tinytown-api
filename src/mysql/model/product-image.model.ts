import { BaseSoftDeleteModel } from "./base-soft-delete.model";

export type ProductImageModel = BaseSoftDeleteModel & {
    image_url: string,
    product_id: string,
};