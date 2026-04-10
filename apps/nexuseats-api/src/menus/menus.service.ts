import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenusService {
  constructor(private prisma: PrismaService) {}

  // Créer un menu en le connectant à un restaurant existant
  create(restaurantId: number, data: { name: string; description?: string }) {
    return this.prisma.menu.create({
      data: {
        name: data.name,
        description: data.description,
        restaurant: { connect: { id: restaurantId } }, // Magie de Prisma : on lie les deux !
      },
    });
  }

  // Récupérer tous les menus d'un restaurant précis
  findAllByRestaurant(restaurantId: number) {
    return this.prisma.menu.findMany({
      where: { restaurantId },
      include: { items: true }, // On inclut les plats pour anticiper la suite
    });
  }

  findOne(id: number) {
    return this.prisma.menu.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  update(id: number, data: Prisma.MenuUpdateInput) {
    return this.prisma.menu.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.menu.delete({
      where: { id },
    });
  }
}