import { IsNotEmpty, MaxLength, MinLength, IsEmail, IsNumber, IsString, IsOptional } from "class-validator";

export class UserDto {

  @IsEmail()
  @IsNotEmpty()
  email
  
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password

  @IsNotEmpty()
  firstname

  @IsNotEmpty()
  lastname

}

export class UsertoEdit {

    @IsEmail()
    @IsNotEmpty()
    email
    
    @IsNotEmpty()
    firstname
  
    @IsNotEmpty()
    lastname
  
  }
  
  export class UsertoEditRole {
    
    @IsNotEmpty()
    @IsString()
    role
  }
export class UsertoEditPssword {

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    old_password

    @MinLength(8)
    @MaxLength(30)
    @IsString()
    @IsNotEmpty()
    password

    @MinLength(8)
    @MaxLength(30)
    @IsString()
    @IsNotEmpty()
    confirm_password

}

export class UserFilterDto {

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  size?: string;
}