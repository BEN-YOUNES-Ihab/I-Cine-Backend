import { Body, Controller,Get ,Param,ParseIntPipe,Patch,Post, Delete, UseGuards, UseInterceptors, Query, UploadedFiles, NotFoundException, } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { FilterDto, movieDto, movieCategoryFilterDto } from './dtos/movies.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { updateMovieFormDto } from './dtos/update_movie.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('movies')
export class MoviesController {
    constructor(
        private movieService: MoviesService){}

    @Post('/createMovie')
    @UseGuards(JwtGuard)
    creatMovie(@Body() dto: movieDto){
        return this.movieService.createMovie(dto);
    }

    @Patch('/:id/updateMovie')
    @UseGuards(JwtGuard)
    updateMovie(@Param('id',ParseIntPipe) id:number, @Body() dto: updateMovieFormDto){
        return this.movieService.updateMovie(id, dto);
    }

    @Delete('/:id/deleteMovie')
    @UseGuards(JwtGuard)
    deleteMovie(@Param('id',ParseIntPipe) id:number){
        return this.movieService.deleteMovie(id);
    }

    @Get(':id/getMovie')
    @UseGuards(JwtGuard)
    getMovie(@Param('id', ParseIntPipe) id: number){
        return this.movieService.getMovie(id);
    }

    @Get(':id/getMovieWithSessions')
    getMovieWithSessions(@Param('id', ParseIntPipe) id: number){
        return this.movieService.getMovieWithSessions(id);
    }

    @Get("/getMoviesList")
    @UseGuards(JwtGuard)
    getMoviesList(@Query() movieFilterDto: FilterDto) {
      return this.movieService.getMovies(movieFilterDto);
    }

    @Get("/getMoviesListbyCategory")
    getMoviesListbyCategory(@Query() movieCategoryFilterDto: movieCategoryFilterDto) {
      return this.movieService.getMoviesByCategory(movieCategoryFilterDto);
    }

    @Post('/:id/upload-images')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'file' , maxCount: 1 },
        { name: 'secondFile', maxCount: 1 },
      ]))
    uploadMovieImage(@UploadedFiles() files: { file?: Express.Multer.File[], secondFile?: Express.Multer.File[] },@Param('id',ParseIntPipe) movieId:number){
        if(files.file == null && files.secondFile ==null){
            throw new NotFoundException('No files');
        }else if(files.file == null){
            return this.movieService.uploadMovieBaniereImage(movieId, files.secondFile[0]);
        }else if(files.secondFile == null){
            return this.movieService.uploadMovieImage(movieId, files.file[0]);
        }
        return this.movieService.uploadMovieImages(movieId, files.file[0], files.secondFile[0]);
    }

    @Get("/getMoviesToDisplay")
    getMoviesToDisplay(){
        return this.movieService.getMoviesToDisplay();
    }
}