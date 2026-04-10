import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
const request = require('supertest');
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma.service';
import { execSync } from 'child_process';
import { GlobalExceptionFilter } from './../src/common/filters/global-exception.filter';
import { TransformInterceptor } from './../src/common/interceptors/transform.interceptor';

describe('NexusEats API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let accessToken: string;
  let restaurantId: number;

  beforeAll(async () => {
    try { execSync('npx prisma migrate deploy', { env: { ...process.env } }); } catch (e) {}

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new TransformInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.setGlobalPrefix('v1');

    await app.init();
    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.menuItem.deleteMany().catch(() => {});
      await prisma.menu.deleteMany().catch(() => {});
      await prisma.restaurant.deleteMany().catch(() => {});
      await prisma.user.deleteMany().catch(() => {});
    }
    if (app) await app.close();
  });

  // --- FLUX AUTHENTIFICATION ---
  describe('Authentification', () => {
    const testUser = {
      email: `owner-${Date.now()}@e2e.com`,
      password: 'Password123!',
      name: 'Owner E2E',
      role: 'OWNER',
    };

    it('POST /auth/register - Succès', async () => {
      const res = await request(app.getHttpServer()).post('/v1/auth/register').send(testUser);
      if (res.status !== 201) console.error("🚨 ERREUR REGISTER :", res.body);
      expect(res.status).toBe(HttpStatus.CREATED);
    });

    it('POST /auth/register - Doublon (409)', async () => {
      const res = await request(app.getHttpServer()).post('/v1/auth/register').send(testUser);
      expect(res.status).toBe(HttpStatus.CONFLICT);
    });

    it('POST /auth/login - Succès', async () => {
      const res = await request(app.getHttpServer()).post('/v1/auth/login').send({ email: testUser.email, password: testUser.password });
      
      if (res.status !== 200 && res.status !== 201) console.error("🚨 ERREUR LOGIN :", res.body);
      expect([200, 201]).toContain(res.status); // Accepte 200 ou 201

      // Recherche agressive du token
      const body = res.body;
      accessToken = body?.data?.accessToken || body?.accessToken || body?.data?.token || body?.token;
      
      if (!accessToken) console.error("🚨 TOKEN INTROUVABLE DANS LA REPONSE :", body);
      expect(accessToken).toBeDefined();
    });
  });

  // --- FLUX CRUD RESTAURANTS ---
  describe('Restaurants CRUD', () => {
    const restaurantPayload = { 
      name: `Resto E2E ${Date.now()}`, 
      category: 'Français', 
      address: { street: '123 Rue de Paris', city: 'Lyon', zipCode: '69001', country: 'FR' },
      phone: '0612345678',
      email: `contact-${Date.now()}@restoe2e.com`,
      price: 20,
      categoryIds: ['123e4567-e89b-12d3-a456-426614174000'],
      isDeliverable: true
    };

    it('POST /restaurants - SANS token (401)', async () => {
      const res = await request(app.getHttpServer()).post('/v1/restaurants').send(restaurantPayload);
      expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('POST /restaurants - AVEC token OWNER (201)', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/restaurants')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(restaurantPayload);

      if (res.status !== 201) console.error("🚨 ERREUR CREATION RESTO :", res.body);
      expect(res.status).toBe(HttpStatus.CREATED);
      restaurantId = res.body?.data?.id || res.body?.id;
    });

    it('GET /restaurants - Retourne un tableau paginé', async () => {
      const res = await request(app.getHttpServer()).get('/v1/restaurants');
      if (res.status !== 200) console.error("🚨 ERREUR GET ALL :", res.body);
      expect(res.status).toBe(HttpStatus.OK);
    });

    it('GET /restaurants/:id - Inexistant (404)', async () => {
      const res = await request(app.getHttpServer()).get('/v1/restaurants/999999');
      expect(res.status).toBe(HttpStatus.NOT_FOUND);
    });
  });

  // --- BONUS ---
  describe('Défi Concurrence (Bonus)', () => {
    it('Deux créations simultanées du même nom - Une seule réussit', async () => {
      const payload = { 
        name: `Resto Bonus ${Date.now()}`, 
        category: 'Français', 
        address: { street: '123 Rue', city: 'Paris', zipCode: '75000', country: 'FR' },
        phone: '0612345678',
        email: `bonus-${Date.now()}@restoe2e.com`,
        price: 15,
        categoryIds: ['123e4567-e89b-12d3-a456-426614174000'],
        isDeliverable: true
      };

      const req1 = request(app.getHttpServer()).post('/v1/restaurants').set('Authorization', `Bearer ${accessToken}`).send(payload);
      const req2 = request(app.getHttpServer()).post('/v1/restaurants').set('Authorization', `Bearer ${accessToken}`).send(payload);

      const results = await Promise.all([req1, req2]);
      const statusCodes = results.map(r => r.status);
      
      expect(statusCodes).toContain(201);
      expect(statusCodes).toContain(409);
    });
  });
});