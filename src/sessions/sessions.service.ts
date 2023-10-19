import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto, sessionDto } from './dtos/session.dto';
import { updateSessionFormDto } from './dtos/update_session.dto';

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
                movieId:dto.movieId
            }
        });
        return sesssion
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
        const session = await this.prismaService.session.update({
            where:{
                id:id
            },
            data: {
                date:new Date(date),
                places:dto.places,
                movieId:dto.movieId,
                updatedAt: new Date()
            },
        })
        return session
    }

    async deleteSession(id : number){
        const session = await this.prismaService.session.delete({
            where:{id:id}
        })
        return {message : 'Deleted Successfuly'}
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
}
