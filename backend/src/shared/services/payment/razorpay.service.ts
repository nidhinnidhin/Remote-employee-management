import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';

@Injectable()
export class RazorpayService {
  private razorpay: Razorpay;
  private readonly logger = new Logger(RazorpayService.name);

  constructor(private configService: ConfigService) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (!keyId || !keySecret) {
      this.logger.warn('Razorpay credentials missing. Payment features will fail.');
    }

    this.razorpay = new Razorpay({
      key_id: keyId || 'placeholder',
      key_secret: keySecret || 'placeholder',
    });
  }

  async createOrder(amount: number, currency: string = 'INR', receipt: string) {
    try {
      const options = {
        amount: amount * 100, 
        currency,
        receipt,
      };
      return await this.razorpay.orders.create(options);
    } catch (error) {
      this.logger.error('Failed to create Razorpay order', error);
      throw error;
    }
  }

  verifyPayment(orderId: string, paymentId: string, signature: string): boolean {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', this.configService.get<string>('RAZORPAY_KEY_SECRET'));
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
  }
}
