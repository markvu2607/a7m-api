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

import { ResponseData } from '../types/response-data.type';
import { METADATA_KEYS } from '../constants/metadata-key.constant';

interface ResponseFormat<T> extends ResponseData<T> {
  status: number;
  message: string;
}

@Injectable()
export class ResponseFormatInterceptor<T>
  implements NestInterceptor<T, ResponseFormat<T>>
{
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseFormat<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<ExpressResponse>();
    const statusCode: number = response.statusCode;
    const message = this.reflector.getAllAndOverride<string>(
      METADATA_KEYS.MESSAGE_RESPONSE,
      [context.getHandler(), context.getClass()],
    );

    return next.handle().pipe(
      map((data: ResponseData<T>) => {
        const responseFormat: ResponseFormat<T> = {
          status: statusCode || HttpStatus.OK,
          message: message || '',
          ...data,
        };
        return responseFormat;
      }),
    );
  }
}
