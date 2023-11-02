import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto, FilterUserDto, sessionDto } from './dtos/session.dto';
import { updateSessionFormDto } from './dtos/update_session.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class SessionsService {

    constructor(private prismaService : PrismaService){}

    async createSession(dto: sessionDto){
        let date;
        if(typeof dto.date === "string"){
            date= dto.date;
        }else{
            date= dto.date[0]
        }
        const sesssion = await this.prismaService.session.create({
            data:{ 
                date:new Date(date),
                places:dto.places,
                remaningPlaces: dto.remaningPlaces,
                movieId:dto.movieId
            }
        });
        return sesssion
    }
    async getSessionsByMovieIdUser(sessionFilterDto: FilterUserDto) {
        const { movieId, date } = sessionFilterDto;
        const where = {
            movieId: +movieId,
          };
          if (date) {
              let newDate = new Date(date);
              let currentDate = new Date();
              let filterMinDate;
              if (
                newDate.getDate() === currentDate.getDate() &&
                newDate.getMonth() === currentDate.getMonth() &&
                newDate.getFullYear() === currentDate.getFullYear()
              ) {
                filterMinDate = currentDate;
              } else {
                filterMinDate = new Date(newDate.setHours(0, 0, 0, 0));
              }
              let filterMaxDate = new Date(newDate.setHours(23, 59, 59, 999));
      
              where['date'] = {
                  gte: filterMinDate,
                  lte: filterMaxDate,
              };
          }

        const sessions = await this.prismaService.session.findMany({
          where,
          orderBy: {
            date: 'asc',
          },
          include: {
            orders: true,
            movie: true,
          },
        });
      
        return sessions;
    }

    async getSessionsByMovieId(sessionFilterDto : FilterDto){
        const { movieId, minDate, maxDate, page = '1', size = '10' } = sessionFilterDto;

        const skip = (parseInt(page) - 1) * parseInt(size);
        const where = {};
        where['movieId'] = +movieId;

        if (minDate) {
            let newMinDate = new Date(minDate);
            let newMaxDate = new Date(maxDate);

            let filterMinDate = new Date(newMinDate.setHours(0,0,0,0));
            let filterMaxDate = new Date(newMaxDate.setHours(23,59,59,10));

            where['OR'] = [
                { date: { gte: filterMinDate, lte: filterMaxDate } }
            ];
        }
    
        const sessions = await this.prismaService.session.findMany({
          where,
          skip,
          take: parseInt(size),
          orderBy: {
            date: 'desc', 
          },include:{orders:true,movie:true}
        });
        const totalElements = await this.prismaService.session.count({ where });

        const totalPages = Math.ceil(totalElements / parseInt(size));

        return{
            content: sessions,
            totalElements: totalElements,
            totalPages:totalPages
        };
    }

    async updateSession(id:number, dto: updateSessionFormDto){
        let date;
        if(typeof dto.date === "string"){
            date= dto.date;
        }else{
            date= dto.date[0]
        }
        try {
            const session = await this.prismaService.session.update({
                where:{
                    id:id
                },
                data: {
                    date:new Date(date),
                    places:dto.places,
                    remaningPlaces: dto.remaningPlaces,
                    movieId:dto.movieId,
                    updatedAt: new Date()
                },
            })
            return session
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code ==='P2025'){
                    throw new NotFoundException('Session not found.');
                }
                console.log(e);
            }            
        }

    }

    async deleteSession(id : number){
        try {
            await this.prismaService.session.delete({where:{id:id}})
            return {message : 'Deleted Successfuly'}
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code ==='P2025'){
                    throw new NotFoundException('Session not found.');
                }else if (e.code === 'P2003'){
                    throw new ConflictException('Session have orders')
                }
                console.log(e);
            }            
        }
    }

    async getSessionsbyMovie(movieId: number){
        const sessions = await this.prismaService.session.findMany({
            where:{
                movieId : movieId
            },
            include : {movie : true}
        })
        return sessions;
    }

    async getSession(id: number){
        const sessions = await this.prismaService.session.findMany({
            where:{
                id : id
            },include : {movie:true}
        })
        return sessions;
    }
}