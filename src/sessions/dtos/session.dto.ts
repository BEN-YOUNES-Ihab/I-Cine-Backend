import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class sessionDto {
<<<<<<< HEAD
    
    @IsNotEmpty()
    date
=======
  @IsString()
  @IsNotEmpty()
  date;
>>>>>>> 9aa2475 (payement & mail)

  @IsNotEmpty()
  places;

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

<<<<<<< HEAD
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
=======
  @IsOptional()
  page?: string;

  @IsOptional()
  size?: string;
}
>>>>>>> 9aa2475 (payement & mail)
