import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { Role } from 'src/decorators/roles.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('vouchers')
@ApiTags('Vouchers')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @Post('create')
  @Role('admin', 'saler')
  @ApiOperation({ summary: 'Create a new voucher' })
  @ApiResponse({ status: 201, description: 'Voucher created successfully.' })
  @ApiResponse({ status: 400, description: 'Voucher code already exists.' })
  async createVoucher(
    @Body() vouchersData: CreateVoucherDto[],
  ) {
    return this.voucherService.createVoucher(vouchersData);
  }

  @Public()
  @Get('')
  @ApiOperation({ summary: 'Get all active vouchers' })
  async getActiveVouchers() {
    return this.voucherService.getActiveVouchers();
  }
}
