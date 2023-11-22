import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';
import { queryCheckoutDto } from './dtos/payment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from 'src/email/email.service';

export const HAS_STOCK = true;

@Injectable()
export class PayementService {
  private stripe: Stripe = new Stripe(
    'sk_test_51O2URIG1GoQo03KTsGyHuaaVoe2lPwATH3f9hU8RyhlVp2NYVZhKc93VEHW4R8zz10pNOmNXXlANEcZ8w6EycgI200mvroSvYK',
    { apiVersion: '2023-10-16' },
  );

  constructor(
    private prismaService: PrismaService,
    private emailService: EmailService,
  ) {}

  async createCheckout(queryCheckoutDto: queryCheckoutDto) {
    const { places, sessionIdFront, userId } = queryCheckoutDto;
    const product = await this.stripe.products.create({
      name: 'Ticket',
    });
    const price = await this.stripe.prices.create({
      product: product.id,
      currency: 'eur',
      unit_amount: 1000,
    });
    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price: price.id,
          quantity: +places,
        },
      ],
      payment_intent_data: {
        capture_method: 'manual',
      },
      mode: 'payment',
      success_url: `${process.env.DOMAIN}payement/success-payment-handler?session_id={CHECKOUT_SESSION_ID}&sessionIdFront=${sessionIdFront}&places=${places}&userId=${userId}`,
      cancel_url: `http://localhost:4200/pages/${sessionIdFront}/order?status=fail`,
    });
    return {
      url: session.url,
    };
  }

  async successPaymentHandler(req: Request, res: Response) {
    //get req query values
    const sessionIdFront = +req.query.sessionIdFront;
    const places = +req.query.places;
    const userId = +req.query.userId;
    const session_id = req.query.session_id;
    //get Stripe sessionId
    const session = await this.stripe.checkout.sessions.retrieve(
      session_id as string,
    );
    //get Movie session
    const currentSession = await this.prismaService.session.findUnique({
      where: {
        id: sessionIdFront,
      },
      include: { movie: true },
    });
    //get new remaning places
    const newremaningPlaces = currentSession.remaningPlaces - places
    // if in stock
    if (newremaningPlaces >= 0) {
      const paymentIntent = await this.stripe.paymentIntents.capture(
        session.payment_intent as string,
      );
      if (paymentIntent.status == 'succeeded') {


         // create an order
         const order = await this.prismaService.order.create({
          data:{ 
              places: places,
              amount: ( 10*places ),
              sessionId: sessionIdFront,
              userId: userId,
          }
          });
          // modifier remaningPlaces
          await this.prismaService.session.update({
            where: {
              id: sessionIdFront,
            },
            data: {
              remaningPlaces: newremaningPlaces,
            },
          });
          // send email
          const reservationDetails = {
              filmName: currentSession.movie.title,
              date: currentSession.date,
              nombreBillets: places,
              numeroReservation: order.id,
              nomClient:session.customer_details.name
            };
            let emailDate = new Date(reservationDetails.date).toLocaleDateString('fr-FR', { weekday:"long", year:"numeric", month:"short", day:"numeric", hour:"numeric", minute:"numeric"}) 
            const emailContent = `
              Cher(e) ${reservationDetails.nomClient},<br>
              <br>
              Nous vous confirmons la réservation suivante chez I-Ciné :<br>
              <br>
              - Film : ${reservationDetails.filmName}<br>
              - Date : ${emailDate}<br>
              - Billets réservés : ${reservationDetails.nombreBillets}<br>
              <br>
              Numéro de Réservation : ${reservationDetails.numeroReservation}<br>
              <br>
              Nous sommes impatients de vous accueillir pour cette séance. Veuillez vous présenter au cinéma au moins 30 minutes avant le début de la séance.
              <br>
              Pour toute question ou assistance, contactez-nous au 0632323454.<br>
              <br>
              Merci de choisir I-Ciné pour votre sortie cinéma.
            `;
        //redirect
        await this.emailService.sendEmail(
          emailContent,
          session.customer_details.email,
        );

        res.redirect(
          `http://localhost:4200/pages/${sessionIdFront}/order?status=success&orderId=${order.id}`,
        );
        return;
      }
    } else {
      const paymentIntent = await this.stripe.paymentIntents.cancel(
        session.payment_intent as string,
      );
      if (paymentIntent.status == 'canceled') {
        res.redirect(
          `http://localhost:4200/pages/${sessionIdFront}/order?status=fail-stock`,
        );
        return;
      }
    }
    res.redirect(
      `http://localhost:4200/pages/${sessionIdFront}/order?status=fail`,
    );
    return;
  }
}
