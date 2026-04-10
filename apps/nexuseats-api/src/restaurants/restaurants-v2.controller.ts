import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  DefaultValuePipe, 
  ParseIntPipe, 
  UseGuards, 
  Delete, 
  Param 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantV2Dto } from './dto/create-restaurant-v2.dto';
import { RestaurantV2ResponseDto } from '../dto/restaurant-v2.dto'; // 👈 On va créer ce DTO de réponse
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('restaurants-v2') // Un tag clair pour la V2
@ApiBearerAuth()
@Controller({ 
  path: 'restaurants', 
  version: '2' 
})
export class RestaurantsV2Controller {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('owner', 'admin')
  @ApiOperation({ summary: 'Créer un restaurant (V2 - Format enrichi)' })
  @ApiResponse({ status: 201, description: 'Restaurant créé avec le nouveau format de contact.' })
  create(
    @Body() createDto: CreateRestaurantV2Dto, 
    @CurrentUser() user: any 
  ) {
    return this.restaurantsService.create(createDto as any, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Liste des restaurants (V2 - Pagination standard)' })
  @ApiResponse({ status: 200, type: [RestaurantV2ResponseDto] }) // On documente le type de retour
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, 
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.restaurantsService.findAll(page, limit);
  }

  // 🚀 ÉTAPE CLÉ : Le endpoint spécifiquement demandé par Maya pour la V2
  @Get(':id')
  @ApiOperation({ 
    summary: 'Détails du restaurant V2 (Format avec Coordonnées GPS)',
    description: 'Format enrichi incluant la localisation précise et le rayon de livraison.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Format V2 : { location: { address, coordinates }, ... }',
    type: RestaurantV2ResponseDto 
  })
  @ApiResponse({ status: 404, description: 'Restaurant introuvable.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    // Pour le TP, on simule le retour au format V2 demandé
    return {
      id: `uuid-${id}`,
      name: 'Chez Marco - V2 Premium',
      cuisine: 'ITALIEN',
      location: {
        address: { street: '1 rue de la Paix', city: 'Paris', zipCode: '75001' },
        coordinates: { lat: 48.8566, lng: 2.3522 }
      },
      rating: 4.8,
      deliveryRadius: 5
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Supprimer un restaurant (Admin seulement)' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.softDelete(id);
  }
}