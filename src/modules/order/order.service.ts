import { VoucherService } from './../voucher/voucher.service';
import { ProductService } from './../product/product.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { PayOSService } from '../payos/payos.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentStatus } from '../../enum/index';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private readonly paymentService: PayOSService,
    private readonly productService: ProductService,
    private readonly voucherService: VoucherService,
  ) {}

  async createOrder(
    orderData: Partial<CreateOrderDto>,
    userId: string,
  ): Promise<any> {
    const { voucherCode, ...orderInfo } = orderData;


    const totalAmount = orderData.items.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);

    let price = totalAmount;

    if (voucherCode) {
      const voucher = await this.voucherService.get(voucherCode);

      const res = await this.voucherService.applyVoucher(voucherCode);

      if (!res) {
        throw new HttpException('Voucher invalid', HttpStatus.BAD_REQUEST);
      }
      const discountPrice =
        totalAmount * voucher.discount < voucher.maxDiscountPrice
          ? totalAmount * voucher.discount
          : voucher.maxDiscountPrice;

      price = totalAmount - discountPrice;
    }

    const order = {
      ...orderInfo,
      userId,
      orderDate: new Date(),
      totalAmount,
    };

    orderData.items.map(async (item) => {
      try {
        const product = await this.productService.findOne(item.productId);

        if (item.quantity > product.product.stock) {
          throw new HttpException(
            `Don't have enough product`,
            HttpStatus.BAD_REQUEST,
          );
        }

        const newStock = product.product.stock - item.quantity;

        const res = await this.productService.update(item.productId, {
          stock: newStock,
        });

        if (!res) {
          throw new HttpException(
            'Updated product stock failed',
            HttpStatus.BAD_REQUEST,
          );
        }
      } catch (err) {
        return err;
      }
    });

    const newOrder = new this.orderModel(order);
    const result = await newOrder.save();

    const paymentInfo = await this.paymentService.createPayment(
      result._id as string,
      price,
    );

    result.paymentInfo = JSON.stringify(paymentInfo);

    await result.save();

    return { order: result };
  }

  async getOrders(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ userId: userId })
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

    const paymentInfo = JSON.parse(order?.paymentInfo);
    const orderCode = paymentInfo.orderCode;
    const status = order.paymentStatus;

    if (status === PaymentStatus.PENDING && orderCode) {
      const paymentStatus = await this.paymentService.getPaymentInfo(orderCode);
      const updateStatus = paymentStatus?.status;

      if (updateStatus === 'PAID') {
        Object.assign(order, { ...order, status: PaymentStatus.PAID });
        await order.save();
      }
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
