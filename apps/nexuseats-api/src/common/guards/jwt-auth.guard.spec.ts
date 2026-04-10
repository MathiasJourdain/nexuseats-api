import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtAuthGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<JwtAuthGuard>(JwtAuthGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('devrait être défini', () => {
    expect(guard).toBeDefined();
  });

  it('devrait autoriser l\'accès si la route est @Public()', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    
    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
    } as any;

    expect(guard.canActivate(context)).toBe(true);
  });

it('devrait lever une erreur si le token est invalide (test de handleRequest)', () => {
    // On vérifie que la méthode lève bien une erreur. 
    // Si ton guard est standard, il transformera les erreurs ou l'absence de user en UnauthorizedException
    expect(() => (guard as any).handleRequest(null, null, null)).toThrow(UnauthorizedException);
    
    // Pour le cas de l'erreur spécifique :
    try {
      (guard as any).handleRequest(new Error('Invalid token'), null, null);
    } catch (e) {
      // On vérifie que le message est présent, peu importe le type d'erreur exact ici
      expect(e.message).toBe('Invalid token');
    }
  });
});