import { PrismaClient, CuisineType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as bcrypt from 'bcrypt'; //

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Démarrage du seed...');

  // 1. Création d'un utilisateur Admin pour posséder les restaurants du seed
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@nexus.dev' },
    update: {},
    create: {
      email: 'admin@nexus.dev',
      password: hashedPassword,
      role: 'admin', //
    },
  });

  console.log(`👤 Utilisateur Admin prêt : ${adminUser.email}`);

  // 2. Création des restaurants liés à cet Admin
  await prisma.restaurant.create({
    data: {
      name: 'Nexus Burger',
      cuisine: CuisineType.BURGER,
      address: '42 Rue du Code',
      rating: 4.8,
      // Lien obligatoire vers le propriétaire
      owner: {
        connect: { id: adminUser.id }
      },
      menus: {
        create: [
          { 
            name: 'Menu Classic', 
            items: { 
              create: [
                { name: 'Cheeseburger', price: 10.50 }, 
                { name: 'Frites', price: 3.50 }
              ] 
            } 
          },
          { 
            name: 'Menu Veggie', 
            items: { 
              create: [
                { name: 'Burger Tofu', price: 11.00 }, 
                { name: 'Salade', price: 4.00 }
              ] 
            } 
          }
        ]
      }
    }
  });

  console.log('✅ Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Ferme proprement la connexion pg
  });