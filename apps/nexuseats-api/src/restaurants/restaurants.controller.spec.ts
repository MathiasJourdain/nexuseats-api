import { Controller, Get, Query } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { OffsetPaginationDto, CursorPaginationDto } from '../auth/dto/pagination.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('scroll')
  async getRestaurantsCursor(@Query() query: CursorPaginationDto) {
    return this.restaurantsService.getRestaurantsCursor(query);
  }

  // Route pour la pagination Offset
  @Get()
  async getRestaurantsOffset(@Query() query: OffsetPaginationDto) {
    return this.restaurantsService.getRestaurantsOffset(query);
  }
}