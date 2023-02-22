import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { EnvUtil } from './env.util';
import { UserJwt } from '../interface/user-jwt.interface';
export namespace JwtUtil {
    export const GenerateAccessToken = (usr: UserJwt) => {
        const _jwt = jwt.sign(usr, EnvUtil.JWT_SECRET, { expiresIn: EnvUtil.JWT_EXPIRE_TIME });
        return { access_token: _jwt };
    }

    export const AuthenticateToken = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) { res.status(401).json({ message: 'token missing' }); return; }
        jwt.verify(token, EnvUtil.JWT_SECRET, (err: any, decoded: any) => {
            if (err) return res.status(418).json({ message: 'error verifying jwt' });
            req.usr = decoded
            next()
        })
    }
    export const AuthenticateTokenButAllow = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null || token == undefined) { next(); return; }
        jwt.verify(token, EnvUtil.JWT_SECRET, (err: any, decoded: any) => {
            if (err) { next(); return; }
            req.usr = decoded
            next()
        })
    }
}

