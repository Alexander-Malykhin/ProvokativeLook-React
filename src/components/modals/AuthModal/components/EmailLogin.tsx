import { useAuthFlow } from '../hooks/useAuthFlow';
import LoginForm from './LoginForm';
import ResetPasswordRequestForm from './ResetPasswordRequestForm';
import ResetPasswordConfirmForm from './ResetPasswordConfirmForm';
import RegisterForm from './RegisterForm';
import ConfirmEmailForm from './ConfirmEmailForm';
import styles from '../AuthModal.module.scss';

export default function EmailLogin({onPhone}:{onPhone:(purpose:'login'|'register')=>void}) {
 const flow=useAuthFlow();
 const back=()=>flow.changeMode('login');
 if(flow.mode==='register') return <><RegisterForm form={flow.registerForm} isLoading={flow.isRegisterLoading} errorMessage={flow.errorMessage} fieldErrors={flow.registerFieldErrors} onChange={flow.handleRegisterChange} onSubmit={flow.submitRegister} onSwitch={back}/><button type="button" className={styles.form__switch} onClick={()=>onPhone('register')} disabled={flow.isLoading}>Вернуться к регистрации по телефону</button></>;
 if(flow.mode==='confirm') return <ConfirmEmailForm email={flow.registerForm.email} code={flow.confirmForm.code} isLoading={flow.isConfirmLoading} errorMessage={flow.errorMessage} successMessage={flow.successMessage} onCodeChange={flow.handleConfirmChange} onSubmit={flow.submitConfirm} onBack={()=>flow.changeMode('register')}/>;
 if(flow.mode==='resetRequest') return <ResetPasswordRequestForm email={flow.resetForm.email} isLoading={flow.isResetLoading} errorMessage={flow.errorMessage} successMessage={flow.successMessage} onEmailChange={flow.handleResetEmailChange} onSubmit={flow.submitResetRequest} onBack={back}/>;
 if(flow.mode==='resetConfirm') return <ResetPasswordConfirmForm {...flow.resetForm} isLoading={flow.isResetLoading} errorMessage={flow.errorMessage} successMessage={flow.successMessage} onChange={flow.handleResetChange} onSubmit={flow.submitResetConfirm} onBack={back} onResend={()=>void flow.submitResetRequest()}/>;
 return <><LoginForm form={flow.loginForm} isLoading={flow.isLoginLoading} errorMessage={flow.errorMessage} successMessage={flow.successMessage} fieldErrors={flow.loginFieldErrors} onChange={flow.handleLoginChange} onSubmit={flow.submitLogin} onSwitch={()=>onPhone('login')} onForgotPassword={()=>flow.changeMode('resetRequest')}/><button type="button" className={styles.form__switch} onClick={()=>flow.changeMode('register')} disabled={flow.isLoading}>Зарегистрироваться по почте</button></>;
}
