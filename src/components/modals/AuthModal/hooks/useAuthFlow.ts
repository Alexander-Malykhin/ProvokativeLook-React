import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  closeAuthModal,
  setAuthModalMode,
  type AuthModalMode,
} from "@store/slices/toggleAuthModalSlice";
import { close as closeProfileMenu } from "@store/slices/toggleMenuProfileSlice";
import {
  useConfirmRegisterMutation,
  useLoginMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useConfirmPasswordResetMutation,
} from "@store/api/user/userApi";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
import { cartApi } from "@store/api/cart/cartApi";
import { favoritesApi } from "@store/api/favorites/favoritesApi";
import { userApi } from "@store/api/user/userApi";
import {
  INITIAL_CONFIRM_FORM,
  INITIAL_LOGIN_FORM,
  INITIAL_REGISTER_FORM,
} from "../model/constants";
import { isValidPhone, normalizePhone, detectCountry } from "@components/common/PhoneInput/phone";
import type {
  ConfirmFormState,
  LoginFormState,
  LoginFieldErrors,
  LoginFieldName,
  RegisterFormState,
  RegisterFieldErrors,
  RegisterFieldName,
} from "../model/types";

export const useAuthFlow = () => {
  const dispatch = useAppDispatch();
  const { active, mode } = useAppSelector((state) => state.toggleAuthModal);
  const [loginForm, setLoginForm] =
    useState<LoginFormState>(INITIAL_LOGIN_FORM);
  const [registerForm, setRegisterForm] = useState<RegisterFormState>(
    INITIAL_REGISTER_FORM,
  );
  const [confirmForm, setConfirmForm] =
    useState<ConfirmFormState>(INITIAL_CONFIRM_FORM);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginFieldErrors, setLoginFieldErrors] = useState<LoginFieldErrors>({});
  const [registerFieldErrors, setRegisterFieldErrors] = useState<RegisterFieldErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [resetForm, setResetForm] = useState({ email: "", code: "", password: "", confirmPassword: "" });

  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const [confirmRegister, confirmState] = useConfirmRegisterMutation();
  const [requestPasswordReset, resetRequestState] = useRequestPasswordResetMutation();
  const [confirmPasswordReset, resetConfirmState] = useConfirmPasswordResetMutation();

  const isLoading =
    loginState.isLoading || registerState.isLoading || confirmState.isLoading || resetRequestState.isLoading || resetConfirmState.isLoading;

  const validateLogin = useCallback((form: LoginFormState): LoginFieldErrors => {
    const errors: LoginFieldErrors = {};
    const email = form.email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!email) errors.email = "Введите электронную почту";
    else if (!emailPattern.test(email)) errors.email = "Введите корректный email";

    if (!form.password) errors.password = "Введите пароль";

    return errors;
  }, []);

  const focusLoginField = useCallback((field: LoginFieldName) => {
    requestAnimationFrame(() => {
      const element = document.querySelector<HTMLInputElement>(`[name="${field}"]`);
      element?.focus({ preventScroll: true });
    });
  }, []);

  const validateRegister = useCallback((form: RegisterFormState): RegisterFieldErrors => {
    const errors: RegisterFieldErrors = {};
    const namePattern = /^[A-Za-zА-Яа-яЁё\s-]+$/u;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();

    if (!firstName) errors.firstName = "Введите имя";
    else if (firstName.length < 2) errors.firstName = "Минимум 2 символа";
    else if (!namePattern.test(firstName)) errors.firstName = "Только буквы, пробел и дефис";

    if (!lastName) errors.lastName = "Введите фамилию";
    else if (lastName.length < 2) errors.lastName = "Минимум 2 символа";
    else if (!namePattern.test(lastName)) errors.lastName = "Только буквы, пробел и дефис";

    if (!email) errors.email = "Введите электронную почту";
    else if (!emailPattern.test(email)) errors.email = "Введите корректный email";

    if (!form.password) errors.password = "Введите пароль";
    else if (form.password.length < 8) errors.password = "Минимум 8 символов";
    else if (!/[A-ZА-ЯЁ]/.test(form.password)) errors.password = "Добавьте заглавную букву";
    else if (!/\d/.test(form.password)) errors.password = "Добавьте цифру";
    else if (!/[^A-Za-zА-Яа-яЁё0-9]/.test(form.password)) errors.password = "Добавьте специальный символ";

    if (!form.confirmPassword) errors.confirmPassword = "Повторите пароль";
    else if (form.confirmPassword !== form.password) errors.confirmPassword = "Пароли не совпадают";

    if (!form.phone) errors.phone = "Введите номер телефона";
    else if (!isValidPhone(form.phone)) errors.phone = "Введите корректный номер телефона";

    return errors;
  }, []);

  const focusRegisterField = useCallback((field: RegisterFieldName) => {
    requestAnimationFrame(() => {
      const element = document.querySelector<HTMLInputElement>(`[data-register-field="${field}"]`);
      element?.focus({ preventScroll: true });
    });
  }, []);

  const syncClientState = useCallback(async () => {
    const requests = [
      dispatch(userApi.endpoints.getUser.initiate(undefined, { forceRefetch: true })),
      dispatch(cartApi.endpoints.getCart.initiate(undefined, { forceRefetch: true })),
      dispatch(favoritesApi.endpoints.getFavorites.initiate(undefined, { forceRefetch: true })),
    ];

    try {
      await Promise.allSettled(requests.map((request) => request.unwrap()));
    } finally {
      requests.forEach((request) => request.unsubscribe());
    }
  }, [dispatch]);

  const close = useCallback(() => {
    setErrorMessage("");
    setSuccessMessage("");
    setLoginFieldErrors({});
    setRegisterFieldErrors({});
    dispatch(closeAuthModal());
  }, [dispatch]);

  const changeMode = useCallback(
    (nextMode: AuthModalMode) => {
      if (!isLoading) {
        setErrorMessage("");
        setSuccessMessage("");
        setLoginFieldErrors({});
        setRegisterFieldErrors({});
        dispatch(setAuthModalMode(nextMode));
      }
    },
    [dispatch, isLoading],
  );

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const field = name as LoginFieldName;

    setLoginForm((previous) => {
      const nextForm = { ...previous, [name]: value };

      setLoginFieldErrors((previousErrors) => {
        if (!previousErrors[field]) return previousErrors;

        const nextErrors = { ...previousErrors };
        const currentError = validateLogin(nextForm)[field];
        if (currentError) nextErrors[field] = currentError;
        else delete nextErrors[field];
        return nextErrors;
      });

      return nextForm;
    });

    setErrorMessage("");
  };

  const handleRegisterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const field = name as RegisterFieldName;

    setRegisterForm((previous) => {
      const nextForm = { ...previous, [name]: value };

      setRegisterFieldErrors((previousErrors) => {
        if (!previousErrors[field]) return previousErrors;

        const nextErrors = { ...previousErrors };
        const currentError = validateRegister(nextForm)[field];

        if (currentError) nextErrors[field] = currentError;
        else delete nextErrors[field];

        // Password edits can also make the repeated password valid/invalid.
        if (field === "password" && previousErrors.confirmPassword) {
          const confirmError = validateRegister(nextForm).confirmPassword;
          if (confirmError) nextErrors.confirmPassword = confirmError;
          else delete nextErrors.confirmPassword;
        }

        return nextErrors;
      });

      return nextForm;
    });

    setErrorMessage("");
  };

  const handleConfirmChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmForm({
      code: event.target.value.replace(/\D/g, "").slice(0, 6),
    });
  };

  const handleResetEmailChange = (value: string) => {
    setResetForm((previous) => ({ ...previous, email: value }));
  };

  const handleResetChange = (field: "code" | "password" | "confirmPassword", value: string) => {
    setResetForm((previous) => ({ ...previous, [field]: value }));
  };

  const submitResetRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await requestPasswordReset({ email: resetForm.email.trim() }).unwrap();
      if (!response.success) {
        setErrorMessage(response.message ?? "Не удалось отправить код");
        return;
      }
      setSuccessMessage(response.message ?? "Код отправлен на почту");
      dispatch(setAuthModalMode("resetConfirm"));
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    }
  };

  const submitResetConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (resetForm.password !== resetForm.confirmPassword) {
      setErrorMessage("Пароли не совпадают");
      return;
    }
    try {
      const response = await confirmPasswordReset({
        email: resetForm.email.trim(),
        code: resetForm.code,
        password: resetForm.password,
        confirmPassword: resetForm.confirmPassword,
      }).unwrap();
      if (!response.success) {
        setErrorMessage(response.message ?? "Не удалось изменить пароль");
        return;
      }
      setLoginForm({ email: resetForm.email.trim(), password: "" });
      setResetForm({ email: "", code: "", password: "", confirmPassword: "" });
      dispatch(setAuthModalMode("login"));
      setSuccessMessage(response.message ?? "Пароль изменён. Теперь войдите");
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    }
  };

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const fieldErrors = validateLogin(loginForm);
    setLoginFieldErrors(fieldErrors);

    const firstInvalid = Object.keys(fieldErrors)[0] as LoginFieldName | undefined;
    if (firstInvalid) {
      focusLoginField(firstInvalid);
      return;
    }

    try {
      const response = await login({
        email: loginForm.email.trim(),
        password: loginForm.password,
      }).unwrap();

      if (!response.success) {
        setErrorMessage(
          response.message ?? "Неверная электронная почта или пароль",
        );
        return;
      }

      await syncClientState();

      dispatch(closeProfileMenu());
      dispatch(closeAuthModal());
      setLoginForm(INITIAL_LOGIN_FORM);
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    }
  };

  const submitRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const fieldErrors = validateRegister(registerForm);
    setRegisterFieldErrors(fieldErrors);

    const firstInvalid = Object.keys(fieldErrors)[0] as RegisterFieldName | undefined;
    if (firstInvalid) {
      focusRegisterField(firstInvalid);
      return;
    }

    try {
      const response = await register({
        firstName: registerForm.firstName.trim(),
        lastName: registerForm.lastName.trim(),
        phone: normalizePhone(registerForm.phone, detectCountry(registerForm.phone)),
        email: registerForm.email.trim(),
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword,
      }).unwrap();

      if (!response.success) {
        setErrorMessage(response.message ?? "Не удалось зарегистрироваться");
        return;
      }

      setRegisterFieldErrors({});
      setConfirmForm(INITIAL_CONFIRM_FORM);
      dispatch(setAuthModalMode("confirm"));
      setSuccessMessage(
        response.message ?? "Код подтверждения отправлен на почту",
      );
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    }
  };

  const submitConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await confirmRegister({
        email: registerForm.email.trim(),
        code: confirmForm.code,
      }).unwrap();

      if (!response.success) {
        setErrorMessage(response.message ?? "Неверный код подтверждения");
        return;
      }

      const loginResponse = await login({
        email: registerForm.email.trim(),
        password: registerForm.password,
      }).unwrap();

      if (loginResponse.success) {
        await syncClientState();

        dispatch(closeProfileMenu());
        dispatch(closeAuthModal());
        setRegisterForm(INITIAL_REGISTER_FORM);
        setConfirmForm(INITIAL_CONFIRM_FORM);
        return;
      }

      setLoginForm({ email: registerForm.email, password: "" });
      dispatch(setAuthModalMode("login"));
      setSuccessMessage("Почта подтверждена. Теперь войдите в аккаунт");
    } catch (error) {
      setErrorMessage(getRequestErrorMessage(error));
    }
  };

  return {
    active,
    mode,
    loginForm,
    registerForm,
    confirmForm,
    resetForm,
    errorMessage,
    successMessage,
    loginFieldErrors,
    registerFieldErrors,
    isLoading,
    isLoginLoading: loginState.isLoading,
    isRegisterLoading: registerState.isLoading,
    isConfirmLoading: confirmState.isLoading,
    isResetLoading: resetRequestState.isLoading || resetConfirmState.isLoading,
    close,
    changeMode,
    handleLoginChange,
    handleRegisterChange,
    handleConfirmChange,
    handleResetEmailChange,
    handleResetChange,
    submitResetRequest,
    submitResetConfirm,
    submitLogin,
    submitRegister,
    submitConfirm,
  };
};
