
import express, { Request, Response } from 'express';
import { EnvUtil } from '../utils';

export namespace HealthCheckController {
    export const PrefixRoute = 'health';
    export const Router = express.Router();
    const middleWare = [express.json()];
    Router.get('/check', middleWare, (_: Request, res: Response) => {
        const health_status = {
            apiName: EnvUtil.API_NAME,
            version: EnvUtil.VERSION,
        }
        res.send(health_status)
    });
    Router.get('/', (_: Request, res: Response) => {
        res.sendStatus(200);
    });
}