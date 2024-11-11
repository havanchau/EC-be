import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PayOSService {
  private baseUrl = process.env.PAYOS_BASE_URL;
  private apiKey = process.env.PAYOS_API_KEY;

  async createPayment(orderId: string, amount: number): Promise<string> {
    const response = await axios.post(
      `${this.baseUrl}/payments`,
      { orderId, amount },
      { headers: { Authorization: `Bearer ${this.apiKey}` } }
    );

    return response.data.paymentUrl;
  }

}
