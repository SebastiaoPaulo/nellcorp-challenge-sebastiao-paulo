import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InfrastructureService } from './infrastructure.service';
import { CreateInfrastructureDto } from './dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from './dto/update-infrastructure.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('infrastructures')
@Controller('infrastructures')
export class InfrastructureController {
  constructor(private readonly infrastructureService: InfrastructureService) {}

  @ApiOperation({
    summary: 'Creates an infrastructure',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns the created infrastructure',
    type: CreateInfrastructureDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Constraints on the inputs',
  })
  @Post()
  create(@Body() createInfrastructureDto: CreateInfrastructureDto) {
    console.log(createInfrastructureDto);

    return this.infrastructureService.create(createInfrastructureDto);
  }

  @ApiOperation({
    summary: 'Finds all infrastructures on the records',
  })
  @Get()
  findAll() {
    return this.infrastructureService.findAll();
  }

  @ApiOperation({
    summary: 'Finds an infrastructure by id',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the found transition',
    type: CreateInfrastructureDto,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.infrastructureService.findOne(+id);
  }

  @ApiOperation({
    summary: 'Updates an infrastructure',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated infrastructure',
  })
  @ApiBody({ type: CreateInfrastructureDto })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInfrastructureDto: UpdateInfrastructureDto,
  ) {
    return this.infrastructureService.update(+id, updateInfrastructureDto);
  }

  @ApiOperation({
    summary: 'Updates an infrastructure',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the deleted infrastructure',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.infrastructureService.remove(+id);
  }
}
