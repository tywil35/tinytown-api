
import { RegisterUserService } from '../service/register-user.service';
import express, { Request, Response } from 'express';
import { LogUtil } from '../utils/log.util';
import { RegisterEmployeeService } from '../service/register-employee.service';
import { LoginUserService } from '../service/login-user.service';
import { JwtUtil } from '../utils/jwt.util';
import { UserRoleEnum } from '../mysql/model/user.model';
import { ForgotPasswordService } from '../service/forgot-password.service';
export namespace UserAccessController {
    export const PrefixRoute = '/ua';
    export const Router = express.Router();
    const middleWare = [express.json()];
    const secureMiddleWare = [express.json(), JwtUtil.AuthenticateToken];
    Router.post('/register', middleWare, (req: Request, res: Response) => {
        if (req.body == undefined) {
            res.status(400).json({ message: 'nobody' });
            return;
        }
        RegisterUserService.RegisterUser(req.body).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
            return;
        })
    });
    Router.post('/register-employee', secureMiddleWare, async (req: Request, res: Response) => {
        if (req.body == undefined || req.usr?.role !== UserRoleEnum.SA) {
            res.status(401).json({ message: 'not allowed' });
            return;
        }
        await RegisterEmployeeService.RegisterEmployee(req.body).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
        })
    });
    Router.post('/login', middleWare, async (req: Request, res: Response) => {
        if (req.body == undefined) {
            res.status(400).json({ message: 'nobody' });
            return;
        }
        try {
            const access_token = await LoginUserService.LoginUser(req.body);
            res.status(201).json(access_token);
        } catch (error: any) {
            LogUtil.warn(error.message);
            res.status(400).json({ message: 'Credentials incorrect' });
        }
    });
    Router.post('/forgot-password', middleWare, async (req: Request, res: Response) => {
        if (req.body == undefined) {
            res.status(400).json({ message: 'nobody' });
            return;
        }
        try {
            const message = await ForgotPasswordService.CreateForgotPasswordRecord(req.body);
            res.status(200).json(message);
        } catch (error: any) {
            LogUtil.warn(error.message);
            res.status(400).json({ message: error.message });
        }
    });
    Router.post('/forgot-password/update', middleWare, async (req: Request, res: Response) => {
        if (req.body == undefined) {
            res.status(400).json({ message: 'nobody' });
            return;
        }
        try {
            const message = await ForgotPasswordService.ValidateForgotPasswordRecordAndUpdateUser(req.body);
            res.status(200).json(message);
        } catch (error: any) {
            LogUtil.warn(error.message);
            res.status(400).json({ message: error.message });
        }
    });
    Router.get('/update', secureMiddleWare, (req: Request, res: Response) => {
        if (req.usr == undefined) { res.status(400).json({ message: 'Invalid Access Token' }); return; }
        const access_token = JwtUtil.GenerateAccessToken({ id: req.usr?.id ?? '', role: req.usr?.role ?? 4, goa: req.usr?.goa ?? false, email: req.usr.email });
        res.status(201).json(access_token);
    });
}

