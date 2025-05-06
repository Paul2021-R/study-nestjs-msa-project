import { CreateChargeDto, NOTIFICATIONS_SERVICE } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import Stripe from 'stripe';
import { v4 as uuid } from 'uuid';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsService: ClientProxy,
  ) {
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

  async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
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
      await this.notificationsService.emit('notify_email', {
        email,
        text: `Heyyyy you've got something`,
      });
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
