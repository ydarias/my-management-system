export interface UserLoginRequest {
  email: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UserResponse {
  id?: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
}

export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
