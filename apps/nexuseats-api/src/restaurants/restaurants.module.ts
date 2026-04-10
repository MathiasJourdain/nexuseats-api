import { Module } from '@nestjs/common';
import { RestaurantsV1Controller } from './restaurants-v1.controller';
import { RestaurantsV2Controller } from './restaurants-v2.controller';
import { RestaurantsService } from './restaurants.service';
import { PrismaService } from '../prisma.service'; 
import { IsUniqueRestaurantNameConstraint } from './validators/is-unique-restaurant-name.validator';

@Module({
  // 🚀 On met les deux contrôleurs ici pour qu'ils partagent le même Service
  controllers: [
    RestaurantsV1Controller, 
    RestaurantsV2Controller
  ],
  providers: [
    RestaurantsService, 
    PrismaService, 
    IsUniqueRestaurantNameConstraint,
    {
      provide: 'CACHE_MANAGER',
      useValue: {
        get: async () => null,
        set: async () => {},
        del: async () => {},
      },
    },
  ],
  // Optionnel : on l'exporte au cas où tu en aurais besoin ailleurs plus tard
  exports: [RestaurantsService], 
})
export class RestaurantsModule {}