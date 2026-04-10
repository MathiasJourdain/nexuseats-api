import { NestFactory } from '@nestjs/core';
import { OrdersServiceModule } from './orders-service.module';

async function bootstrap() {
  // On crée une application HTTP classique (une API Web), pas un Microservice
  const app = await NestFactory.create(OrdersServiceModule);
  
  // On lui dit d'écouter les requêtes HTTP sur le port 3000
  await app.listen(3000);
  console.log('🚀 Orders API en ligne et prête à recevoir des requêtes POST sur le port 3000 !');
}
bootstrap();