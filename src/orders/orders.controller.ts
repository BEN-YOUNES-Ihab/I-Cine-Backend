import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FilterDto, orderDto, orderFiltrobyUserDTO } from './dtos/order.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('/createOrder')
  @UseGuards(JwtGuard)
  createOrder(@Body() dto: orderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Get(':id/getOrderById')
  @UseGuards(JwtGuard)
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.getOrderById(+id);
  }

  @Get('/getOrdersList')
  @UseGuards(JwtGuard)
  getOrdersList(@Query() filterDto: FilterDto) {
    return this.ordersService.getOrdersList(filterDto);
  }

  @Get('getOrdersListByUserId')
  @UseGuards(JwtGuard)
  getOrdersListByUserId(@Query() orderFiltrobyUserDTO: orderFiltrobyUserDTO) {
    return this.ordersService.getOrdersListByUserId(orderFiltrobyUserDTO);
  }
}
