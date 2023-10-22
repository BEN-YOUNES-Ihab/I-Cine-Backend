import { IsString, MinLength, IsNotEmpty, ValidateIf, IsInt, IsDate, IsBoolean, IsOptional } from "class-validator";

export class movieDto {
    @IsString()
    @IsNotEmpty()
    title

    @IsString()
    @ValidateIf((object,value)=>value!==null)
    description
    
    @IsNotEmpty()
    releaseDate 

    @IsBoolean()
    onDisplay

    @IsString()
    @IsNotEmpty()
    category

}
export class FilterDto {

    @IsOptional()
    @IsString()
    keyword?: string;
  
    @IsOptional()
    page?: string;
  
    @IsOptional()
    size?: string;
  }

  export class movieCategoryFilterDto{

    @IsOptional()
    @IsString()
    title?: string;
  
    @IsOptional()
    @IsString()
    category

    @IsOptional()
    page?: string;
  
    @IsOptional()
    size?: string;
  }