import { useAuthFlow } from '../hooks/useAuthFlow';
import LoginForm from './LoginForm';
import ResetPasswordRequestForm from './ResetPasswordRequestForm';
import ResetPasswordConfirmForm from './ResetPasswordConfirmForm';

export default function EmailLogin({onPhone}:{onPhone:()=>void}) {
 const flow=useAuthFlow();
 const back=()=>flow.changeMode('login');
 if(flow.mode==='resetRequest') return <ResetPasswordRequestForm email={flow.resetForm.email} isLoading={flow.isResetLoading} errorMessage={flow.errorMessage} successMessage={flow.successMessage} onEmailChange={flow.handleResetEmailChange} onSubmit={flow.submitResetRequest} onBack={back}/>;
 if(flow.mode==='resetConfirm') return <ResetPasswordConfirmForm {...flow.resetForm} isLoading={flow.isResetLoading} errorMessage={flow.errorMessage} successMessage={flow.successMessage} onChange={flow.handleResetChange} onSubmit={flow.submitResetConfirm} onBack={back}/>;
 return <LoginForm form={flow.loginForm} isLoading={flow.isLoginLoading} errorMessage={flow.errorMessage} successMessage={flow.successMessage} fieldErrors={flow.loginFieldErrors} onChange={flow.handleLoginChange} onSubmit={flow.submitLogin} onSwitch={onPhone} onForgotPassword={()=>flow.changeMode('resetRequest')}/>;
}
