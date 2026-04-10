import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OffsetPaginationDto, CursorPaginationDto } from '../auth/dto/pagination.dto';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  // ÉTAPE 2 : Whitelist pour ?fields= (Sécurité et Performance)
  private getSelectFields(fields?: string) {
    if (!fields) return undefined;
    const allowed = ['id', 'name', 'cuisine', 'rating', 'address'];
    const select = {};
    fields.split(',').forEach(f => {
      const field = f.trim();
      if (allowed.includes(field)) select[field] = true;
    });
    return Object.keys(select).length > 0 ? select : undefined;
  }

  // ÉTAPE 3 : findAll avec sélection dynamique (réduit la charge réseau)
  async getRestaurantsOffset(dto: OffsetPaginationDto, fields?: string) {
    const { page = 1, limit = 20 } = dto;
    const select = this.getSelectFields(fields);

    const [data, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        skip: (page - 1) * limit,
        take: limit,
        select, // Sélection de champs Prisma
        orderBy: { id: 'asc' },
      }),
      this.prisma.restaurant.count(),
    ]);

    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  // ÉTAPE 3 : Résolution N+1 (1 seule requête SQL avec JOIN)
  async findOne(id: number) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        menus: {
          include: { items: { include: { categories: true } } }
        }
      }
    });
  }

  // --- CRUD Standard ---
  async create(dto: any, ownerId: number) {
    return this.prisma.restaurant.create({ data: { ...dto, ownerId } });
  }

  async update(id: number, dto: any) {
    return this.prisma.restaurant.update({ where: { id }, data: dto });
  }
  
async findAll(page: number, limit: number) {
  return this.getRestaurantsOffset({ page, limit });
}


  async softDelete(id: number) {
    return this.prisma.restaurant.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async getRestaurantsCursor(dto: CursorPaginationDto) {
    const { cursor, limit = 20 } = dto;
    return this.prisma.restaurant.findMany({
      take: limit + 1,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: +cursor } : undefined,
      orderBy: { id: 'asc' },
    });
  }
}