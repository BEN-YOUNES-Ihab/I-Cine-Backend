import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilterDto, movieCategoryFilterDto, movieDto } from './dtos/movies.dto';
import { updateMovieFormDto } from './dtos/update_movie.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import multer from 'multer';

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
                    throw new NotFoundException('Movie not found.');
                }
                console.log(e);
            }      
        }
    }    
    async getMovieWithSessions(id : number){
        try{

        const movie = await this.prismaService.movie.findUnique({where :{id:id},include:{sessions:true}})
        return movie
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code ==='P2025'){
                    throw new NotFoundException('Movie not found.');
                }
                console.log(e);
            }      
        }
    }  

    async getMoviesToDisplay(){
        const today = new Date();

        const toDisplayMovies = await this.prismaService.movie.findMany({
          where: {
            releaseDate: {
              lte: today,
            },
            sessions: {
              some: {
                date: {
                  gt: today,
                },
              },
            },
          },
          orderBy: {
            id: 'desc',
          },
        });
        const beforePremiereMovies = await this.prismaService.movie.findMany({
            where: {
              releaseDate: {
                gt: today,
              },
              sessions: {
                some: {
                  date: {
                    gt: today,
                  },
                },
              },
            },
            orderBy: {
              id: 'desc',
            },
          });
          const onDisplayMovies = await this.prismaService.movie.findMany({
            where: {
              onDisplay : true
            },
            orderBy: {
              id: 'desc',
            },
          });
        return{
            toDisplayMovies: toDisplayMovies,
            beforePremiereMovies: beforePremiereMovies,
            onDisplayMovies:onDisplayMovies
        };
        
    }

    async getMovies(movieFilterDto : FilterDto){
        const { title,category, onDisplay, page = '1', size = '10' } = movieFilterDto;
    
        const skip = (parseInt(page) - 1) * parseInt(size);
    
        const where = {};
        if (title) {
            where['title'] = { contains: title ,mode:'insensitive'};
        }
        if (category) {
            where['category'] = { equals: category };
        } 
        if (onDisplay=='false') {
            where['onDisplay'] = {equals:false} ;
        } else if (onDisplay=='true'){
            where['onDisplay'] = {equals:true} ;
        }
    
        const movies = await this.prismaService.movie.findMany({
          where,
          skip,
          take: parseInt(size),
          orderBy: {
            id: 'desc', 
          },include:{sessions:true}
        });
        const totalElements = await this.prismaService.movie.count({ where }); 

        const totalPages = Math.ceil(totalElements / parseInt(size));

        return{
            content: movies,
            totalElements: totalElements,
            totalPages:totalPages
        };
    }

    async getMoviesByCategory(movieCategoryFilterDto : movieCategoryFilterDto){
        const { title, category, page = '1', size = '10' } = movieCategoryFilterDto;
    
        const skip = (parseInt(page) - 1) * parseInt(size);
    
        const where = {};

        if (title) {
            where['title'] = { contains: title ,mode:'insensitive'};
        }
        if (category) {
            where['category'] = { contains: category };
        } 
    
        const movies = await this.prismaService.movie.findMany({
          where,
          skip,
          take: parseInt(size),
          orderBy: {
            releaseDate: 'desc', 
          },
        });
        const totalElements = await this.prismaService.movie.count({ where }); 

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
                    throw new NotFoundException('Movie not found.');
                }
                console.log(e);
            }            
        }

    }

    async deleteMovie(id: number) {
        try {
          const movie = await this.prismaService.movie.delete({ where: { id :id} });
          await this.cloudinaryService.deleteFile(movie.imageCloudinaryPublicId);
      
          return { message: 'Deleted Successfuly' };
        } catch (e) {
          if (e instanceof PrismaClientKnownRequestError) {
            if (e.code === 'P2025') {
              throw new NotFoundException('Movie not found.');
            }else if (e.code === 'P2003'){
              throw new ConflictException('Movie have sessions')
            }
      
            console.log(e);
          }
        }
      }

    async uploadMovieImage(movieId : number,file: Express.Multer.File){
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
        const movie = await this.prismaService.movie.update({
            where:{id: movieId},
            data: {
                imageUrl:uploadedFile.url,
                imageCloudinaryPublicId: uploadedFile.public_id
            }
        })
        return movie;
    }

    async uploadMovieBaniereImage(movieId : number,file: Express.Multer.File){
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
        const movie = await this.prismaService.movie.update({
            where:{id: movieId},
            data: {
                baniereImageUrl:uploadedFile.url,
                baniereImageCloudinaryPublicId: uploadedFile.public_id
            }
        })
        return movie;
    }

    async uploadMovieImages(movieId : number,file: Express.Multer.File, secondFile:Express.Multer.File){
        if(!file || !secondFile){
            throw new NotFoundException('No files');
        }
        try{
            const movie_before = await this.getMovie(movieId);
            await this.cloudinaryService.deleteFile(movie_before.imageCloudinaryPublicId);
            await this.cloudinaryService.deleteFile(movie_before.baniereImageCloudinaryPublicId);
        }catch(e){
            console.log(e);
        }
        const uploadedFile = await this.cloudinaryService.uploadFile(file);
        const uploadedSecondFile = await this.cloudinaryService.uploadFile(secondFile);
        const movie = await this.prismaService.movie.update({
            where:{id: movieId},
            data: {
                imageUrl:uploadedFile.url,
                imageCloudinaryPublicId: uploadedFile.public_id,
                baniereImageUrl:uploadedSecondFile.url,
                baniereImageCloudinaryPublicId:uploadedSecondFile.public_id
            }
        })
        return movie;
    }
}