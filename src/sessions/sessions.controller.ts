import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { FilterDto, sessionDto } from './dtos/session.dto';
import { updateSessionFormDto } from './dtos/update_session.dto';

@Controller('sessions')
export class SessionsController {
    constructor(private sessionsService: SessionsService){}

    @Post('/createSession')
    creatSession(@Body() dto: sessionDto){
        return this.sessionsService.createSession(dto);
    }

    @Patch('/:id/updateSession')
    updateMovie(@Param('id',ParseIntPipe) id:number, @Body() dto: updateSessionFormDto){
        return this.sessionsService.updateSession(id, dto);
    }
    
    @Get("/getSessionsByMovieId")
    getSessionsByMovieId(@Query() sessionFilterDto: FilterDto) {
      return this.sessionsService.getSessionsByMovieId(sessionFilterDto);
    }

    @Delete('/:id/deleteSession')
    deleteMovie(@Param('id',ParseIntPipe) id:number){
        return this.sessionsService.deleteSession(id);
    }
}
