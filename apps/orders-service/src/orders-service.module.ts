import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrdersServiceController } from './orders-service.controller';

@Module({
  imports: [
    ClientsModule.register([
      // 1. Le client pour les notifications (Celui qu'on a déjà)
      {
        name: 'NOTIFICATIONS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://nexuseats:secret@localhost:5672'],
          queue: 'notifications_queue',
          queueOptions: { durable: true },
        },
      },
      // 2. 🚀 LE NOUVEAU CLIENT pour l'Analytics !
      {
        name: 'ANALYTICS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://nexuseats:secret@localhost:5672'],
          queue: 'analytics_queue', // 👈 La fameuse queue de l'Analytics
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [OrdersServiceController],
})
export class OrdersServiceModule {}