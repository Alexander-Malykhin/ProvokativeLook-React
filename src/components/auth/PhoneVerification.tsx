import { useEffect, useRef, useState, type FormEvent } from 'react';
import PhoneInput from '@components/common/PhoneInput/PhoneInput';
import { isValidPhone, normalizePhone, detectCountry } from '@components/common/PhoneInput/phone';
import { baseApi } from '@store/api/baseApi';
import { useAppDispatch } from '@store/hooks';
import { getRequestErrorMessage } from '@store/api/getRequestErrorMessage';
import styles from './PhoneVerification.module.scss';
type Result = { success: boolean; challenge?: string; state: 'pending' | 'code' | 'processing' | 'email' | 'done' };
const phoneApi = baseApi.injectEndpoints({ endpoints: builder => ({
 sendPhone: builder.mutation<Result, {phone:string;purpose:'login'|'register'|'change'}>({query:body=>({url:'auth/phone/send',method:'POST',body})}),
 checkPhone: builder.mutation<Result, {challenge:string;code?:string;email?:string}>({query:body=>({url:'auth/phone/check',method:'POST',body})}),
}) });
export default function PhoneVerification({purpose='login',onDone}:{purpose?:'login'|'register'|'change';onDone:()=>void}) {
 const dispatch=useAppDispatch();
 const finish=()=>{doneRef.current();dispatch(baseApi.util.invalidateTags(['User','Cart','Favorites','Addresses','Orders']));};
 const [phone,setPhone]=useState('+7'); const [code,setCode]=useState(''); const [email,setEmail]=useState('');
 const [challenge,setChallenge]=useState(''); const [stage,setStage]=useState<'phone'|Result['state']>('phone');
 const [error,setError]=useState(''); const [retryAt,setRetryAt]=useState(0); const [remaining,setRemaining]=useState(0);
 const [send,sendState]=phoneApi.useSendPhoneMutation(); const [check,checkState]=phoneApi.useCheckPhoneMutation();
 const inFlight=useRef(false); const mounted=useRef(true);
 const doneRef=useRef(onDone);
 useEffect(()=>{doneRef.current=onDone;},[onDone]);
 useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
 useEffect(()=>{const t=window.setInterval(()=>setRemaining(Math.max(0,Math.ceil((retryAt-Date.now())/1000))),1000);return()=>clearInterval(t);},[retryAt]);
 useEffect(()=>{
  if(!challenge || (stage!=='pending' && stage!=='code' && stage!=='processing')) return;
  let cancelled=false;
  const t=window.setInterval(async()=>{
   if(inFlight.current)return;inFlight.current=true;
   try{const r=await check({challenge}).unwrap();if(cancelled)return;setError(current => current === 'Временно нет связи. Повторяем проверку подтверждения…' ? '' : current);setStage(r.state);if(r.state==='done'){doneRef.current();dispatch(baseApi.util.invalidateTags(['User','Cart','Favorites','Addresses','Orders']));}}
   catch(e){if(!cancelled){
    const status = typeof e === 'object' && e !== null && 'status' in e ? e.status : undefined;
    if (typeof status === 'number' && status >= 400 && status < 500) {
     setError(getRequestErrorMessage(e));setStage('phone');setChallenge('');
    } else setError('Временно нет связи. Повторяем проверку подтверждения…');
   }}
   finally{inFlight.current=false;}
  },3500);
  return()=>{cancelled=true;clearInterval(t);};
 },[challenge,stage,check,dispatch]);
 const submit=async(e:FormEvent)=>{
  e.preventDefault();if(inFlight.current)return;setError('');inFlight.current=true;
  try{
   if(stage==='phone'){
    if(!isValidPhone(phone))throw new Error('Введите корректный номер телефона');
    const r=await send({phone:normalizePhone(phone,detectCountry(phone)),purpose}).unwrap();if(!mounted.current)return;
    setChallenge(r.challenge??'');setStage(r.state);setRetryAt(Date.now()+60000);setRemaining(60);
   }else{
    const r=await check({challenge,...(stage==='email'?{email}:{code})}).unwrap();if(!mounted.current)return;setStage(r.state);if(r.state==='done')finish();
   }
  }catch(e){if(mounted.current)setError(e instanceof Error?e.message:getRequestErrorMessage(e));}finally{inFlight.current=false;}
 };
 const busy=sendState.isLoading||checkState.isLoading;
 return <form className={styles.form} onSubmit={submit}>
  <h2 id="auth-modal-title">{purpose==='change'?'Изменить телефон':purpose==='register'?'Регистрация по телефону':'Вход по телефону'}</h2>
  {stage==='phone'?<>
   <p>{purpose==='change'?'Подтвердите новый номер телефона.':purpose==='register'?'Введите номер телефона и подтвердите его кодом. Имя и фамилию можно заполнить позже.':'Введите номер, указанный в вашем контакте магазина, и подтвердите вход.'}</p>
   <PhoneInput value={phone} onChange={setPhone} required disabled={busy}/>
   <button className={styles.primary} disabled={busy||remaining>0}>{busy?'Отправляем…':remaining?`Повторить через ${remaining} с`:'Получить подтверждение'}</button>
  </>:stage==='processing'?<p role="status">Код принят. Ожидаем подтверждение входа…</p>:stage==='email'?<>
   <p>Телефон подтверждён. Укажите email для чеков и информации о заказах.</p>
   <label>Email<input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label>
   <button className={styles.primary} disabled={busy}>Продолжить</button>
   <button type="button" disabled={busy} onClick={()=>{setChallenge('');setStage('phone');setError('');}}>Начать заново</button>
  </>:<>
   <p>{stage==='code'?`Введите код из SMS на ${phone}`:`Подтвердите вход в уведомлении на телефоне ${phone}. Если придёт SMS, введите код.`}</p>
   <label>Код подтверждения<input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,8))} minLength={4} maxLength={8} required/></label>
   <button className={styles.primary} disabled={busy||code.length<4}>Подтвердить</button>
   <button type="button" disabled={busy||remaining>0} onClick={()=>{setChallenge('');setStage('phone');setCode('');setError('');}}>{remaining?`Повторить через ${remaining} с`:'Другой номер / повторить'}</button>
  </>}
  {error&&<p role="alert" className={styles.error}>{error}</p>}
 </form>;
}
