import { useEffect, useRef, useState } from 'react';
import { useQuotePostalDeliveryMutation, useResolvePostalCodeMutation } from '@store/api/orders/ordersApi';
import type { PostalQuote } from '@store/api/orders/types';
import { getRequestErrorMessage } from '@store/api/getRequestErrorMessage';
import styles from './PostalDelivery.module.scss';
import CourierAddressFields from './CourierAddressFields';
import AddressMapModal from '@components/blocks/Profile/subpages/ProfileAddresses/components/AddressModal';
import type { ProfileAddress } from '@components/blocks/Profile/subpages/ProfileAddresses/model/types';
import { courierAddress } from '@components/blocks/Profile/subpages/ProfileAddresses/model/deliveryAddresses';
import CourierAddressBook from './CourierAddressBook';

import { deferPostalQuote, enqueuePostalQuote } from './quoteQueue';
interface Props {
  quote: PostalQuote | null;
  onQuote: (quote: PostalQuote | null) => void;
  city?: string;
  office?: ProfileAddress;
}
export default function PostalDelivery({ quote, onQuote, city = 'Ростов-на-Дону', office }: Props) {
  const [addressDetails, setAddressDetails] = useState<ProfileAddress | null>(null);
  const [addressText, setAddressText] = useState(office?.formattedAddress ?? '');
  const [postalCode, setPostalCode] = useState(office?.pickupCode ?? '');
  const [error, setError] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calculate] = useQuotePostalDeliveryMutation();
  const [resolveCode] = useResolvePostalCodeMutation();
  const [resolving, setResolving] = useState(false);

  const sequence = useRef(0);
  const active = useRef(false);

  useEffect(() => {
    active.current = true;
    sequence.current += 1;
    const generation = sequence;
    onQuote(null);
    return () => {
      active.current = false;
      generation.current++;
    };
  }, [onQuote]);
  useEffect(() => {
    if (!quote) return;
    const timer = window.setTimeout(() => onQuote(null), Math.max(0, quote.expiresAt * 1000 - Date.now()));
    return () => window.clearTimeout(timer);
  }, [quote, onQuote]);
  const invalidate = () => {
    sequence.current++;
    onQuote(null);
    setLoading(false);
    setResolving(false);
    setError('');
  };
  const fillMissingCode = async (text: string) => {
    const request = ++sequence.current;
    const current = () => active.current && sequence.current === request;
    setResolving(true);
    try {
      const send = () => resolveCode({ address: text }).unwrap();
      let result;
      try {
        result = await enqueuePostalQuote(current, send);
      } catch (err) {
        const data = (err as { data?: { code?: string; retryAfter?: number } })?.data;
        if (data?.code !== 'POSTAL_QUOTE_COOLDOWN' || !current()) throw err;
        deferPostalQuote(Math.min(10, Math.max(1, data.retryAfter || 5)) * 1000 + 200);
        result = await enqueuePostalQuote(current, send);
      }
      if (current() && result) setPostalCode(result.address.postalCode);
    } catch (err) {
      if (current()) setError(getRequestErrorMessage(err, 'Не удалось определить индекс. Укажите его вручную.'));
    } finally {
      if (current()) setResolving(false);
    }
  };
  const getQuote = async () => {
    if ((postalCode !== '' && !/^\d{6}$/.test(postalCode)) || addressText.trim().length < 10) {
      setError('Укажите шестизначный индекс и полный адрес получателя.');
      return;
    }
    const request = ++sequence.current;
    const current = () => active.current && sequence.current === request;
    setLoading(true);
    onQuote(null);
    setError('');
    const send = () =>
      calculate({
        mode: office ? 'office' : 'door',
        addressId: office?.id,
        postalCode,
        address: addressText.trim(),
      }).unwrap();
    try {
      let result;
      try {
        result = await enqueuePostalQuote(current, send);
      } catch (err) {
        const data = (err as { data?: { code?: string; retryAfter?: number } })?.data;
        if (data?.code !== 'POSTAL_QUOTE_COOLDOWN' || !current()) throw err;
        deferPostalQuote(Math.min(10, Math.max(1, data.retryAfter || 5)) * 1000 + 200);
        result = await enqueuePostalQuote(current, send);
      }
      if (result && current()) {
        onQuote(result.quote);
        setPostalCode(result.quote.address.postalCode);
      }
    } catch (err) {
      if (current()) setError(getRequestErrorMessage(err, 'Не удалось получить предварительную стоимость'));
    } finally {
      if (current()) setLoading(false);
    }
  };
  return (
    <div className={styles.postal}>
      {!office && (
        <>
          <CourierAddressBook
            provider="mail"
            value={courierAddress('mail', {
              city,
              ...addressDetails,
              formattedAddress: addressText,
              address1: addressText,
              postalCode,
              apartment: '',
            })}
            onSelect={(address) => {
              invalidate();
              setAddressDetails(address);
              setPostalCode(address.postalCode);
              setAddressText(address.formattedAddress);
            }}
          />
          <CourierAddressFields
            postalCode={postalCode}
            address={addressText}
            onMap={() => setMapOpen(true)}
            onPostalCode={(value) => {
              invalidate();
              setPostalCode(value);
            }}
            onAddress={(value) => {
              invalidate();
              setAddressText(value);
            }}
          />
        </>
      )}
      {resolving && <p role="status">Определяем почтовый индекс…</p>}
      <button
        type="button"
        className={styles.calculate}
        disabled={
          loading || resolving || (postalCode !== '' && !/^\d{6}$/.test(postalCode)) || addressText.trim().length < 10
        }
        onClick={() => void getQuote()}
      >
        {loading ? 'Рассчитываем…' : 'Рассчитать доставку'}
      </button>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      {quote && (
        <div className={styles.result}>
          <strong>
            Ориентировочно {quote.amount.toLocaleString('ru-RU', { style: 'currency', currency: quote.currency })}
          </strong>
        </div>
      )}
      <p className={styles.note}>
        После оплаты товаров менеджер проверит упаковку и оформит отправление. Затем в личном кабинете появится
        отдельный счёт за доставку с окончательной стоимостью.
      </p>
      {mapOpen && (
        <AddressMapModal
          open
          postalSelection
          onClose={() => setMapOpen(false)}
          onSave={(a) => {
            invalidate();
            setAddressDetails(a);
            setMapOpen(false);
            const text = [a.formattedAddress, a.apartment ? `квартира ${a.apartment}` : ''].filter(Boolean).join(', ');
            setPostalCode(a.postalCode || '');
            setAddressText(text);
            if (!a.postalCode) void fillMissingCode(text);
          }}
        />
      )}
    </div>
  );
}
