import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'; // 👈 On utilise finalize au lieu de tap
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const now = Date.now();

    // Génération du requestId dès le début de la requête
    if (!request['requestId']) {
      request['requestId'] = uuidv4();
    }
    const requestId = request['requestId'];

    return next.handle().pipe(
      // finalize s'exécute TOUJOURS, que la requête soit un succès ou une erreur !
      finalize(() => {
        const delay = Date.now() - now;
        const logMessage = `[${requestId}] ${method} ${url} - ${delay}ms`;

        if (delay > 1000) {
          this.logger.warn(logMessage); // Alerte si > 1 seconde
        } else {
          this.logger.log(logMessage);  // Log normal
        }
      }),
    );
  }
}