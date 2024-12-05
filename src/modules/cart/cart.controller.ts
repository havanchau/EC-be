import { Controller, Get, Post, Param, Patch, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { Cart } from './cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../decorators/userdata.decorator';
import { User } from '../user/user.schema';
import { Public } from 'src/decorators/public.decorator';

@ApiTags('carts')
@UseGuards(AuthGuard)
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Create a new cart' })
  @ApiBody({ description: 'Cart data', type: CreateCartDto })
  @ApiResponse({ status: 201, description: 'Cart successfully created.' })
  @Post()
  async createCart(@CurrentUser() user: any, @Body() cartData: CreateCartDto): Promise<any> {
    return this.cartService.createCart(cartData, user.sub);
  }

  @ApiOperation({ summary: 'Get an cart by ID' })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiResponse({ status: 200, description: 'Cart found.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @Get()
  async getCart(@CurrentUser() user: any): Promise<Cart> {
    return this.cartService.getCart(user.sub);
  }

  @Public()
  @ApiOperation({ summary: 'Get an cart by ID' })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiResponse({ status: 200, description: 'Cart found.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @Get('details')
  async getCartDetails(@Body('items') items: { productId: string; quantity: number }[]): Promise<any> {
    return this.cartService.getCartDetails(items);
  }

}
