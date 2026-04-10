import { ApiProperty } from '@nestjs/swagger';

export class CreateRestaurantV2Dto {
  @ApiProperty({ example: 'Nexus Burger Premium', description: 'Nom du restaurant' })
  name: string;

  @ApiProperty({ example: 'Gastronomie', description: 'Catégorie du restaurant' })
  category: string;

  @ApiProperty({ 
    example: '+33', 
    description: 'Indicatif pays (ex: +33 pour la France)' 
  })
  countryCode: string;

  @ApiProperty({ 
    example: '612345678', 
    description: 'Numéro de téléphone sans le premier 0' 
  })
  localNumber: string;
}