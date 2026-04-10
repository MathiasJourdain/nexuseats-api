import { GlobalExceptionFilter } from './global-exception.filter';
import { ArgumentsHost } from '@nestjs/common';
import { Prisma } from '@prisma/client';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;

  beforeEach(() => {
    filter = new GlobalExceptionFilter();
  });

  it('devrait transformer P2002 en 409 Conflict', () => {
    // On simule une erreur Prisma de doublon
    const exception = new Prisma.PrismaClientKnownRequestError('Doublon', {
      code: 'P2002',
      clientVersion: 'x',
      meta: { target: ['name'] }
    });

    // Mock des objets Express
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    const mockGetResponse = jest.fn().mockReturnValue({ status: mockStatus });
    
    const mockHost: ArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: mockGetResponse,
        getRequest: jest.fn().mockReturnValue({ url: '/test' }),
      }),
    } as any;

    filter.catch(exception, mockHost);

    // On vérifie que le status renvoyé est bien 409
    expect(mockStatus).toHaveBeenCalledWith(409);
    expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      error: expect.objectContaining({ statusCode: 409 })
    }));
  });
});