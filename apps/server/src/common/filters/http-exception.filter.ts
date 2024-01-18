// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from "@nestjs/common";
import { Response } from "express";
import { ApiResponse } from "../responses/api.response";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: Logger = new Logger("HttpExceptionFilter");
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    this.logger.error(
      `Http Status: ${status} Error Message: ${JSON.stringify(
        exceptionResponse
      )}`
    );
    response
      .status(status)
      .json(
        ApiResponse.fail(
          exceptionResponse["message"],
          exceptionResponse["errors"]
        )
      );
  }
}
