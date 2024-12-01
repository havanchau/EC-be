import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { PayOSService } from '../payos/payos.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
        private productService: ProductService,
    ) { }

    async createCart(
        cartData: Partial<CreateCartDto>,
        userId: string,
    ): Promise<any> {

        const cart = {
            ...cartData,
            userId,
        };

        const newCart = new this.cartModel(cart);
        const result = await newCart.save();

        return { cart: result };
    }

    async getCarts(userId: string): Promise<any> {
        const carts = await this.cartModel
            .find({ userId: userId })
            .populate('userId')
            .exec();

        const results = [];

        carts.map(async (cart) => {
            const productIds = cart.items.map((item: any) => (item.productId as string));
            const products = await this.productService.findAll({ productIds: productIds });

            const productMap = cart.items.map((item: any) => ({
                productId: item.productId._id.toString(),
                quantity: item.quantity,
            }))

            const productsInfo = products.map((product: any) => {
                const orderDetail = productMap.find((item: any) => item.productId === product._id.toString());
                if (orderDetail) {
                    return {
                        ...product,
                        quantity: orderDetail.quantity,
                        totalPrice: orderDetail.quantity * product.price,
                    };
                }
                return product;
            });


            results.push({ cartInfo: cart, productInfo: productsInfo });

        })



        return results;
    }

    async getCartById(id: string): Promise<any> {
        const cart = await this.cartModel
            .findById(id)
            .populate('userId')
            .exec();
        if (!cart) {
            throw new NotFoundException(`Cart with ID ${id} not found`);
        }



        return cart;
    }

    async updateCart(id: string, cartData: Partial<CreateCartDto>): Promise<Cart> {
        const cart = await this.cartModel
            .findByIdAndUpdate(id, cartData)
            .exec();

        if (!cart) {
            throw new NotFoundException(`Cart with ID ${id} not found`);
        }

        return cart;
    }
}
