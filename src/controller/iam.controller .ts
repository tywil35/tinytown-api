
import express, { Request, Response } from 'express';
import { JwtUtil } from '../utils/jwt.util';
import { Staff, UserRoleEnum } from '../mysql/model/user.model';
export namespace IamController {
    export const PrefixRoute = '/iam';
    export const Router = express.Router();
    const secureMiddleWare = [express.json(), JwtUtil.AuthenticateToken];
    Router.get('/admin', secureMiddleWare, (req: Request, res: Response) => {
        const _role = req.usr?.role;
        if (_role == undefined) { res.status(200).json(false); }
        res.status(200).json({ iam: UserRoleEnum.SA === _role });
    });
    Router.get('/staff', secureMiddleWare, (req: Request, res: Response) => {
        const _role = req.usr?.role;
        if (_role == undefined) { res.status(200).json(false); }
        res.status(200).json({ iam: Staff.includes(_role as UserRoleEnum) });
    });
}

