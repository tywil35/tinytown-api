import { LogUtil } from "../utils/log.util";
import { EnvUtil, HashedPassword, HashPasswordUtil } from "../utils";
import { UserService } from "../mysql/service/user.service";
import { StringEmptyUtil } from "../utils/string-empty.utl";
import { ForgotPasswordRecordService } from "../mysql/service/forgot-password-record.service";
import { GmailService } from "../gmailer/gmail.service";

export namespace ForgotPasswordService {
    export type Request = { email: string, forgot_token?: string, psswrd?: string };
    export type Response = { message: string };
    const userService = new UserService();
    const service = new ForgotPasswordRecordService();
    const validateRequest = (data: Request): string => {
        const validation_errors = [];
        if (StringEmptyUtil.Is(data.email)) {
            validation_errors.push('email missing');
        }
        return validation_errors.join(', ');
    }
    export const CreateForgotPasswordRecord = async (user: Request): Promise<Response> => {
        DeleteForgotPasswordRecordOlderThan24Hours();
        const validation_errors = validateRequest(user);
        LogUtil.info('validation_errors', validation_errors);
        if (validation_errors != '') { throw Error(validation_errors); }
        const usr_xst = await userService.findUserByEmail(user.email);
        if (!usr_xst) { throw Error(`Wrong stuff`); }
        const xst = await service.findForgotPasswordRecordByUser(usr_xst.id ?? '');
        if (xst) {
            await service.deleteForgotPasswordRecord(xst.forgot_token ?? '');
        }
        const forgotpassword_token = await service.createForgotPasswordRecord(usr_xst.id ?? '');
        const message = `Password reset sent to ${user.email}, check inbox and follow the instructions`;
        await GmailService.SendMail({ from: EnvUtil.MAILER_USER, to: usr_xst.email, subject: 'Forgot Password Tiny Town', html: `${EnvUtil.MAILER_TEMPLATES_PATH}/forgotpassword.html`, data: { 'USERNAME': usr_xst.username, 'LINK': `${EnvUtil.MAILER_FORGOT_PASSWORD_LINK}?token=${forgotpassword_token.forgot_token}` } })
        return { message };
    }
    export const ValidateForgotPasswordRecordAndUpdateUser = async (user: Request): Promise<Response> => {
        const validation_errors = validateRequest(user);
        LogUtil.info('validation_errors', validation_errors);
        if (validation_errors != '') { throw Error(validation_errors); }
        const usr_xst = await userService.findUserByEmail(user.email);
        if (!usr_xst) { throw Error('Wrong stuff'); }
        const xst = await service.findForgotPasswordRecord(user.forgot_token ?? '', usr_xst.id ?? '');
        if (!xst) {
            throw Error('Something wrong with request, check email and follow instructions');
        }
        const hashed: HashedPassword = await HashPasswordUtil.HashPassword(user.psswrd ?? '');
        usr_xst.pswrd_hash = hashed.hash;
        usr_xst.pswrd_salt = hashed.salt;
        userService.setUserId(usr_xst.id ?? '');
        await userService.updateUser(usr_xst);
        const message = `Password reset for ${user.email}.`;
        service.deleteForgotPasswordRecord(user.forgot_token ?? '');
        return { message };
    }
    export const DeleteForgotPasswordRecordOlderThan24Hours = async (): Promise<Response> => {
        await service.deleteForgotPasswordRecordOlderThan24Hours();
        return { message: 'deleted records' };
    }
}
