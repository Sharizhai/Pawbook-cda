import {IEmailServices} from "$domain/interfaces/emailServices.interface";
import {welcomeEmail} from "$infrastructure/mailing/templates/newAccountTemplate";
import {emailConfig} from "$config/nodemailer";

export class NodemailerEmailServices implements IEmailServices {
    constructor() {}

    async sendConfirmationEmail(email: string, userFirstName: string, userId: string): Promise<void> {
        try {
            const emailTemplate = welcomeEmail(userFirstName, userId);

            await emailConfig.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: emailTemplate.subject,
                html: emailTemplate.html,
            });
            console.log(`[Nodemailer] Sending confirmation email to ${email} to ${userFirstName}`);
        } catch (error) {
            console.error(`[Nodemailer] Error sending mail :`, error);
            throw new Error("[Nodemailer] Error sending mail");
        }
    }
}