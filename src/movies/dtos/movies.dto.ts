<<<<<<< HEAD
import { IsString, IsNotEmpty, ValidateIf, IsBoolean, IsOptional, IsInt } from "class-validator";
=======
import {
  IsString,
  IsNotEmpty,
  ValidateIf,
  IsBoolean,
  IsOptional,
} from 'class-validator';
>>>>>>> b0acc59f12e99476ecd31f4842ca1ec54ba9a468

export class movieDto {
  @IsString()
  @IsNotEmpty()
  title;

  @IsOptional()
  @ValidateIf((object, value) => value !== null)
  description;

  @IsNotEmpty()
  releaseDate;

  @IsBoolean()
  onDisplay;

<<<<<<< HEAD
    @IsInt()
    @IsNotEmpty()
    durationTime

=======
  @IsString()
  @IsNotEmpty()
  category;
>>>>>>> b0acc59f12e99476ecd31f4842ca1ec54ba9a468
}
export class FilterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  onDisplay?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  size?: string;
}

export class movieCategoryFilterDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  size?: string;
}
