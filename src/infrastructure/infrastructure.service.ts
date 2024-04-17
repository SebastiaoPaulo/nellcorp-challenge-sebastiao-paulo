import { Injectable } from '@nestjs/common';
import { CreateInfrastructureDto } from './dto/create-infrastructure.dto';
import { UpdateInfrastructureDto } from './dto/update-infrastructure.dto';

@Injectable()
export class InfrastructureService {
  private items = [];

  create(createInfrastructureDto: CreateInfrastructureDto) {
    let id = 1;
    const lastItem = this.getLastItem();

    if (lastItem?.id) {
      id = lastItem.id + 1;
    }

    // Making the calculation iiin case there is no total value
    if (!createInfrastructureDto?.total) {
      createInfrastructureDto.total =
        createInfrastructureDto.functional +
        createInfrastructureDto.nonfunctional;
    }

    this.items.push({
      id,
      ...createInfrastructureDto,
    });

    return createInfrastructureDto;
  }

  findAll() {
    return this.items;
  }

  findOne(id: number) {
    return this.items.find((item) => item.id === id);
  }

  update(id: number, updateInfrastructureDto: UpdateInfrastructureDto) {
    const index = this.items.findIndex((item) => item.id === id);
    this.items[index] = { ...this.items[index], ...updateInfrastructureDto };
    return this.items[index];
  }

  remove(id: number) {
    const index = this.items.findIndex((item) => item.id === id);
    const deletedItem = this.items.splice(index, 1);
    return deletedItem;
  }

  getLastItem() {
    return this.items[this.items.length - 1];
  }
}
