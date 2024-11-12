import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { PayOSService } from '../payos/payos.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private paymentService: PayOSService,
  ) {}

  async createOrder(orderData: Partial<Order>): Promise<any> {
    const newOrder = new this.orderModel(orderData);
    const totalPrice = orderData.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    const result = await newOrder.save();

    const paymentUrl = this.paymentService.createPayment(
      result._id as string,
      totalPrice,
    );
    return { order: result, paymentUrl: paymentUrl };
  }

  async getOrders(): Promise<Order[]> {
    return this.orderModel
      .find()
      .populate('userId')
      .populate('items.productId')
      .exec();
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderModel
      .findById(id)
      .populate('userId')
      .populate('items.productId')
      .exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const order = await this.orderModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
}
