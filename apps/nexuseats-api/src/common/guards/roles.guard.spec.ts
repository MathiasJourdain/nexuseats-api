import { RolesGuard } from '../../auth/guards/roles.guard';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext } from '@nestjs/common';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(), // On mocke .get() car ton guard l'utilise
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  const createMockContext = (userRole?: string): ExecutionContext => ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({
        user: userRole ? { role: userRole } : null,
      }),
    }),
  } as any);

  it('devrait retourner true si aucun rôle n est défini', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(null);
    const context = createMockContext('user');
    expect(guard.canActivate(context)).toBe(true);
  });

  it('devrait retourner true si le user a le bon rôle', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    const context = createMockContext('admin');
    expect(guard.canActivate(context)).toBe(true);
  });

  it('devrait retourner false si le rôle est insuffisant', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
    const context = createMockContext('user');
    expect(guard.canActivate(context)).toBe(false);
  });
});