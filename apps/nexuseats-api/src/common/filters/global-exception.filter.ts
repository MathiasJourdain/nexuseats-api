import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto'; // 👈 Utilisation du module natif (pas de bug Jest)
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // On génère un ID unique pour le suivi de l'erreur
    const requestId = request['requestId'] || randomUUID();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Une erreur inattendue est survenue.';
    let errorType = 'Internal Server Error';

    // 1. Gestion des erreurs NestJS (HttpException)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse() as any;
      message = res.message || res;
      errorType = exception.name;
    } 
    // 2. Gestion des erreurs Prisma (Base de données)
    else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002': // Doublon (ex: Nom de restaurant déjà pris)
          status = HttpStatus.CONFLICT;
          message = 'Une ressource avec ces données existe déjà.';
          errorType = 'Conflict';
          break;
        case 'P2025': // Non trouvé
          status = HttpStatus.NOT_FOUND;
          message = 'Enregistrement non trouvé.';
          errorType = 'Not Found';
          break;
        case 'P2003': // Clé étrangère invalide
          status = HttpStatus.BAD_REQUEST;
          message = 'Référence invalide (clé étrangère).';
          errorType = 'Bad Request';
          break;
      }
    } 
    // 3. Erreurs critiques (Crash 500)
    else {
      this.logger.error(`[CRITICAL ERROR] ID: ${requestId}`, exception);
      message = exception?.message || message;
    }

    // Format de réponse imposé par le brief de Jordan (TP2)
    response.status(status).json({
      success: false,
      error: {
        requestId,
        statusCode: status,
        message: message,
        error: errorType,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    });
  }
}