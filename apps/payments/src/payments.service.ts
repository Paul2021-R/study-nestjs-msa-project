import { CreateChargeDto } from '@app/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
    if (!stripeSecretKey) {
      throw new Error(
        'Stripe secret key is not defined in the environment variables.',
      );
    }
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-04-30.basil',
    });
  }

  async createCharge({ amount }: CreateChargeDto) {
    try {
      // const paymentMethod = await this.stripe.paymentMethods.create({
      //   type: 'card',
      //   card: card,
      // });

      // const paymentIntent = await this.stripe.paymentIntents.create({
      //   amount: amount * 100,
      //   confirm: true,
      //   // payment_method_types: ['card'],
      //   currency: 'usd',
      //   payment_method: 'pm_card_visa',
      // });

      // return paymentIntent;
      const id = uuid();
      return {
        id
      }; // TODO: 내부 sandbox 결제 실패로 이렇게 대응
    } catch (error) {
      console.error('Error creating charge:', error.status);
      console.error('Error creating charge:', error.stack);
      console.error('Error creating charge:', error);
      throw new Error('Failed to create charge');
    }
  }
}
