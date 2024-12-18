import { Injectable, BadRequestException, HttpStatus } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Voucher } from './voucher.schema';
import { CreateVoucherDto } from './dto/create-voucher.dto';

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel('Voucher') private readonly voucherModel: Model<Voucher>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createVoucher(vouchersData: CreateVoucherDto[]): Promise<Voucher[]> {
    const results = [];
    vouchersData.map(async (item) => {
      const newVoucher = new this.voucherModel(item);
      results.push(await newVoucher.save());
    });
    return results;
  }

  async applyVoucher(code: string): Promise<{ message: string }> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const voucher = await this.voucherModel
        .findOne({ code })
        .session(session);

      if (!voucher || !voucher.isActive) {
        throw new BadRequestException('Invalid or inactive voucher');
      }

      if (voucher.currentUsage >= voucher.maxUsage) {
        throw new BadRequestException('Voucher usage limit reached');
      }

      const updatedVoucher = await this.voucherModel.findOneAndUpdate(
        {
          _id: voucher._id,
          currentUsage: { $lt: voucher.maxUsage },
        },
        { $inc: { currentUsage: 1 } },
        { new: true, session },
      );

      if (!updatedVoucher) {
        throw new BadRequestException('Voucher usage limit reached');
      }

      await session.commitTransaction();
      session.endSession();

      return { message: 'Voucher applied successfully' };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getActiveVouchers(): Promise<Voucher[]> {
    return this.voucherModel.find({ isActive: true }).sort({ createdAt: -1 });
  }

  async get(code: string): Promise<any> {
    try {
      const filter: any = {};

      filter.code = { $regex: code, $options: 'i' };
      const results = await this.voucherModel.find(filter).exec();
      return results;
    } catch (err) {
      return {
        msg: 'Error while fetching voucher',
        error: err.message,
      };
    }
  }
}
