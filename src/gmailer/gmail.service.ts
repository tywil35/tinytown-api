import { EnvUtil } from '../utils';
import { LogUtil } from '../utils/log.util';
import nodemailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';

export interface MailDetail {
    from: string,
    bcc?: string,
    to: string,
    subject: string,
    html: string,
    data?: Record<string, string>
}
export namespace GmailService {
    const readHTMLFile = function (path: string, callback: (err: Error | null, html?: string) => void) {
        fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
            if (err) {
                callback(err);
                throw err;
            }
            else {
                callback(null, html);
            }
        });
    };
    const transporter = nodemailer.createTransport({
        host: EnvUtil.MAILER_HOST,
        port: EnvUtil.MAILER_PORT,
        secure: true, // true for 465, false for other ports 587
        auth: {
            user: EnvUtil.MAILER_USER,
            pass: EnvUtil.MAILER_PSWRD,
        },
    });
    export const SendMail = async (mail: MailDetail): Promise<void> => {
        try {
            readHTMLFile(mail.html, function (err, html) {
                if (err != null) { throw err; }
                const template = handlebars.compile(html);
                const htmlToSend = template(mail.data);
                mail.html = htmlToSend;
                transporter.sendMail(mail, function (err, data) {
                    if (err) {
                        LogUtil.error(err);
                    } else {
                        LogUtil.info('Email Sent', data);
                    }
                });
            });
        } catch (error) {
            LogUtil.error(error);
        }
    };
}