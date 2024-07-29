import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID, Min } from 'class-validator';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export class TransferDto {
  @IsNumber()
  @Min(0.1)
  @ApiProperty()
  amount: number;

  @IsUUID()
  @ApiProperty({ type: UUID })
  account: string;

  @IsUUID()
  @ApiProperty({ type: UUID })
  receiver: string;
}
