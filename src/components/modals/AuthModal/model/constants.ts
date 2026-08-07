import type {
  ConfirmFormState,
  LoginFormState,
  RegisterFormState,
} from "./types";

export const INITIAL_LOGIN_FORM: LoginFormState = {
  email: "",
  password: "",
};

export const INITIAL_REGISTER_FORM: RegisterFormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const INITIAL_CONFIRM_FORM: ConfirmFormState = {
  code: "",
};
