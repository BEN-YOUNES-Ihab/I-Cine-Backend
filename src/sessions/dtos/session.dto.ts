import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class sessionDto {
    
  @IsNotEmpty()
  date

  @IsNotEmpty()
  places;

  @IsNotEmpty()
  remaningPlaces;

  @IsNotEmpty()
  @IsInt()
  movieId;
}
export class FilterDto {
  @IsNotEmpty()
  @IsString()
  movieId: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  minDate?: string;

  @IsOptional()
  @IsString()
  maxDate?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  size?: string;
  }


  export class FilterUserDto {
    @IsNotEmpty()
    @IsString()
    movieId: string;
  

  
    @IsNotEmpty()
    @IsString()
    date: string;

    }