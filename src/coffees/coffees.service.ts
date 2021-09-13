import { Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Cappuccino',
      brand: 'Superstar',
      flavors: ['vanilla', 'chocolate'],
    },
  ];

  findAll(): Coffee[] {
    return this.coffees;
  }

  findOne(id: string): Coffee {
    const coffee = this.coffees.find((coffee) => coffee.id === +id);
    if (!coffee) {
      throw new NotFoundException(`Coffee with id: ${id} notfound`);
    }
    return coffee;
  }

  create(coffee: any) {
    this.coffees.push(coffee);
  }

  update(id: string, updateCoffeeDto: any) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      existingCoffee.name = updateCoffeeDto.name;
      existingCoffee.brand = updateCoffeeDto.brand;
      existingCoffee.flavors = updateCoffeeDto.flavors;
    }
  }

  remove(id: string) {
    const coffeeIndex = this.coffees.findIndex((coffee) => coffee.id === +id);
    if (coffeeIndex !== -1) {
      this.coffees.splice(coffeeIndex, 1);
    }
  }
}
