import { PartialType } from '@nestjs/mapped-types';
import { movieDto } from './movies.dto';

export class updateMovieFormDto extends PartialType(movieDto) {}
