import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateInfrastructureDto {
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsNumber()
  functional: number;
  @ApiProperty()
  @IsNumber()
  nonfunctional: number;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  total?: number;
  @IsOptional()
  id?: number;
}
