import { IsString, MinLength, IsNotEmpty, ValidateIf, IsInt, IsDate, IsBoolean, IsOptional } from "class-validator";

export class sessionDto {
    @IsString()
    @IsNotEmpty()
    date

    @IsNotEmpty()
    places

    @IsNotEmpty()
    @IsInt()
    movieId

}
export class FilterDto {

    @IsNotEmpty()
    @IsString()
    movieId: string

    @IsOptional()
    @IsString()
    keyword?: string;
  
    @IsOptional()
    page?: string;
  
    @IsOptional()
    size?: string;
  }
