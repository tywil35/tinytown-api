
import express, { Request, Response } from 'express';
import { LogUtil } from '../utils/log.util';
import { JwtUtil } from '../utils/jwt.util';
import { FindCategoryService } from '../service/find-category.service';
export namespace FindCategoryController {
    export const PrefixRoute = '/common/category';
    export const Router = express.Router();
    const middleWare = [express.json()];
    const secureMiddleWare = [express.json(), JwtUtil.AuthenticateTokenButAllow];
    Router.get('/', middleWare, async (req: Request, res: Response) => {
        try {
            const products = await FindCategoryService.FindAllPublicCategories();
            res.status(200).json(products)
        } catch (error: any) {
            LogUtil.warn(error.message);
            res.status(400).json({ message: error.message })
        }
    });
    Router.post('/filter', secureMiddleWare, async (req: Request, res: Response) => {
        if (req.body == undefined) {
            res.status(400).json({ message: 'nobody' })
        }
        await FindCategoryService.FindCategoriesByFilter({ ...req.body, goa: req.usr?.goa ?? false }).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
        })
    });

}

