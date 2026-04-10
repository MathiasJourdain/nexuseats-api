import { NestFactory } from '@nestjs/core';
import { AnalyticsServiceModule } from './analytics-service.module'; // Vérifie le nom exact du module généré
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AnalyticsServiceModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://nexuseats:secret@localhost:5672'], // Tes identifiants Docker
        queue: 'analytics_queue', // 👈 UNE QUEUE DIFFÉRENTE !
        queueOptions: {
          durable: true,
        },
      },
    },
  );
  
  await app.listen();
  console.log('📈 Analytics Service connecté à RabbitMQ et en écoute !');
}
bootstrap();