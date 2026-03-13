import {IEmailServices} from "$domain/interfaces/emailServices.interface";

export class InMemoryEmailServices implements IEmailServices {
    public sentEmails: { email: string; firstName: string, id: string }[] = [];

    async sendConfirmationEmail(email: string, firstName: string, id: string): Promise<void> {
        this.sentEmails.push({ email, firstName, id });
    }
}