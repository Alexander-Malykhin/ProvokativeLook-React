import Modal from '@UI/overlays/Modal/Modal';
import { useEffect, useState } from 'react';
import EmailLogin from './components/EmailLogin';
import { useGetUserQuery } from '@store/api/user/userApi';
import { animateModalClose } from '@UI/overlays/Modal/animateModalClose';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { closeAuthModal } from '@store/slices/toggleAuthModalSlice';
import { close as closeProfileMenu } from '@store/slices/toggleMenuProfileSlice';
import PhoneVerification from '@components/auth/PhoneVerification';
import styles from './AuthModal.module.scss';
export default function AuthModal(){
 const active=useAppSelector(state=>state.toggleAuthModal.active); const dispatch=useAppDispatch();
 const [emailLogin,setEmailLogin]=useState(false);
 const [phonePurpose,setPhonePurpose]=useState<'login'|'register'>('login');
 const {data,isLoading,isFetching,error,refetch}=useGetUserQuery(undefined,{skip:!active,refetchOnMountOrArgChange:true});
 const authenticated=Boolean(data?.success&&data.user);
 const unauthorized=error&&'status' in error&&error.status===401;
 useEffect(()=>{if(active&&authenticated)dispatch(closeAuthModal());},[active,authenticated,dispatch]);
 const close=()=>animateModalClose(()=>dispatch(closeAuthModal()));
 return <Modal open={active} onClose={close} overlayClassName={styles.overlay} contentClassName={styles.modal} ariaLabelledBy="auth-modal-title">
  <button type="button" className={styles.modal__close} onClick={close} aria-label="Закрыть"><span/><span/></button>
  {active&&!authenticated&&(isLoading?<p id="auth-modal-title">Проверяем вход…</p>:(unauthorized||isFetching)?(<>
   {emailLogin?<EmailLogin onPhone={()=>{setEmailLogin(false);setPhonePurpose('login');}}/>:<><PhoneVerification key={phonePurpose} purpose={phonePurpose} onDone={()=>{dispatch(closeProfileMenu());close();}}/><button type="button" className={styles.form__switch} onClick={()=>setEmailLogin(true)}>Войти по почте и паролю</button></>}
   <button type="button" className={styles.form__switch} onClick={()=>{setEmailLogin(false);setPhonePurpose(phonePurpose==='register'&&!emailLogin?'login':'register');}}>{phonePurpose==='register'&&!emailLogin?'Уже есть аккаунт? Войти':'Зарегистрироваться'}</button>
  </>):<div><p id="auth-modal-title">Не удалось проверить вход.</p><button type="button" onClick={()=>void refetch()}>Повторить</button></div>)}
 </Modal>;
}
