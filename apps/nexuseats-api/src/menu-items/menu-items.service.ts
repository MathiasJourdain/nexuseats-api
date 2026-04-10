import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}

  // Création avec relation : on connecte au Menu ET aux Catégories (20 points)
  create(menuId: number, data: { name: string; price: number; categoryIds?: number[] }) {
    return this.prisma.menuItem.create({
      data: {
        name: data.name,
        price: data.price,
        menu: { connect: { id: menuId } },
        // On gère la relation N:M demandée par Mia :
        categories: data.categoryIds ? {
          connect: data.categoryIds.map(id => ({ id }))
        } : undefined,
      },
    });
  }

  findAllByMenu(menuId: number) {
    return this.prisma.menuItem.findMany({
      where: { menuId },
      include: { categories: true }, // On inclut les catégories pour vérifier que ça marche
    });
  }

  update(id: number, data: { name?: string; price?: number; available?: boolean; categoryIds?: number[] }) {
    const updateData: Prisma.MenuItemUpdateInput = {
      name: data.name,
      price: data.price,
      available: data.available,
    };

    // Si on envoie des catégories, le mot-clé "set" de Prisma remplace les anciennes par les nouvelles
    if (data.categoryIds) {
      updateData.categories = { set: data.categoryIds.map(catId => ({ id: catId })) };
    }

    return this.prisma.menuItem.update({
      where: { id },
      data: updateData,
    });
  }

  remove(id: number) {
    return this.prisma.menuItem.delete({
      where: { id },
    });
  }
}