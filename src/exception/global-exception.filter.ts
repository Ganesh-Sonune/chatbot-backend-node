import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';

import { DuplicateResourceException }
from './duplicate-resource.exception';

import { ResourceNotFoundException }
from './resource-not-found.exception';

@Catch()
export class GlobalExceptionFilter
implements ExceptionFilter {

  catch(
    exception: any,
    host: ArgumentsHost,
  ) {

    const ctx =
      host.switchToHttp();

    const response =
      ctx.getResponse<Response>();

    const request =
      ctx.getRequest<Request>();

    let status =
      HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      'Something went wrong';

    let error =
      'ERROR';

    // Resource not found

    if (
      exception instanceof
      ResourceNotFoundException
    ) {

      status =
        HttpStatus.NOT_FOUND;

      message =
        exception.message;
    }

    // Duplicate resource

    else if (
      exception instanceof
      DuplicateResourceException
    ) {

      status =
        HttpStatus.CONFLICT;

      message =
        exception.message;
    }

    // NestJS HTTP exception

    else if (
      exception instanceof HttpException
    ) {

      status =
        exception.getStatus();

      message =
        exception.message;
    }

    response.status(status).json({

      status: error,

      message,

      timestamp: new Date(),

      path: request.url,
    });
  }
}