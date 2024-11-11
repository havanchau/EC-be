import { Controller, Get, Post, Param, Patch, Body, NotFoundException } from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.schema';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderData: Partial<Order>): Promise<Order> {
    return this.orderService.createOrder(orderData);
  }

  @Get()
  async getOrders(): Promise<Order[]> {
    return this.orderService.getOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(id, status);
  }
}
