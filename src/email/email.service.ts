import { Injectable } from '@nestjs/common';
import * as FormData from 'form-data';
import Mailgun from 'mailgun.js';
@Injectable()
export class EmailService {
  private mailgun: Mailgun = new Mailgun(FormData);
  private client = this.mailgun.client({
    username: 'api',
    key: '26fcf88ae4dce1eb3f28dacaaed541a5-3750a53b-b75eac2e',
  });
  send(toEmail: string, subject: string, content: string) {
    this.client.messages.create(
      'sandbox2679cc06974540ba95aa117513a54a73.mailgun.org',
      {
        from: 'Tesla Shop <achattesla@sandbox2679cc06974540ba95aa117513a54a73.mailgun.org>',
        to: [toEmail],
        subject: subject,
        text: content,
        html: '<h1>Testing some Mailgun awesomeness!</h1> <br> <img src="https://raw.githubusercontent.com/WendyAlph/testImage/main/TESLA-MODEL3-2023.webp" alt="Random first slide"/> <br> <p>Testa</p>',
      },
    );
  }
}
