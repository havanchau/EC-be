import { Controller, Get, Post, Param, Patch, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { Cart } from './cart.schema';
import { CreateCartDto } from './dto/create-cart.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentUser } from '../../decorators/userdata.decorator';

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

  @ApiOperation({ summary: 'Get all carts' })
  @ApiResponse({ status: 200, description: 'Retrieved all carts.' })
  @Get()
  async getCarts(@CurrentUser() user: any): Promise<Cart[]> {
    return this.cartService.getCarts(user.sub);
  }

  @ApiOperation({ summary: 'Get an cart by ID' })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiResponse({ status: 200, description: 'Cart found.' })
  @ApiResponse({ status: 404, description: 'Cart not found.' })
  @Get(':id')
  async getCartById(@Param('id') id: string): Promise<Cart> {
    return this.cartService.getCartById(id);
  }

  @ApiOperation({ summary: 'Update an cart' })
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @ApiBody({ description: 'Cart status', schema: { type: 'string' } })
  @ApiResponse({ status: 200, description: 'Cart status updated.' })
  @Patch(':id')
  async updateCartStatus(
    @Param('id') id: string,
    @Body() cartData: CreateCartDto,
  ): Promise<Cart> {
    return this.cartService.updateCart(id, cartData);
  }
}
