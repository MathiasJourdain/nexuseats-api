import { ApiProperty } from '@nestjs/swagger';

class CoordinatesDto {
  @ApiProperty({ example: 48.8566 })
  lat: number;
  @ApiProperty({ example: 2.3522 })
  lng: number;
}

class AddressV2Dto {
  @ApiProperty({ example: '1 rue de la Paix' })
  street: string;
  @ApiProperty({ example: 'Paris' })
  city: string;
  @ApiProperty({ example: '75001' })
  zipCode: string;
}

class LocationDto {
  @ApiProperty()
  address: AddressV2Dto;
  @ApiProperty()
  coordinates: CoordinatesDto;
}

export class RestaurantV2ResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  location: LocationDto; // 👈 Le changement majeur attendu par Maya
  @ApiProperty()
  rating: number;
  @ApiProperty()
  deliveryRadius: number;
}