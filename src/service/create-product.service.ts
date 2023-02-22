import { LogUtil } from "../utils/log.util";
import { ProductService } from "../mysql/service/product.service";
import { StringEmptyUtil } from "../utils/string-empty.utl";
import { ProductModel } from "../mysql/model/product.model";
import { CategoryService } from "../mysql/service/category.service";
import { ProductCategoryService } from "../mysql/service/product-category.service";
import { CurrencyEnum } from "../enum/currency.enum";

export namespace CreateProductService {
    export type Request = ProductModel & { user_id?: string };
    export type Response = { message: string };
    const service = new ProductService();
    const category_service = new CategoryService();
    const product_category_service = new ProductCategoryService();
    const validateRequest = (data: Request): string => {
        const validation_errors = [];
        if (StringEmptyUtil.Is(data.product_code)) {
            validation_errors.push('product code missing');
        }
        if (StringEmptyUtil.Is(data.product_name)) {
            validation_errors.push('product name missing');
        }
        if (StringEmptyUtil.Is(data.currency)) {
            validation_errors.push('currency missing');
        }
        if (data.product_options.length <= 0) {
            validation_errors.push('product options missing, need atleast one.');
        }
        return validation_errors.join(', ');
    }
    export const CreateProduct = async (product: Request): Promise<Response> => {
        const validation_errors = validateRequest(product);
        LogUtil.info('validation_errors', validation_errors);
        if (validation_errors != '') { throw Error(validation_errors); }
        const prdct_xst = await service.findProductByProductCode(product.product_code);
        if (prdct_xst) { throw Error(`Product Already Exists`); }
        service.setUserId(product.user_id);
        delete product['user_id'];
        product.currency = (product.goa_member_only ? CurrencyEnum.CSRF : CurrencyEnum.RAND);
        product.product_analysis = JSON.stringify(product.product_analysis);
        product.product_options = JSON.stringify(product.product_options);
        let categories = product.categories;
        product.categories = JSON.stringify(product.categories);
        product.imgs = JSON.stringify(product.imgs);
        product = await service.createProduct(product as ProductModel);
        if (!product.id) { throw Error('created product by id is undefined'); }
        try {
            for (let index = 0; index < categories.length; index++) {
                const category = categories[index];
                const ctgry_xst = await category_service.findCategoryByName(category);
                if (!ctgry_xst) {
                    const new_category = await category_service.createCategory({ active: true, category_name: category, goa_member_only: product.goa_member_only });
                    await product_category_service.createCategory({ product_id: product.id, category_id: new_category.category_name });
                } else {
                    ctgry_xst.goa_member_only = product.goa_member_only;
                    const prdct_ctgry_xst = await product_category_service.findProductCategory(product.id, ctgry_xst.category_name);
                    if (!prdct_ctgry_xst) {
                        await product_category_service.createCategory({ product_id: product.id, category_id: ctgry_xst.category_name });
                    }
                    await category_service.updateCategory(ctgry_xst);
                }
            }
        } catch (error) {
            LogUtil.warn(error)
        }
        return { message: 'created product' };
    }

    export const DeleteProduct = async (product: Request): Promise<Response> => {
        if (!product.id) { throw Error(`cannot delete product`); };
        service.setUserId(product.user_id);
        await service.deleteProduct(product.id);
        await product_category_service.deleteCategoryOrProduct(product.id, false);
        return { message: 'delete product' };
    }

    export const UpdateProduct = async (product: Request): Promise<Response> => {
        const validation_errors = validateRequest(product);
        LogUtil.info('validation_errors', validation_errors);
        if (validation_errors != '') { throw Error(validation_errors); }
        const prdct_xst = await service.findProduct(product.id ?? '');
        if (!prdct_xst) { throw Error(`Product Does Not Exists`); }
        service.setUserId(product.user_id);
        product.currency = (product.goa_member_only ? CurrencyEnum.CSRF : CurrencyEnum.RAND);
        product.product_analysis = JSON.stringify(product.product_analysis);
        product.product_options = JSON.stringify(product.product_options);
        let categories = product.categories;
        let old_categories = JSON.parse(prdct_xst.categories as string);
        product.categories = JSON.stringify(product.categories);
        product.imgs = JSON.stringify(product.imgs);
        prdct_xst.goa_member_only = product.goa_member_only;
        prdct_xst.active = product.active;
        prdct_xst.product_analysis = product.product_analysis;
        prdct_xst.currency = product.currency;
        prdct_xst.product_code = product.product_code;
        prdct_xst.product_description = product.product_description;
        prdct_xst.product_name = product.product_name;
        prdct_xst.product_options = product.product_options;
        prdct_xst.categories = product.categories;
        prdct_xst.imgs = product.imgs;
        prdct_xst.stock_level = product.stock_level;
        await service.updateProduct(prdct_xst);
        if (!prdct_xst.id) { throw Error('created product by id is undefined'); }
        try {
            for (let index = 0; index < categories.length; index++) {
                const category = categories[index];
                if (old_categories) {
                    old_categories = old_categories.filter((_c: string) => _c !== category);
                }
                const ctgry_xst = await category_service.findCategoryByName(category);
                if (!ctgry_xst) {
                    const new_category = await category_service.createCategory({ active: true, category_name: category, goa_member_only: prdct_xst.goa_member_only });
                    await product_category_service.createCategory({ product_id: prdct_xst.id, category_id: new_category.category_name });
                } else {
                    ctgry_xst.goa_member_only = product.goa_member_only;
                    const prdct_ctgry_xst = await product_category_service.findProductCategory(prdct_xst.id, ctgry_xst.category_name);
                    if (!prdct_ctgry_xst) {
                        await product_category_service.createCategory({ product_id: prdct_xst.id, category_id: ctgry_xst.category_name });
                    }
                    await category_service.updateCategory(ctgry_xst);
                }
            }
            for (let index = 0; index < old_categories.length; index++) {
                const old_category = old_categories[index];
                await product_category_service.deleteProductCategory(prdct_xst.id, old_category);
            }
        } catch (error) {
            LogUtil.warn(error)
        }
        return { message: 'updated product' };
    }
}
