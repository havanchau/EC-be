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
        const oldCart = await this.cartModel
            .findOne({ userId })
            .populate('userId')
            .exec();

        let cart = null;

        if (oldCart) {
            Object.assign(oldCart, cartData);

            const updatedCart = await oldCart.save();

            cart = updatedCart
        } else {
            const newCart = new this.cartModel({
                ...cartData,
                userId,
            });

            const result = await newCart.save();
            cart = result
        }


        const productIds = cart?.items.map((item: any) => (item.productId as string));
        const products = await this.productService.findAll({ productIds: productIds });

        const productMap = cart?.items.map((item: any) => ({
            productId: item.productId.toString(),
            quantity: item.quantity,
        }))

        const productsInfo = await this.getCartDetails(productMap);

        return { cart, productsInfo };
    }

    async getCart(userId: string): Promise<any> {
        const cart = await this.cartModel
            .findOne({ userId: userId })
            .populate('userId')
            .exec();

        const productIds = cart?.items.map((item: any) => (item.productId as string));
        const products = await this.productService.findAll({ productIds: productIds });

        const productMap = cart.items.map((item) => ({
            productId: item.productId.toString(),
            quantity: item.quantity,
        }));
    
        const productsInfo = await this.getCartDetails(productMap);
        return { cart, productsInfo };
    }


    async getCartDetails(items: { productId: string; quantity: number }[]): Promise<any> {
        const productIds = items.map((item) => item.productId);
    
        const products = await this.productService.findAll({ productIds });
    
        if (!products || !products.results || products.results.length === 0) {
            throw new NotFoundException('No products found for the provided IDs.');
        }
    
        const productMap = new Map<string, { quantity: number }>();
        items.forEach((item) => {
            productMap.set(item.productId, { quantity: item.quantity });
        });
    
        const productsInfo = products.results.map((product: any) => {
            const productDetails = productMap.get(product._id.toString());
    
            if (!productDetails) {
                return null;
            }
    
            return {
                ...product._doc,
                quantity: productDetails.quantity,
                totalPrice: productDetails.quantity * product.price,
            };
        }).filter(Boolean);
    
        return { items: productsInfo };
    }
    
}
