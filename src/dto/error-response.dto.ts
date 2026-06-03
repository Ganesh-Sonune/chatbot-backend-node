export class ErrorResponseDto {

  status: string;

  message: string;

  timestamp: Date;

  constructor(
    status: string,
    message: string,
    timestamp: Date,
  ) {
    this.status = status;
    this.message = message;
    this.timestamp = timestamp;
  }
}