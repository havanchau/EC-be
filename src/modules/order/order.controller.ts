import { Controller, Get, Post, Param, Patch, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Order } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../decorators/userdata.decorator';

@ApiTags('orders')
@UseGuards(AuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ description: 'Order data', type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Order successfully created.' })
  @Post()
  async createOrder(@CurrentUser() user: any, @Body() orderData: CreateOrderDto): Promise<any> {
    return this.orderService.createOrder(orderData, user.sub);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Retrieved all orders.' })
  @Get()
  async getOrders(@CurrentUser() user: any): Promise<Order[]> {
    return this.orderService.getOrders(user.sub);
  }

  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order found.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }

  @ApiOperation({ summary: 'Update an order status' })
  @ApiParam({ name: 'id', description: 'Order ID' })
  @ApiBody({ description: 'Order status', schema: { type: 'string' } })
  @ApiResponse({ status: 200, description: 'Order status updated.' })
  @Patch(':id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ): Promise<Order> {
    return this.orderService.updateOrderStatus(id, status);
  }
}
