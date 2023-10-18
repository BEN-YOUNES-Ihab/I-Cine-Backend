import { Body, Controller,Get ,Param,ParseIntPipe,Patch,Post, Delete, UploadedFile, UseInterceptors, Query, } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { FilterDto, movieDto } from './dtos/movies.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { updateMovieFormDto } from './dtos/update_movie.dto';

@Controller('movies')
export class MoviesController {
    constructor(
        private movieService: MoviesService){}

    @Post('/createMovie')
    creatMovie(@Body() dto: movieDto){
        return this.movieService.createMovie(dto);
    }

    @Patch('/:id/updateMovie')
    updateMovie(@Param('id',ParseIntPipe) id:number, @Body() dto: updateMovieFormDto){
        return this.movieService.updateMovie(id, dto);
    }

    @Delete('/:id/deleteMovie')
    deleteMovie(@Param('id',ParseIntPipe) id:number){
        return this.movieService.deleteMovie(id);
    }

    @Get("/getMoviesList")
    getMoviesList(@Query() movieFilterDto: FilterDto) {
      return this.movieService.getMovies(movieFilterDto);
    }

    @Post('/:id/upload-image')
    @UseInterceptors(FileInterceptor('file'))
    uploadMovieImage(@UploadedFile() file: Express.Multer.File,@Param('id',ParseIntPipe) bookId:number){
        return this.movieService.uploadMovieImage(bookId, file);
    }
}