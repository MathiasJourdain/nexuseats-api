import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma.module';
import { RestaurantsModule } from './restaurants/restaurants.module';

// 👇 Imports pour le Versioning & RabbitMQ
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GatewayOrdersController } from './gateway-orders.controller';
import { RestaurantsV2Controller } from './restaurants/restaurants-v2.controller'; // 👈 Nouveau !
import { AuthController } from './auth/auth.controller'; // 👈 Nouveau !

@Module({
  imports: [
    PrismaModule,
    RestaurantsModule, // Contient normalement RestaurantsV1Controller
    
    // Ton Rate Limiting (Essentiel pour le point sur l'Auth / 429)
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 60000, limit: 100 },
    ]),

    // Configuration RabbitMQ pour les commandes
    ClientsModule.register([
      {
        name: 'ORDERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://nexuseats:secret@localhost:5672'],
          queue: 'orders_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
  ],
  controllers: [
    AuthController,           // 👈 Gère le login (Version Neutral)
    GatewayOrdersController,  // Gère /v1/orders
    RestaurantsV2Controller,  // 👈 Gère /v2/restaurants (Le nouveau format GPS)
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, 
    },
  ],
})
export class AppModule {}