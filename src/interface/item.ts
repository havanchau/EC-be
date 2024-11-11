import { Types } from 'mongoose';

export class Item {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}
