import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { EmailService } from 'src/email/email.service';
import Stripe from 'stripe';

export const HAS_STOCK = true;

@Injectable()
export class PayementService {
  private stripe: Stripe = new Stripe(
    'sk_test_51O2UBEJfd7lFqFGV1hW7SA3lj0PXiNG99JUqI8IU0WfFdOxpWFQYF1hMvqTONSgmg3W3BSzhOlNQsjzQUEMReULI00EQdUzE4z',
    { apiVersion: '2023-10-16' },
  );
  constructor(private emailService: EmailService) {}
  async createCheckout() {
    const YOUR_DOMAIN = 'http://localhost:3000';
    const product = await this.stripe.products.create({
      name: 'Tezezeze',
    });
    const price = await this.stripe.prices.create({
      product: product.id,
      currency: 'eur',
      unit_amount: 3900000,
    });
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      payment_intent_data: {
        capture_method: 'manual',
      },
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/payement/success-payment-handler?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/fail.html`,
    });
    return {
      url: session.url,
    };
  }

  async successPaymentHandler(req: Request, res: Response) {
    const session_id = req.query.session_id;
    const session = await this.stripe.checkout.sessions.retrieve(
      session_id as string,
    );

    if (HAS_STOCK) {
      const paymentIntent = await this.stripe.paymentIntents.capture(
        session.payment_intent as string,
      );

      if (paymentIntent.status == 'succeeded') {
        console.log(session.customer_details.email);
        this.emailService.send(
          session.customer_details.email,
          "Merci pour l'achat !",
          `Bonjour ${
            session.customer_details.name
          }, Merci pour votre achat d'une valeur de ${
            session.amount_total / 100
          } euros`,
        );
        res.redirect('http://localhost:4200/pages/basket-success.html');
        return;
      }
    } else {
      const paymentIntent = await this.stripe.paymentIntents.cancel(
        session.payment_intent as string,
      );
      if (paymentIntent.status == 'canceled') {
        res.redirect('http://localhost:4200/basket-fail-stock.html');
        return;
      }
    }
    res.redirect('http://localhost:4200/basket-fail.html');
    return;
  }
}
