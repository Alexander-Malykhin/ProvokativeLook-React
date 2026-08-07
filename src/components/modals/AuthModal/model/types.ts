import type { ChangeEvent, FormEvent } from "react";

export interface LoginFormState {
  email: string;
  password: string;
}

export interface RegisterFormState {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ConfirmFormState {
  code: string;
}

export interface AuthMessageProps {
  errorMessage: string;
  successMessage?: string;
}

export interface LoginFormProps extends AuthMessageProps {
  form: LoginFormState;
  isLoading: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSwitch: () => void;
}

export interface RegisterFormProps extends AuthMessageProps {
  form: RegisterFormState;
  isLoading: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSwitch: () => void;
}

export interface ConfirmEmailFormProps extends AuthMessageProps {
  email: string;
  code: string;
  isLoading: boolean;
  onCodeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
}
