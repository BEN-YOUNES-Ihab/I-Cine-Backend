import { Controller, Get, Req, Res } from '@nestjs/common';
import { PayementService } from './payement.service';
import { Request, Response } from 'express';

@Controller('payement')
export class PayementController {
  constructor(private payementService: PayementService) {}

  @Get('create-checkout')
  createCheckout() {
    return this.payementService.createCheckout();
  }
  @Get('success-payment-handler')
  successPaymentHandler(@Req() req: Request, @Res() res: Response) {
    return this.payementService.successPaymentHandler(req, res);
  }
}
