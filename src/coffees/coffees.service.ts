import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}
  findAll() {
    return this.coffeeRepository.find();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne(id);
    if (!coffee) {
      throw new NotFoundException(`Coffee with id: ${id} notfound`);
    }
    return coffee;
  }

  create(coffee: CreateCoffeeDto) {
    const newCoffee = this.coffeeRepository.create(coffee);
    return this.coffeeRepository.save(newCoffee);
  }

  async update(id: string, coffeeUpdate: UpdateCoffeeDto) {
    const updatedCoffee = await this.coffeeRepository.preload({
      id: +id,
      ...coffeeUpdate,
    });
    if (!updatedCoffee) {
      throw new NotFoundException(`Coffee with id: ${id} notfound`);
    }
    return this.coffeeRepository.save(updatedCoffee);
  }

  async remove(id: string) {
    const coffeeToRemove = await this.coffeeRepository.findOne(id);
    if (!coffeeToRemove) {
      throw new NotFoundException(`Coffee with id: ${id} notfound`);
    }
    return this.coffeeRepository.remove(coffeeToRemove);
  }
}
