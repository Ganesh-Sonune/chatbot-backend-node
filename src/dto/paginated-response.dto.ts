export class PaginatedResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}