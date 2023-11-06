import {
  IsString,
  IsNotEmpty,
  ValidateIf,
  IsBoolean,
  IsOptional,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
  category;
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
