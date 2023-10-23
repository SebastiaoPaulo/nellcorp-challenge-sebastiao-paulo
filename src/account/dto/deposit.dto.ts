import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class DepositDto {
  @IsNumber()
  @Min(0.1)
  @ApiProperty()
  amount: number;
}
