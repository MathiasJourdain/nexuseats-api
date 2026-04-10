import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);

    // ÉTAPE 3 : On ajoute l'option 'log' pour voir les requêtes SQL dans ton terminal
    super({ 
      adapter,
      log: ['query', 'info', 'warn', 'error'], 
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('✅ Connexion à PostgreSQL réussie via l\'Adapter PG !');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}