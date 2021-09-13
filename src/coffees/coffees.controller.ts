import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll(@Query() paginationQuery) {
    const { limit, offset } = paginationQuery;

    return `This action returns all coffees with limit:${limit} and offset:${offset}`;
  }
  @Get(':id')
  findById(@Param('id') params: string): string {
    return `This action returns a #${params} coffee`;
  }

  @Post()
  create(@Body() body): string {
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('name') body): string {
    return `This action updates a #${id} coffee with ${body}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string): string {
    return `This action removes a #${id} coffee`;
  }
}
