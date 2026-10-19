import styles from './PostalDelivery.module.scss';

interface Props {
  postalCode: string;
  address: string;
  international?: boolean;
  onMap: () => void;
  onPostalCode: (value: string) => void;
  onAddress: (value: string) => void;
}

export default function CourierAddressFields({
  postalCode,
  address,
  international = false,
  onMap,
  onPostalCode,
  onAddress,
}: Props) {
  return (
    <>
      <h3>Курьером — адрес доставки</h3>
      <button type="button" className={styles.mapButton} onClick={onMap}>
        Выбрать адрес на карте
      </button>
      <label>
        Почтовый индекс
        <input
          aria-label="Почтовый индекс"
          inputMode={international ? 'text' : 'numeric'}
          maxLength={international ? 12 : 6}
          placeholder={international ? 'Индекс получателя' : '6 цифр'}
          value={postalCode}
          onChange={(e) => onPostalCode(international ? e.target.value : e.target.value.replace(/\D/g, ''))}
        />
      </label>
      <label>
        Адрес получателя
        <input
          aria-label="Адрес получателя"
          placeholder="Город, улица, дом, квартира"
          value={address}
          onChange={(e) => onAddress(e.target.value)}
        />
      </label>
      {international && address && !postalCode && (
        <p role="status">Карта не вернула индекс этого дома. Укажите почтовый индекс получателя вручную.</p>
      )}
    </>
  );
}
