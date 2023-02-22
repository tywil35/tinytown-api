
import express, { Request, Response } from 'express';
import { LogUtil } from '../utils/log.util';
import { JwtUtil } from '../utils/jwt.util';
import { FindProductService } from '../service/find-product.service';
export namespace FindProductController {
    export const PrefixRoute = '/common/product';
    export const Router = express.Router();
    const middleWare = [express.json()];
    const secureMiddleWare = [express.json(), JwtUtil.AuthenticateTokenButAllow];
    Router.get('/', middleWare, async (_: Request, res: Response) => {
        try {
            const products = await FindProductService.FindAllPublicProducts();
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
        await FindProductService.FindProductsByFilter({ ...req.body, goa: req.usr?.goa ?? false }).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
        })
    });

}

