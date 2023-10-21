import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { FilterDto, sessionDto } from './dtos/session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post('/createSession')
  creatSession(@Body() dto: sessionDto) {
    return this.sessionsService.createSession(dto);
  }

  @Get('/getSessionsByMovieId')
  getSessionsByMovieId(@Query() sessionFilterDto: FilterDto) {
    return this.sessionsService.getSessionsByMovieId(sessionFilterDto);
  }
}
