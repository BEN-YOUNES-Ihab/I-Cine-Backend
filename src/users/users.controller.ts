import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserFilterDto, UsertoEdit, UsertoEditPssword, UsertoEditRole } from './dtos/user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
    constructor(
        private userService:UsersService    
    ){}

    @Get(':id/getUserToEdit')
    @UseGuards(JwtGuard)
    getUserToEdit(@Param('id',ParseIntPipe) id:number){
        return this.userService.getUserToEdit(id);
    }

    @Patch(':email/editUser')
    @UseGuards(JwtGuard)
    editUser(@Param('email') email:string, @Body() dto: UsertoEdit){
        return this.userService.editUser(email, dto);
    }

    @Patch(':email/editUserPassword')
    @UseGuards(JwtGuard)
    editUserPassword(@Param('email') email:string, @Body() dto: UsertoEditPssword){
        return this.userService.editUserPassword(email, dto);
    }

    @Patch(':email/editUserRole')
    @UseGuards(JwtGuard)
    editUserRole(@Param('email') email:string, @Body() dto: UsertoEditRole){
        return this.userService.editUserRole(email, dto);
    }

    @Get("/getUsersList")
    @UseGuards(JwtGuard)
    getUsersList(@Query() userFilterDto: UserFilterDto) {
      return this.userService.getFilteredUsers(userFilterDto);
    }

    @Delete(':email/deleteUser')
    @UseGuards(JwtGuard)
    deleteUser(@Param('email') email:string){
        return this.userService.deleteUser(email);
    }
}
