import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsNumber()
  @ApiProperty()
  balance: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional()
  is_active: boolean;
}
