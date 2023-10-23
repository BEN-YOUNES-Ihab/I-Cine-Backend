import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { PayementService } from './payement.service';
import { Request, Response } from 'express';
import { queryCheckoutDto } from './dtos/payment.dto';

@Controller('payement')
export class PayementController {
  constructor(private payementService: PayementService) {}

  @Get('create-checkout')
  createCheckout(@Query() queryCheckoutDto: queryCheckoutDto) {
    return this.payementService.createCheckout(queryCheckoutDto);
  }
  @Get('success-payment-handler')
  successPaymentHandler(@Req() req: Request, @Res() res: Response) {
    return this.payementService.successPaymentHandler(req, res);
  }
}
