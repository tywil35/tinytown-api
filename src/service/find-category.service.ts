import { CategoryModel } from "../mysql/model/category.model";
import { CategoryFilter } from '../interface/category-filter.interface';
import { CategoryService } from "../mysql/service/category.service";

export namespace FindCategoryService {
    export type Request = CategoryFilter;
    export type Response = CategoryModel[];
    const service = new CategoryService();
    export const FindAllPublicCategories = async (): Promise<Response> => {
        const all_categories = await service.findAllPublicCategories();
        return all_categories;
    }
    export const FindCategoriesByFilter = async (filter: Request): Promise<Response> => {
        const all_categories = await service.findCategoriesByFilter(filter);
        return all_categories;
    }
}
