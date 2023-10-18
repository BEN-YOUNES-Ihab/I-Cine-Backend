import { IsNotEmpty, MaxLength, MinLength, IsEmail } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  password;

  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(30)
  confirm_password;

  @IsNotEmpty()
  firstname;

  @IsNotEmpty()
  lastname;
}
