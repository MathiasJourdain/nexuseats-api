// src/restaurants/dto/address.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, IsISO31661Alpha2 } from 'class-validator';

export class AddressDto {
  @ApiProperty({ example: '123 Rue de la Gastronomie' })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Paris' })
  @IsString()
  city: string;

  @ApiProperty({ example: '75001' })
  @Matches(/^\d{5}$/, { message: 'Le code postal doit contenir exactement 5 chiffres' })
  zipCode: string;

  @ApiProperty({ example: 'FR' })
  @IsISO31661Alpha2({ message: 'Le pays doit être un code ISO 3166-1 alpha-2 valide (ex: FR)' })
  country: string;
}