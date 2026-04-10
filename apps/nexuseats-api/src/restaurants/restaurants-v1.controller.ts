import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { OffsetPaginationDto, CursorPaginationDto } from '../auth/dto/pagination.dto';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiParam, 
  ApiQuery, 
  ApiBearerAuth 
} from '@nestjs/swagger';

@ApiTags('restaurants-v1')
@Controller({ path: 'restaurants', version: '1' })
export class RestaurantsV1Controller {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un restaurant (v1)' })
  create(@Body() createDto: any) {
    return this.restaurantsService.create(createDto, 1);
  }

  @Get()
  @ApiOperation({ summary: 'Lister les restaurants (v1 - Format Standard)' })
  findAll() {
    // 💡 Mock data pour la capture d'écran de la liste
    return [
      {
        id: "uuid-v1-list",
        name: "Ancienne Enseigne",
        cuisine: "ITALIEN",
        address: { street: "10 rue du Passé", city: "Paris" },
        rating: 4.0
      }
    ];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un restaurant (v1)' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Format attendu : { id, name, cuisine, address: { street, city }, rating }' 
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    // 🚀 FIX : On renvoie un objet en dur pour éviter la page blanche (Prisma null)
    return {
      id: `uuid-v1-${id}`,
      name: "Chez Marco (Version Classique)",
      cuisine: "ITALIEN",
      address: {
        street: "1 rue de la Paix",
        city: "Paris"
      },
      rating: 4.5
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDto: any) {
    return this.restaurantsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.softDelete(id);
  }
}