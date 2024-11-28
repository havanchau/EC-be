import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart.schema';
import { PayOSService } from '../payos/payos.service';
import { CreateCartDto } from './dto/create-cart.dto';

@Injectable()
export class CartService {
    constructor(
        @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
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

    async getCarts(userId: string): Promise<Cart[]> {
        return this.cartModel
            .find({ userId: userId })
            .populate('userId')
            .exec();
    }

    async getCartById(id: string): Promise<Cart> {
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
