import { PartialType } from '@nestjs/swagger';
import { CreateRestaurantV1Dto } from './create-restaurant-v1.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantV1Dto) {}