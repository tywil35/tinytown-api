
import express, { Request, Response } from 'express';
import { LogUtil } from '../utils/log.util';
import { JwtUtil } from '../utils/jwt.util';
import { UserRoleEnum } from '../mysql/model/user.model';
import { AdminUsersService } from '../service/admin-users.service';
import { AdminAllUsersService } from '../service/admin-all-users.service';
export namespace AdminUserController {
    export const PrefixRoute = '/admin/user';
    export const Router = express.Router();
    const secureMiddleWare = [express.json(), JwtUtil.AuthenticateToken];
    Router.get('/', secureMiddleWare, async (req: Request, res: Response) => {
        if (req.usr?.role !== UserRoleEnum.SA) {
            res.status(401).json({ message: 'Not Allowed' });
            return;
        }
        const users = await AdminAllUsersService.AllUsers();
        res.status(200).json(users);
    });
    Router.post('/create', secureMiddleWare, (req: Request, res: Response) => {
        if (req.body == undefined || req.usr?.role !== UserRoleEnum.SA) {
            res.status(401).json({ message: 'Not Allowed' });
            return;
        }
        AdminUsersService.RegisterUser({ ...req.body, user_id: req.usr?.id ?? '' }).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
            return;
        })
    });
    Router.post('/update', secureMiddleWare, (req: Request, res: Response) => {
        if (req.body == undefined || req.usr?.role !== UserRoleEnum.SA) {
            res.status(401).json({ message: 'Not Allowed' });
            return;
        }
        AdminUsersService.UpdateUser({ ...req.body, user_id: req.usr?.id ?? '' }).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
        })
    });
    Router.post('/block', secureMiddleWare, (req: Request, res: Response) => {
        if (req.body == undefined || req.usr?.role !== UserRoleEnum.SA) {
            res.status(401).json({ message: 'Not Allowed' });
            return;
        }
        AdminUsersService.BlockUser({ ...req.body, user_id: req.usr?.id ?? '' }).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
        })
    });
    Router.post('/allow', secureMiddleWare, (req: Request, res: Response) => {
        if (req.body == undefined || req.usr?.role !== UserRoleEnum.SA) {
            res.status(401).json({ message: 'Not Allowed' });
            return;
        }
        AdminUsersService.AllowUser({ ...req.body, user_id: req.usr?.id ?? '' }).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
        })
    });
}

