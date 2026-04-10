import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsEnum, Matches, IsEmail, ValidateNested, IsArray, ArrayMinSize, IsUUID, IsPositive, IsBoolean, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from './address.dto';
import { IsUniqueRestaurantName } from '../validators/is-unique-restaurant-name.validator'; // Adaptez le chemin selon votre structure

export enum CuisineType {
  ITALIEN = 'Italien',
  JAPONAIS = 'Japonais',
  FAST_FOOD = 'Fast-food',
  FRANCAIS = 'Français',
}

export class CreateRestaurantV1Dto {
  @ApiProperty({ example: 'Nexus Burger', description: 'Le nom du restaurant' })
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsUniqueRestaurantName() // Le Custom Validator de l'Étape 3
  name: string;

  @ApiProperty({ example: 'Fast-food', description: 'Type de cuisine servie', enum: CuisineType })
  @IsEnum(CuisineType)
  category: CuisineType; // Correspond au champ "cuisine" du TP

  @ApiProperty({ example: '+33612345678', description: 'Numéro de téléphone' })
  @Matches(/^\+?[0-9]{10,15}$/, { message: 'Le numéro de téléphone est invalide' })
  phone: string;

  @ApiProperty({ example: 'contact@nexusburger.com', description: 'Email de contact' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 15.5, description: 'Prix moyen' })
  @IsPositive()
  price: number;

  @ApiProperty({ type: () => AddressDto, description: 'Adresse physique du restaurant' })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({ example: ['123e4567-e89b-12d3-a456-426614174000'], description: 'IDs des catégories' })
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID('all', { each: true })
  categoryIds: string[];

  @ApiProperty({ example: 4.5, description: 'Note moyenne sur 5', minimum: 0, maximum: 5, required: false })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiProperty({ example: true, description: 'Indique si le restaurant propose la livraison', default: true })
  @IsBoolean()
  isDeliverable: boolean;
}