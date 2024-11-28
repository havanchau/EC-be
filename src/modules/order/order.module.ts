import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { Order, OrderSchema } from './order.schema';
import { PayOSService } from '../payos/payos.service';
import { ProductModule } from '../product/product.module';
import { ProductService } from '../product/product.service';
import { VoucherModule } from '../voucher/voucher.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductModule,
    VoucherModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, PayOSService],
  exports: [OrderService],
})
export class OrderModule {}
