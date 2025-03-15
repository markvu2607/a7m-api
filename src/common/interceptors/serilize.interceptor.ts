import { ClassConstructor, plainToInstance } from 'class-transformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';

interface Response {
  data?: unknown;
  metadata?: Record<string, unknown>;
}

export function Serialize<T>(dto: ClassConstructor<T>) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor<any>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: Response): Response => {
        return {
          ...data,
          data: plainToInstance(this.dto, data.data, {
            excludeExtraneousValues: true,
            enableImplicitConversion: true,
            exposeUnsetFields: false,
          }),
        };
      }),
    );
  }
}
