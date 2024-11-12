import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PayOS = require("@payos/node");

@Injectable()
export class PayOSService {
  private payos: PayOS;

  constructor(private configService: ConfigService) {
    this.payos = new PayOS(
      this.configService.get<string>('CLIENT_KEY'),
      this.configService.get<string>('API_KEY'),
      this.configService.get<string>('CHECKSUM_KEY'),
    );
  }

  async createPayment(orderId: string, amount: number): Promise<string> {
    const orderCode = Math.floor(Math.random() * 9007199254740991);

    const paymentLink = await this.payos.createPaymentLink({
      amount: amount,
      description: 'Thanh toan phi mua hang',
      orderCode: orderCode,
      returnUrl: `${this.configService.get<string>('DOMAIN')}/result`,
      cancelUrl: `${this.configService.get<string>('DOMAIN')}/result`,
    });

    return paymentLink.checkoutUrl;
  }

  async getPaymentInfo(code: string): Promise<any> {
    if (!code) {
      throw new Error('Invalid payment code');
    }

    try {
      const paymentInfo = await this.payos.getPaymentLinkInformation(code);
      return paymentInfo;
    } catch (error) {
      console.error('Error fetching payment information:', error);
      throw new Error('Failed to fetch payment information');
    }
  }
}
