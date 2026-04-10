import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';

@Controller({ version: '1' }) // On n'oublie pas la version !
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post('menus/:menuId/items')
  create(
    @Param('menuId', ParseIntPipe) menuId: number, 
    @Body() body: { name: string; price: number; categoryIds?: number[] }
  ) {
    return this.menuItemsService.create(menuId, body);
  }

  @Get('menus/:menuId/items')
  findAllByMenu(@Param('menuId', ParseIntPipe) menuId: number) {
    return this.menuItemsService.findAllByMenu(menuId);
  }

  @Patch('items/:id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.menuItemsService.update(id, updateDto);
  }

  @Delete('items/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.menuItemsService.remove(id);
  }
}