import { IsString, MinLength, IsNotEmpty, ValidateIf, IsInt, IsDate, IsBoolean } from "class-validator";

export class movieDto {
    @IsString()
    @IsNotEmpty()
    title

    @IsString()
    @ValidateIf((object,value)=>value!==null)
    description
    
    @IsString()
    @IsNotEmpty()
    releaseDate 

    onDisplay

    @IsString()
    @IsNotEmpty()
    category

}

