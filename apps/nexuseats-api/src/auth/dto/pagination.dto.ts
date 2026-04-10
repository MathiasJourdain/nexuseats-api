import { IsOptional, IsInt, Min, Max, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger'; // 👈 Import indispensable

export class OffsetPaginationDto {
  @ApiProperty({ 
    description: 'Le numéro de la page à afficher', 
    example: 1, 
    default: 1,
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ 
    description: 'Nombre d’éléments maximum par page (limité à 100)', 
    example: 10, 
    default: 20,
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class CursorPaginationDto {
  @ApiProperty({ 
    description: 'L’identifiant (ou token) du dernier élément pour la pagination infinie', 
    example: 'eyJpZCI6MTIzfQ==', 
    required: false 
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiProperty({ 
    description: 'Nombre d’éléments à récupérer pour le scroll', 
    example: 15, 
    default: 20,
    required: false 
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}