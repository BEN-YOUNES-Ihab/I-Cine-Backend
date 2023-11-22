import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { FilterDto, FilterUserDto, sessionDto } from './dtos/session.dto';
import { updateSessionFormDto } from './dtos/update_session.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('sessions')
export class SessionsController {
  constructor(private sessionsService: SessionsService) {}

  @Post('/createSession')
  @UseGuards(JwtGuard)
  creatSession(@Body() dto: sessionDto) {
    return this.sessionsService.createSession(dto);
  }

  @Patch('/:id/updateSession')
  @UseGuards(JwtGuard)
  updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: updateSessionFormDto,
  ) {
    return this.sessionsService.updateSession(id, dto);
  }

  @Get('/getSessionsByMovieIdUser')
  getSessionsByMovieIdUser(@Query() sessionFilterDto: FilterUserDto) {
    return this.sessionsService.getSessionsByMovieIdUser(sessionFilterDto);
  }

  @Get('/getSessionsByMovieId')
  @UseGuards(JwtGuard)
  getSessionsByMovieId(@Query() sessionFilterDto: FilterDto) {
    return this.sessionsService.getSessionsByMovieId(sessionFilterDto);
  }

  @Get(':id/getSession')
  @UseGuards(JwtGuard)
  getSession(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.getSession(id);
  }

  @Delete('/:id/deleteSession')
  @UseGuards(JwtGuard)
  deleteMovie(@Param('id', ParseIntPipe) id: number) {
    return this.sessionsService.deleteSession(id);
  }
}
