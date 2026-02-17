import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<any>();
    const request = ctx.getRequest<any>();
    const requestId = request['requestId'];

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';

    if (exception instanceof HttpException) {
      status = (exception as HttpException).getStatus();
      const exceptionResponse = (exception as HttpException).getResponse();
      message = typeof exceptionResponse === 'object' ? (exceptionResponse as any).message : exceptionResponse;
    } else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`[${requestId}] Internal Error: ${exception.stack}`);
    }

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
      message: Array.isArray(message) ? message.join('. ') : message,
    };

    this.logger.warn(
      `[${requestId}] ${request.method} ${request.url} - ${status} - ${errorResponse.message}`,
    );

    response.status(status).json(errorResponse);
  }
}