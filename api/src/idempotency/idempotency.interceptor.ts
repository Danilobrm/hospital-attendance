import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { IdempotencyService } from './idempotency.service';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class IdempotencyInterceptor implements NestInterceptor {
  constructor(private readonly idempotencyService: IdempotencyService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const idempotencyKey = request.headers['idempotency-key'] as string;

    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is missing.');
    }

    const cachedResponse =
      await this.idempotencyService.getRecord(idempotencyKey);

    if (cachedResponse) {
      //   await this.idempotencyService.deleteIdempotencyCache(idempotencyKey);
      console.log(
        '[IDEMPOTENCY] Returning cached response for key:',
        idempotencyKey,
      );

      return new Observable((subscriber) => {
        subscriber.next(cachedResponse.data);
        subscriber.complete();
      });
    }

    return next.handle().pipe(
      tap((data) => {
        const finalStatus = response.statusCode;

        if (finalStatus === 200 || finalStatus === 201) {
          if (idempotencyKey) {
            this.idempotencyService
              .saveRecord(idempotencyKey, 200, data)
              .catch((err) => {
                console.error('Failed to save idempotency record:', err);
              });
          }
        }
      }),
    );
  }
}
