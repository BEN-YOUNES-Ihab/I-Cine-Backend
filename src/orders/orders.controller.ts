import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FilterDto, orderDto, orderFiltrobyUserDTO } from './dtos/order.dto';

@Controller('orders')
export class OrdersController {

   constructor(
        private ordersService: OrdersService){}

    @Post('/createOrder')
    createOrder(@Body() dto: orderDto){
        return this.ordersService.createOrder(dto);
    }

    @Get(":id/getOrderById")
    getOrderById( @Param('id',ParseIntPipe) id:number) {
      console.log(id)
      return this.ordersService.getOrderById(+id);
    }

    @Get("/getOrdersList")
    getOrdersList(@Query() filterDto: FilterDto) {
      return this.ordersService.getOrdersList(filterDto);
    }

    @Get("getOrdersListByUserId")
    getOrdersListByUserId(@Query() orderFiltrobyUserDTO: orderFiltrobyUserDTO) {
        return this.ordersService.getOrdersListByUserId(orderFiltrobyUserDTO);
      }

}