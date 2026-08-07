export type AuthFormMode =
    | 'login'
    | 'register'
    | 'confirm';

export interface LoginFormInterface {
    email: string;
    password: string;
}

export interface RegisterFormInterface {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ConfirmFormInterface {
    code: string;
}