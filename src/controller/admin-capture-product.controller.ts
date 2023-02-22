
import express, { Request, Response } from 'express';
import { LogUtil } from '../utils/log.util';
import { JwtUtil } from '../utils/jwt.util';
import { UserRoleEnum } from '../mysql/model/user.model';
import { CreateProductService } from '../service/create-product.service';
import { FindProductService } from '../service/find-product.service';
export namespace AdminCaptureProductController {
    export const PrefixRoute = '/admin/product';
    export const Router = express.Router();
    const secureMiddleWare = [express.json(), JwtUtil.AuthenticateToken];
    Router.post('/filter', secureMiddleWare, async (req: Request, res: Response) => {
        if (req.body == undefined || req.usr?.role !== UserRoleEnum.SA) {
            res.status(401).json({ message: 'Not Allowed' });
            return;
        }
        await FindProductService.FindProductsByFilterAdmin({ ...req.body, goa: req.usr?.goa ?? false }).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
        })
    });
    Router.post('/create', secureMiddleWare, (req: Request, res: Response) => {
        if (req.body == undefined || req.usr?.role !== UserRoleEnum.SA) {
            res.status(401).json({ message: 'Not Allowed' });
            return;
        }
        LogUtil.info('Create Product', req.usr);
        CreateProductService.CreateProduct({ ...req.body, user_id: req.usr?.id ?? '' }).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
        })
    });
    Router.post('/delete', secureMiddleWare, (req: Request, res: Response) => {
        if (req.body == undefined || req.usr?.role !== UserRoleEnum.SA) {
            res.status(401).json({ message: 'Not Allowed' });
            return;
        }
        CreateProductService.DeleteProduct({ ...req.body, user_id: req.usr?.id ?? '' }).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
        })
    });
    Router.post('/update', secureMiddleWare, (req: Request, res: Response) => {
        if (req.body == undefined || req.usr?.role !== UserRoleEnum.SA) {
            res.status(401).json({ message: 'Not Allowed' });
            return;
        }
        CreateProductService.UpdateProduct({ ...req.body, user_id: req.usr?.id ?? '' }).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
        })
    });
}

