import { IsNumber } from 'class-validator';
import Stripe from 'stripe';

export class CreateChargeDto {
  card: Stripe.PaymentMethodCreateParams.Card;

  @IsNumber()
  amount: number;
}
