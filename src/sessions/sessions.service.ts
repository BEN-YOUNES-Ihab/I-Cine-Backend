import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto, sessionDto } from './dtos/session.dto';
import { updateSessionFormDto } from './dtos/update_session.dto';

@Injectable()
export class SessionsService {

    constructor(private prismaService : PrismaService){}

    async createSession(dto: sessionDto){
        const sesssion = await this.prismaService.session.create({
            data:{ 
                date:new Date(dto.date),
                places:dto.places,
                movieId:dto.movieId
            }
        });
        return sesssion
    }

    async getSessionsByMovieId(sessionFilterDto : FilterDto){
        const { movieId, keyword, page = '1', size = '10' } = sessionFilterDto;
    
        const skip = (parseInt(page) - 1) * parseInt(size);
        console.log(movieId)
        const where = {};

        where['movieId'] = +movieId;

        if (keyword) {
          where['OR'] = [
            { title: { contains: keyword } },
            { category: { contains: keyword } }
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
        const session = await this.prismaService.session.update({
            where:{
                id:id
            },
            data: {
                date:new Date(dto.date),
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
