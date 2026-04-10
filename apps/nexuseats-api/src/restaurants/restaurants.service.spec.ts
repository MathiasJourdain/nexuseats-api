import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { PrismaService } from '../prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';

const CACHE_MANAGER = 'CACHE_MANAGER';

describe('RestaurantsService', () => {
  let service: RestaurantsService;
  let prisma: PrismaService;
  let cacheManager: any;

  const mockPrismaService = {
    restaurant: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    prisma = module.get<PrismaService>(PrismaService);
    cacheManager = module.get(CACHE_MANAGER);
    jest.clearAllMocks();
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

  describe('findAll', () => {
    it('devrait retourner depuis le CACHE (HIT)', async () => {
      const cached = { data: [{ id: 1 }], meta: {} };
      mockCacheManager.get.mockResolvedValue(cached);
      const result = await service.findAll(1, 10);
      expect(mockCacheManager.get).toHaveBeenCalled();
      expect(result).toEqual(cached);
    });

    it('devrait appeler PRISMA si le cache est vide (MISS)', async () => {
      mockCacheManager.get.mockResolvedValue(null);
      mockPrismaService.restaurant.findMany.mockResolvedValue([]);
      mockPrismaService.restaurant.count.mockResolvedValue(0);
      await service.findAll(1, 10);
      expect(mockPrismaService.restaurant.findMany).toHaveBeenCalled();
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('succès findOne', async () => {
      mockPrismaService.restaurant.findFirst.mockResolvedValue({ id: 1 });
      expect(await service.findOne(1)).toBeDefined();
    });
    it('échec findOne 404', async () => {
      mockPrismaService.restaurant.findFirst.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('succès création', async () => {
      mockPrismaService.restaurant.findFirst.mockResolvedValue(null);
      mockPrismaService.restaurant.create.mockResolvedValue({ id: 1 });
      await service.create({ name: 'New' }, 1);
      expect(mockCacheManager.del).toHaveBeenCalled();
    });
    it('erreur 409 doublon de nom', async () => {
      mockPrismaService.restaurant.findFirst.mockResolvedValue({ id: 1 });
      await expect(service.create({ name: 'Existe' }, 1)).rejects.toThrow(ConflictException);
    });
    it('formatage adresse objet vers string', async () => {
      mockPrismaService.restaurant.findFirst.mockResolvedValue(null);
      const addr = { street: 'Rue', zipCode: '59', city: 'Lille', country: 'FR' };
      await service.create({ name: 'Add', address: addr }, 1);
      expect(mockPrismaService.restaurant.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ address: 'Rue, 59 Lille, FR' })
      }));
    });
  });

  describe('update & delete', () => {
    it('update succès et clean cache', async () => {
      mockPrismaService.restaurant.findFirst.mockResolvedValue({ id: 1 });
      mockPrismaService.restaurant.update.mockResolvedValue({ id: 1 });
      await service.update(1, { name: 'Up' });
      expect(mockCacheManager.del).toHaveBeenCalled();
    });
    it('softDelete succès', async () => {
      mockPrismaService.restaurant.findFirst.mockResolvedValue({ id: 1 });
      await service.softDelete(1);
      expect(mockPrismaService.restaurant.delete).toHaveBeenCalled();
    });
  });
});