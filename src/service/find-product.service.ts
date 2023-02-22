import { ProductService } from "../mysql/service/product.service";
import { ProductModel } from "../mysql/model/product.model";
import { ProductFilter } from '../interface/product-filter.interface';

export namespace FindProductService {
    export type Request = ProductFilter;
    export type Response = ProductModel[];
    const service = new ProductService();
    export const FindAllPublicProducts = async (): Promise<Response> => {
        const all_products = await service.findAllPublicProducts();
        return all_products;
    }
    export const FindProductsByFilter = async (filter: Request): Promise<Response> => {
        const all_products = await service.findProductsByFilter(filter);
        return all_products;
    }
    export const FindProductsByFilterAdmin = async (filter: Request): Promise<Response> => {
        const all_products = await service.findProductsByFilterAdmin(filter);
        return all_products;
    }
}
