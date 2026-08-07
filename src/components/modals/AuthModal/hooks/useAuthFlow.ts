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
} from "@store/api/user/userApi";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
import {
  INITIAL_CONFIRM_FORM,
  INITIAL_LOGIN_FORM,
  INITIAL_REGISTER_FORM,
} from "../model/constants";
import type {
  ConfirmFormState,
  LoginFormState,
  RegisterFormState,
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
  const [successMessage, setSuccessMessage] = useState("");

  const [login, loginState] = useLoginMutation();
  const [register, registerState] = useRegisterMutation();
  const [confirmRegister, confirmState] = useConfirmRegisterMutation();

  const isLoading =
    loginState.isLoading || registerState.isLoading || confirmState.isLoading;

  const close = useCallback(() => {
    if (!isLoading) {
      setErrorMessage("");
      setSuccessMessage("");
      dispatch(closeAuthModal());
    }
  }, [dispatch, isLoading]);

  const changeMode = useCallback(
    (nextMode: AuthModalMode) => {
      if (!isLoading) {
        setErrorMessage("");
        setSuccessMessage("");
        dispatch(setAuthModalMode(nextMode));
      }
    },
    [dispatch, isLoading],
  );

  const handleLoginChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleRegisterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegisterForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleConfirmChange = (event: ChangeEvent<HTMLInputElement>) => {
    setConfirmForm({
      code: event.target.value.replace(/\D/g, "").slice(0, 6),
    });
  };

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

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

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage("Пароли не совпадают");
      return;
    }

    try {
      const response = await register({
        firstName: registerForm.firstName.trim(),
        lastName: registerForm.lastName.trim(),
        phone: registerForm.phone.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
        confirmPassword: registerForm.confirmPassword,
      }).unwrap();

      if (!response.success) {
        setErrorMessage(response.message ?? "Не удалось зарегистрироваться");
        return;
      }

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
    errorMessage,
    successMessage,
    isLoading,
    isLoginLoading: loginState.isLoading,
    isRegisterLoading: registerState.isLoading,
    isConfirmLoading: confirmState.isLoading,
    close,
    changeMode,
    handleLoginChange,
    handleRegisterChange,
    handleConfirmChange,
    submitLogin,
    submitRegister,
    submitConfirm,
  };
};
