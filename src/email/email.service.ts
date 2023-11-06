import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  getHello(): string {
    return 'Hello World!';
  }

  public sendEmail(emailContent, toEmail): void {
    this;
    this.mailerService
      .sendMail({
        to: toEmail, // Adresse e-mail du destinataire
        from: 'ben.younes.ihab3@gmail.com', // Votre adresse e-mail
        subject: 'Confirmation de Réservation I-Ciné ✔',
        text: 'Confirmation de réservation au cinéma', // Corps de l'e-mail en texte brut
        html: emailContent, // Contenu HTML de l'e-mail
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
