import {
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  IsPositive,
  IsInt,
  IsArray,
  IsIn,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  title: string;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;
  @IsString()
  @IsOptional()
  description?: string;
  @IsString()
  @IsOptional()
  slug?: string;
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;
  @IsString({ each: true })
  @IsArray()
  sizes: string[];
  @IsIn(['men', 'woman', 'kid', 'unisex'])
  gender: string;
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];
}
