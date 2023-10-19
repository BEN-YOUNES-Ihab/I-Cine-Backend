import { Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto, movieDto } from './dtos/movies.dto';
import { updateMovieFormDto } from './dtos/update_movie.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class MoviesService {
    constructor(
        private prismaService: PrismaService,
        private cloudinaryService: CloudinaryService
    ){}

    async createMovie(dto: movieDto){
        let date;
        if(typeof dto.releaseDate === "string"){
            date= dto.releaseDate;
        }else{
            date= dto.releaseDate[0]
        }
        const movie = await this.prismaService.movie.create({
            data:{ 
                title:dto.title,
                description:dto.description,
                releaseDate:new Date(date),
                onDisplay:dto.onDisplay,
                category:dto.category
            }
        });
        return movie
    }

    async getMovie(id : number){
        try{

        const movie = await this.prismaService.movie.findUnique({where :{id:id}})
        return movie
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code ==='P2025'){
                    throw new NotFoundException('Author not found.');
                }
                console.log(e);
            }      
        }
    }    

    async getMovies(movieFilterDto : FilterDto){
        const { keyword, page = '1', size = '10' } = movieFilterDto;
    
        const skip = (parseInt(page) - 1) * parseInt(size);
    
        const where = {};

        if (keyword) {
          where['OR'] = [
            { title: { contains: keyword } },
            { category: { contains: keyword } }
          ];
        }
    
        const movies = await this.prismaService.movie.findMany({
          where,
          skip,
          take: parseInt(size),
        });
        const totalElements = await this.prismaService.movie.count({ where }); // Count all matching records.

        const totalPages = Math.ceil(totalElements / parseInt(size));

        return{
            content: movies,
            totalElements: totalElements,
            totalPages:totalPages
        };
    }

    async updateMovie(id:number, dto: updateMovieFormDto){
        let date;
        if(typeof dto.releaseDate === "string"){
            date= dto.releaseDate;
        }else{
            date= dto.releaseDate[0]
        }
        try{
            const movie = await this.prismaService.movie.update({
                where:{
                    id:id
                },
                data: { 
                    title:dto.title,
                    description:dto.description,
                    releaseDate:new Date(date),
                    onDisplay:dto.onDisplay,
                    category:dto.category,
                    updatedAt: new Date()
                },
            })
            return movie
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code ==='P2025'){
                    throw new NotFoundException('Author not found.');
                }
                console.log(e);
            }            
        }

    }

    async deleteMovie(id : number){
        try {
            const movie = await this.prismaService.movie.delete({
                where:{id:id}
            })
            return {message : 'Deleted Successfuly'}
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code ==='P2025'){
                    throw new NotFoundException('Author not found.');
                }
                console.log(e);
            }            
        }

    }

    async uploadMovieImage(movieId : number,file: Express.Multer.File){
        console.log('hihoo')
        if(!file){
            throw new NotFoundException('No file');
        }
        try{
            const movie_before = await this.getMovie(movieId);
            await this.cloudinaryService.deleteFile(movie_before.imageCloudinaryPublicId);
            
        }catch(e){
            console.log(e);
        }
        const uploadedFile = await this.cloudinaryService.uploadFile(file);
        console.log(uploadedFile);
        const movie = await this.prismaService.movie.update({
            where:{id: movieId},
            data: {
                imageUrl:uploadedFile.url,
                imageCloudinaryPublicId: uploadedFile.public_id
            }
        })
        return movie;
    }
}
