import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { randomUUID } from 'crypto'; // 👈 Utilisation du module natif Node.js

export interface Response<T> {
  success: boolean;
  data: T;
  timestamp: string;
  requestId: string;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest();
    
    // On s'assure d'avoir un requestId unique pour la requête
    if (!request['requestId']) {
      request['requestId'] = randomUUID(); // 👈 Remplacement de uuidv4()
    }

    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        requestId: request['requestId'], 
      })),
    );
  }
}