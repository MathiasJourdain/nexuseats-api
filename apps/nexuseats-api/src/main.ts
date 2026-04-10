import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import compression from 'compression';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 📦 Compression
  app.use(compression({
    threshold: 0, 
    level: 6,
  }));

  // 🔢 ÉTAPE 1 : Activation du Versioning URI
  // Par défaut, tout ce qui n'est pas spécifié sera en '1'
  app.enableVersioning({ 
    type: VersioningType.URI, 
    defaultVersion: '1' // 👈 Directive du TP : v1 par défaut
  });

  // 🛡️ Validation globale
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // 🚀 Configuration de Swagger
  const config = new DocumentBuilder()
    .setTitle('NexusEats API (Versioning Edition)')
    .setDescription(
      "Documentation des versions v1 et v2. " +
      "Note : Les routes Auth et Health sont VERSION_NEUTRAL."
    )
    .setVersion('2.0') // On passe à la version 2 de la doc !
    .addTag('auth', 'Pas de version (Neutral)')
    .addTag('restaurants', 'Versions v1 et v2 disponibles')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(3000);
  
  // Logs mis à jour pour refléter les deux versions
  console.log(`✅ API NexusEats v1 & v2 en ligne sur le port 3000`);
  console.log(`📡 V1 : http://localhost:3000/v1/restaurants`);
  console.log(`📡 V2 : http://localhost:3000/v2/restaurants`);
  console.log(`📚 Documentation : http://localhost:3000/api-docs`);
}
bootstrap();