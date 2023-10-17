import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/auth.dto';
import { LocalGuard } from './guards/local.guard';
import { JwtGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private authService:AuthService
    ){}

    @Post('/signUp')
    signUp(@Body() body:SignUpDto ){
        return this.authService.signUp(body);
    }

    @Post('/login')
    @UseGuards(LocalGuard)
    logIn(@Req() req){
        return this.authService.logIn(req.user);
    }

    @Get('is_connected')
    @UseGuards(JwtGuard)
    isConnected(){
        return {
            status:'CONNECTED'
        };
    }


}
