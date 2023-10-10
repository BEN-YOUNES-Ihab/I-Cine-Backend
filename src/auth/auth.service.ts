import { BadRequestException, Body, ConflictException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dtos/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';

export const  jwtConstants ={
    secret: process.env.JWT_PASS
}
@Injectable()
export class AuthService {
    constructor(
        private prismaService : PrismaService,
        private jwtService: JwtService
    ){}
    async signUp(@Body() dto: SignUpDto){
        if(dto.password !== dto.confirm_password)
            throw new BadRequestException('Confirm does not correspond to password');
        try{
            await this.prismaService.user.create({
                data:{
                    email:dto.email,
                    hashed_password:await bcrypt.hash(dto.password, 10) ,
                    firstName:dto.firstname ,
                    lastName:dto.lastname
                }
            })
            return {message:'Success'}
        }catch(e){
            console.error(e);
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code=='P2002'){
                    throw new ConflictException("Email is already in db");
                }
            }
        }
    }

    async logIn(user){
        const payload = {user}
        delete user.hashed_password; delete user.createdAt ; delete user.updatedAt ;
        return{
            accessToken: this.jwtService.sign(payload),
            currentUser: user
        };
    }
    async validateUser(email : string, password: string){
        const user = await this.prismaService.user.findUnique({
            where:{email:email
        }});
        if(user){
            if(await bcrypt.compare(password,user.hashed_password)){
                return user;
            }
        }
        return null;
    }

}

