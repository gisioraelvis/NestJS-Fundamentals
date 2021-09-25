import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorsRepository: Repository<Flavor>,
  ) {}
  findAll() {
    return this.coffeeRepository.find({ relations: ['flavors'] });
  }

  async findOne(id: string) {
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee with id: ${id} notfound`);
    }
    return coffee;
  }

  async create(coffee: CreateCoffeeDto) {
    const flavors = await Promise.all(
      coffee.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const newCoffee = this.coffeeRepository.create({ ...coffee, flavors });
    return this.coffeeRepository.save(newCoffee);
  }

  async update(id: string, coffeeUpdate: UpdateCoffeeDto) {
    const flavors =
      coffeeUpdate.flavors &&
      (await Promise.all(
        coffeeUpdate.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const updatedCoffee = await this.coffeeRepository.preload({
      id: +id,
      ...coffeeUpdate,
      flavors,
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

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorsRepository.findOne(name);
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorsRepository.create({ name });
  }
}
