import nodemailer from "nodemailer";
import { appConfig } from "../../core/settings/settings";
import { injectable } from "inversify";
@injectable()
export class NodemailerService {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => { html: string; subject: string },
  ) {
    const { html, subject } = template(code); // Извлекаем тему и HTML из шаблона

    const transporter = nodemailer.createTransport({
      host: appConfig.SMTP_SERVER, // SMTP-сервер Яндекса
      port: 465, // Порт для SSL
      secure: true, // Использовать SSL
      auth: {
        user: appConfig.YANDEX_EMAIL, // Ваш email
        pass: appConfig.YANDEX_PASSWORD, // Ваш пароль или пароль приложения
      },
    });

    await transporter.sendMail({
      from: "BloggerPlatform <senorian2@yandex.by>",
      to: email,
      subject,
      html,
    });
  }
}
