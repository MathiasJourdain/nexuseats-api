import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ 
    description: 'Email du client', 
    example: 'client@nexuseats.fr' 
  })
  customerEmail: string;

  @ApiProperty({ 
    description: 'Liste des plats', 
    example: ['Pizza', 'Soda'],
    type: [String]
  })
  items: string[];

  @ApiProperty({ 
    description: 'Prix total', 
    example: 15.50 
  })
  total: number;
}