import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserFilterDto, UsertoEdit, UsertoEditPssword, UsertoEditRole } from './dtos/user.dto';

@Controller('users')
export class UsersController {
    constructor(
        private userService:UsersService    
    ){}

    @Get(':id/getUserToEdit')
    getUserToEdit(@Param('id',ParseIntPipe) id:number){
        return this.userService.getUserToEdit(id);
    }

    @Patch(':email/editUser')
    editUser(@Param('email') email:string, @Body() dto: UsertoEdit){
        return this.userService.editUser(email, dto);
    }

    @Patch(':email/editUserPassword')
    editUserPassword(@Param('email') email:string, @Body() dto: UsertoEditPssword){
        return this.userService.editUserPassword(email, dto);
    }

    @Patch(':email/editUserRole')
    editUserRole(@Param('email') email:string, @Body() dto: UsertoEditRole){
        return this.userService.editUserRole(email, dto);
    }

    // @Get('getUsersList')
    // getUsersList(@Query('className') className: string, @Query('page') page: number, @Query('size') size: number) {
    //   return this.userService.getUsersList(className, page, size);
    // }
    @Get("/getUsersList")
    async getUsersList(@Query() userFilterDto: UserFilterDto) {
      return this.userService.getFilteredUsers(userFilterDto);
    }

    @Delete(':email/deleteUser')
    async deleteUser(@Param('email') email:string){
        return this.userService.deleteUser(email);
    }
}
