export interface UserInterface {
  id: number;
  firstName: string;
  lastName: string;
  birthday: string | null;
  email: string;
  phone: string;
  city: string | null;
  country: string | null;
  countryId: number | null;
  countryCode: string | null;
}

export interface UserResponse {
  success: boolean;
  user: UserInterface;
  message?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  birthday?: string;
  email?: string;
  phone?: string;
  city?: string;
  country?: string;
  countryId?: number | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: UserInterface;
  message?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}

export interface RegisterConfirmRequest {
  email: string;
  code: string;
}

export interface RegisterConfirmResponse {
  success: boolean;
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface PasswordResetRequest { email: string; }
export interface PasswordResetConfirmRequest { email: string; code: string; password: string; confirmPassword: string; }
export interface PasswordResetResponse { success: boolean; message?: string; }
