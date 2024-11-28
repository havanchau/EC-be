import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import PayOS = require('@payos/node');
import { DOMAIN } from '../../contranst';

@Injectable()
export class PayOSService {
  private payos: PayOS;

  constructor(private configService: ConfigService) {
    this.payos = new PayOS(
      process.env.CLIENT_ID,
      process.env.PAYOS_API_KEY,
      process.env.PAYOS_CHECKSUM_KEY,
    );
  }

  async createPayment(orderId: string, amount: number): Promise<any> {
    try {
      const orderCode = Math.floor(Math.random() * 900719925);

      const body = {
        amount: Math.round(amount),
        description: 'Thanh toan phi mua hang',
        orderCode: orderCode,
        returnUrl: `${DOMAIN}/order/${orderId}`,
        cancelUrl: `${DOMAIN}/order/${orderId}`,
      };
  
      const paymentLink = await this.payos.createPaymentLink(body);

      return paymentLink;
    } catch (err) {
      console.log(err);
    }
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
