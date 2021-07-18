import { injectable } from "inversify";
import nodemailer from "nodemailer"
import "reflect-metadata";

@injectable()
export class MailService {
  public async sendMail({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    try {
      let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
      });

      await transporter.sendMail({
        from: `"Mikolaj.dk" <${process.env.MAIL_FROM}>`,
        to,
        subject,
        html,
      });

      return true;
    } catch (e) {
      console.log(e.message);
      return false;
    }
  }
}
