import { PartialType } from '@nestjs/mapped-types';
import { CreateInfrastructureDto } from './create-infrastructure.dto';

export class UpdateInfrastructureDto extends PartialType(
  CreateInfrastructureDto,
) {}
