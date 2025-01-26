type SuccessResponse<T> = {
  status: "success";
  data?: T;
  meta?: Record<string, unknown>;
};

type ErrorResponse = {
  status: "error";
  errors?: [];
};

type TApiResponse<T> = (ErrorResponse | SuccessResponse<T>) & {
  statusCode: number;
  message: string;
};

class ApiResponse<T> {
  public status: "success" | "error";
  public statusCode: number;
  public message: string;

  public data?: T;
  public meta?: Record<string, unknown>;

  public errors?: [];

  constructor(data: TApiResponse<T>) {
    this.status = data.status;
    this.statusCode = data.statusCode;
    this.message = data.message;

    if (data.status === "success") {
      this.data = data.data;
      this.meta = data.meta;
    } else {
      this.errors = data.errors;
    }
  }
}

export default ApiResponse;
