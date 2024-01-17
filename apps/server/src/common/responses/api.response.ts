export class ApiResponse<T> {
  constructor(
    public data: T,
    public message: string = "Operation was successful",
    public success: boolean = true,
    public errors?: { [key: string]: any },
    public metadata?: { [key: string]: any }
  ) {}

  static success<T>(
    data: T,
    message: string = "Operation was successful"
  ): ApiResponse<T> {
    return new ApiResponse<T>(data, message, true);
  }

  static fail<T>(
    message: string,
    errors?: { [key: string]: any }
  ): ApiResponse<T> {
    return new ApiResponse<T>(null, message, false, errors);
  }

  static paginated<T>(
    data: T,
    page: number,
    pageSize: number,
    total: number,
    message: string = "Operation was successful"
  ): ApiResponse<T> {
    const response = new ApiResponse<T>(data, message, true);
    response.metadata = { page, pageSize, total };
    return response;
  }
}
