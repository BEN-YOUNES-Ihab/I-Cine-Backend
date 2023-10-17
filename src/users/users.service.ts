import { BadRequestException, Body, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFilterDto, UsertoEdit, UsertoEditPssword, UsertoEditRole } from './dtos/user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(
        private prismaService : PrismaService,
    ){}

    async getUserToEdit(id : number){
        try{
            const user = await this.prismaService.user.findFirst({where :{id:id}})
            return user
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code ==='P2025'){
                    throw new NotFoundException('User not found.');
                }
                console.log(e);
            }    
        }
    }
    
    async editUser(email:string, @Body() dto: UsertoEdit){
        try{
            const user = await this.prismaService.user.update({
                where:{
                    email:email
                },
                data: {
                  firstName : dto.firstname,
                  lastName: dto.lastname,
                  email: dto.email,
                  updatedAt: new Date()
                },
            })
            return user
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code ==='P2025'){
                    throw new NotFoundException('User not found.');
                }
                console.log(e);
            }            
        }
    }

    async validatePassword(email : string, password: string){
        const user = await this.prismaService.user.findUnique({
            where:{email:email
        }});
        if(user){
            if(await bcrypt.compare(password,user.hashed_password)){
                return true;
            }
        }
        return false;
    }
    
    async editUserPassword(email:string, @Body() dto: UsertoEditPssword ){
        if(dto.password != dto.confirm_password){
            throw new BadRequestException('Confirm does not correspond to password');
        }
        try{
            if(this.validatePassword(email,dto.old_password)){
                const user = await this.prismaService.user.update({
                    where:{
                        email:email
                    },
                    data: {
                      hashed_password : await bcrypt.hash(dto.password, 10),
                      updatedAt: new Date()
                    },
                })
                return user
            }else{
                throw new BadRequestException('Old password does not correspond to password');
            }
            
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code ==='P2025'){
                    throw new NotFoundException('User not found.');
                }
                console.log(e);
            }            
        }
    }

    async editUserRole(email:string, @Body() dto: UsertoEditRole){
        try{
            const user = await this.prismaService.user.update({
                where:{
                    email:email
                },
                data: {
                  role: dto.role,
                  updatedAt: new Date()
                },
            })
            return user
        }catch(e){
            if(e instanceof PrismaClientKnownRequestError){
                if(e.code ==='P2025'){
                    throw new NotFoundException('User not found.');
                }
                console.log(e);
            }            
        }
    }

    async getFilteredUsers(userFilterDto: UserFilterDto) {
        const { keyword, page = '1', size = '10' } = userFilterDto;
    
        const skip = (parseInt(page) - 1) * parseInt(size);
    
        const where = {};

        if (keyword) {
          where['OR'] = [
            { email: { contains: keyword } },
            { firstName: { contains: keyword } },
            { lastName: { contains: keyword } },
            { role: { contains: keyword } },
          ];
        }
    
        const users = await this.prismaService.user.findMany({
          where,
          skip,
          take: parseInt(size),
        });
        const totalElements = await this.prismaService.user.count({ where }); // Count all matching records.

        const totalPages = Math.ceil(totalElements / parseInt(size));

        return{
            content: users,
            totalElements: totalElements,
            totalPages:totalPages
        };
      }

      async deleteUser(email : string){
        try{
            const user = await this.prismaService.user.delete({
                where:{email:email}
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
}
