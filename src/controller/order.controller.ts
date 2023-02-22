
import express, { Request, Response } from 'express';
import { LogUtil } from '../utils/log.util';
import { JwtUtil } from '../utils/jwt.util';
import { Staff, UserRoleEnum } from '../mysql/model/user.model';
import { CreateOrderService } from '../service/create-order.service';
import { UpdateOrderService } from '../service/update-order.service';
import { AllOrderService } from '../service/order.service';
import { OrderDetailService } from '../service/order-detail.service';

export namespace OrderController {
    export const PrefixRoute = '/order';
    export const Router = express.Router();
    const secureMiddleWare = [express.json(), JwtUtil.AuthenticateToken];
    Router.get('/', secureMiddleWare, async (req: Request, res: Response) => {
        if (req.body == undefined || !req.usr || !Staff.includes(req.usr.role as UserRoleEnum)) {
            res.status(401).json({ message: 'Not Allowed' })
        }
        try {
            const orders = await AllOrderService.AllOrders();
            res.status(200).json(orders)
        } catch (error: any) {
            LogUtil.warn(error.message);
            res.status(400).json({ message: error.message })
        }
    });
    Router.post('/filter', secureMiddleWare, async (req: Request, res: Response) => {
        if (req.body == undefined || !req.usr || !Staff.includes(req.usr.role as UserRoleEnum)) {
            res.status(401).json({ message: 'Not Allowed' })
        }
        try {
            const orders = await AllOrderService.findByFilter({ ...req.body, goa: (req.usr?.role === UserRoleEnum.BudBar || req.usr?.role === UserRoleEnum.SA), admin: req.usr?.role === UserRoleEnum.SA });
            res.status(200).json(orders)
        } catch (error: any) {
            LogUtil.warn(error.message);
            res.status(400).json({ message: error.message })
        }
    });
    Router.post('/details', secureMiddleWare, async (req: Request, res: Response) => {
        if (req.body == undefined || !req.usr || !Staff.includes(req.usr.role as UserRoleEnum)) {
            res.status(401).json({ message: 'Not Allowed' })
        }
        try {
            const order_details = await OrderDetailService.AllOrders(req.body);
            res.status(200).json(order_details)
        } catch (error: any) {
            LogUtil.warn(error.message);
            res.status(400).json({ message: error.message })
        }
    });
    Router.post('/', secureMiddleWare, async (req: Request, res: Response) => {
        try {
            const products = await CreateOrderService.CreateOrder({ ...req.body, user_id: req.usr?.id ?? '', user_email: req.usr?.email ?? '' });
            res.status(200).json(products)
        } catch (error: any) {
            LogUtil.warn(error.message);
            res.status(400).json({ message: error.message })
        }
    });
    Router.put('/cultivated', secureMiddleWare, async (req: Request, res: Response) => {
        if (req.body == undefined || !req.usr || !Staff.includes(req.usr.role as UserRoleEnum)) {
            res.status(401).json({ message: 'Not Allowed' })
        }
        try {
            const products = await UpdateOrderService.OrderCultivated({ ...req.body, user_id: req.usr?.id ?? '' });
            res.status(200).json(products)
        } catch (error: any) {
            LogUtil.warn(error.message);
            res.status(400).json({ message: error.message })
        }
    });
    Router.put('/cancel', secureMiddleWare, async (req: Request, res: Response) => {
        if (req.body == undefined || !req.usr || !Staff.includes(req.usr.role as UserRoleEnum)) {
            res.status(401).json({ message: 'Not Allowed' })
        }
        try {
            const products = await UpdateOrderService.OrderCancel({ ...req.body, user_id: req.usr?.id ?? '' });
            res.status(200).json(products)
        } catch (error: any) {
            LogUtil.warn(error.message);
            res.status(400).json({ message: error.message })
        }
    });
}

