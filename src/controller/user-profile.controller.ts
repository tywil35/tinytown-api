
import express, { Request, Response } from 'express';
import { LogUtil } from '../utils/log.util';
import { JwtUtil } from '../utils/jwt.util';
import { UserProfileService } from '../service/user-profile.service';
import { UserUpdateAddressService } from '../service/user-update-address.service';
export namespace UserProfileController {
    export const PrefixRoute = '/ua';
    export const Router = express.Router();
    const secureMiddleWare = [express.json(), JwtUtil.AuthenticateToken];
    Router.get('/profile', secureMiddleWare, async (req: Request, res: Response) => {
        UserProfileService.UserProfile({ user_id: req.usr?.id ?? '' }).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
            return;
        })
    });
    Router.post('/profile/address', secureMiddleWare, async (req: Request, res: Response) => {
        if (req.body == undefined) {
            res.status(400).json({ message: 'nobody' });
            return;
        }
        const bdy: { user_id: string, address?: string } = req.body;
        bdy.user_id = req.usr?.id ?? '';
        UserUpdateAddressService.UserUpdateAddress(bdy).then(_res => {
            res.status(200).json(_res);
        }).catch(err => {
            LogUtil.warn(err.message);
            res.status(400).json({ message: err.message });
            return;
        })
    });
}

