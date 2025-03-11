import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Response as ExpressResponse } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { METADATA_KEYS } from '../constants/metadata-key.constant';

type ApiResponseError = {
  error?: string;
};

type ApiResponseSuccess<T> = {
  success: true;
  data?: T;
  metadata?: Record<string, unknown>;
};

type ApiResponse<T> = {
  statusCode: number;
  message: string | string[];
} & (ApiResponseError | ApiResponseSuccess<T>);

@Injectable()
export class ResponseFormatInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const statusCode: number = response.statusCode;
    const message = this.reflector.getAllAndOverride<string>(
      METADATA_KEYS.MESSAGE_RESPONSE,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data: ApiResponse<T>) => {
        const responseFormat: ApiResponse<T> = {
          ...data,
          statusCode: statusCode || HttpStatus.OK,
          message: message || '',
          success: true,
        };
        return responseFormat;
      }),
    );
  }
}
