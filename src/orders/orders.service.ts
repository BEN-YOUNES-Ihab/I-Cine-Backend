import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto, orderDto, orderFiltrobyUserDTO } from './dtos/order.dto';

@Injectable()
export class OrdersService {
  constructor(private prismaService: PrismaService) {}

  async createOrder(dto: orderDto) {
    const order = await this.prismaService.order.create({
      data: {
        places: dto.places,
        amount: dto.amount,
        sessionId: dto.sessionId,
        userId: dto.userId,
      },
    });
    return order;
  }

  async getOrderById(id: number) {
    const order = await this.prismaService.order.findUnique({
      where: {
        id: id,
      },
      include: {
        session: {
          include: {
            movie: true,
          },
        },
      },
    });
    return order;
  }

  async getOrdersList(filterDto: FilterDto) {
    const { keyword, sessionId, page = '1', size = '10' } = filterDto;

    const where = {};
    where['sessionId'] = +sessionId;

    if (keyword) {
      where['OR'] = [
        { user: { firstName: { contains: keyword, mode: 'insensitive' } } },
        { user: { lastName: { contains: keyword, mode: 'insensitive' } } },
        { user: { email: { contains: keyword, mode: 'insensitive' } } },
      ];
    }
    const skip = (parseInt(page) - 1) * parseInt(size);
    const orders = await this.prismaService.order.findMany({
      where,
      skip,
      take: parseInt(size),
      include: { user: true },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalElements = await this.prismaService.order.count({ where });

    const totalPages = Math.ceil(totalElements / parseInt(size));

    return {
      content: orders,
      totalElements: totalElements,
      totalPages: totalPages,
    };
  }

  async getOrdersListByUserId(filtre: orderFiltrobyUserDTO) {
    const { userId, year, archived } = filtre;
    const where: any = {};

    const startDate = new Date(+year, 0, 1);
    const endDate = new Date(+year + 1, 0, 1);
    const today = new Date();

    if (archived === 'true') {
      where.userId = +userId;
      where.session = {
        date: {
          gte: startDate,
          lt: endDate,
        },
      };
    } else {
      where.userId = +userId;
      where.session = {
        date: {
          gte: today,
          lt: endDate,
        },
      };
    }

    const orders = await this.prismaService.order.findMany({
      where,
      include: {
        session: {
          include: {
            movie: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const totalElements = await this.prismaService.order.count({ where });
    return {
      content: orders,
      totalElements: totalElements,
    };
  }
}
