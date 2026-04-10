import { NestFactory } from '@nestjs/core';
import { NotificationsServiceModule } from './notifications-service.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationsServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        // 🔥 L'URL avec les VRAIS identifiants de ton Docker
        urls: ['amqp://nexuseats:secret@localhost:5672'], 
        queue: 'notifications_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  
  await app.listen();
  console.log('✅ Notifications Service connecté à RabbitMQ et en écoute !');
}
bootstrap();