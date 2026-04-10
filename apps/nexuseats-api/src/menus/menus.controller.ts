import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MenusService } from './menus.service';
import { Prisma } from '@prisma/client';

// 1. AJOUTE LA VERSION ICI 👇
@Controller({
  version: '1' 
})
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  // Route POST : Créer un menu pour un restaurant spécifique
  @Post('restaurants/:restaurantId/menus')
  create(
    @Param('restaurantId', ParseIntPipe) restaurantId: number, 
    @Body() body: { name: string; description?: string }
  ) {
    return this.menusService.create(restaurantId, body);
  }

  // Route GET : Obtenir les menus d'un restaurant spécifique
  @Get('restaurants/:restaurantId/menus')
  findAllByRestaurant(@Param('restaurantId', ParseIntPipe) restaurantId: number) {
    return this.menusService.findAllByRestaurant(restaurantId);
  }

  // Routes classiques pour manipuler un menu précis
  @Get('menus/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.menusService.findOne(id);
  }

  @Patch('menus/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateMenuDto: Prisma.MenuUpdateInput) {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete('menus/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menusService.remove(id);
  }
}