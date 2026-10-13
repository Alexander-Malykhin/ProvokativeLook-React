import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { UseFormRegister, UseFormSetValue } from "react-hook-form";
import styles from "../../Order.module.scss";
import courierStyles from '../PostalDelivery/PostalDelivery.module.scss';
import CourierAddressFields from '../PostalDelivery/CourierAddressFields';
import CourierAddressBook from '../PostalDelivery/CourierAddressBook';
import { addressesForDelivery } from '@components/blocks/Profile/subpages/ProfileAddresses/model/deliveryAddresses';
import type { OrderFormValues } from "../../model/types";
import OrderFieldRadio from "../OrderFieldRadio/OrderFieldRadio";
import OrderStepContainer from "../OrderStepContainer/OrderStepContainer";
import AddressModal from "@components/blocks/Profile/subpages/ProfileAddresses/components/AddressModal/AddressModal";
import AddressMapModal from "@components/blocks/Profile/subpages/ProfileAddresses/components/AddressModal";
import type { ProfileAddress } from "@components/blocks/Profile/subpages/ProfileAddresses/model/types";
import { useAddAddressMutation } from "@store/api/address/addressApi";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
interface DeliveryStepProps {
    provider: 'mail' | 'cdek';
    onProvider: (provider: 'mail' | 'cdek') => void;
    postal: ReactNode;
    pickupPostal?: ReactNode;
    courierAddress: ProfileAddress | null;
    onCourierAddress: (address: ProfileAddress) => void;
    register: UseFormRegister<OrderFormValues>;
    setValue: UseFormSetValue<OrderFormValues>;
    addresses: ProfileAddress[];
    city: string;
    country: string;
    countryCode: string;
    onAddressSaved?: (address: ProfileAddress) => void;
    delivery: OrderFormValues['delivery'];
    selectedAddressId: string;
    validationError?: string;
}
const DeliveryStep = ({ provider, onProvider, postal, pickupPostal, courierAddress, onCourierAddress, register, setValue, addresses, city, country, countryCode, onAddressSaved, delivery, selectedAddressId, validationError }: DeliveryStepProps) => {
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [addAddress, addState] = useAddAddressMutation();
    const [pickupProvider, setPickupProvider] = useState<'mail' | 'cdek'>('mail');
    const editCourier = (patch: Partial<ProfileAddress>) => onCourierAddress({
        id: 0, title: '', formattedAddress: '', address1: '', address2: '', city, country, countryCode,
        countryId: 0, region: '', province: '', postalCode: '', apartment: '', entrance: '', floor: '', comment: '',
        isDefault: false, latitude: 0, longitude: 0, ...courierAddress, ...patch,
    });
    const pickupAddresses = useMemo(() => addressesForDelivery(addresses, pickupProvider, true), [addresses, pickupProvider]);
    useEffect(() => {
        if (delivery !== 'pickup' || pickupAddresses.some((address) => String(address.id) === selectedAddressId)) return;
        const preferred = pickupAddresses.find((address) => address.isDefault) ?? pickupAddresses[0];
        setValue('addressId', preferred ? String(preferred.id) : '', { shouldValidate: true });
    }, [delivery, pickupAddresses, selectedAddressId, setValue]);
    const saveAddress = (address: ProfileAddress) => {
        setErrorMessage("");
        void addAddress(address)
            .unwrap()
            .then((response) => {
            const saved = response.address;
            if (!saved) {
                throw new Error("API не вернул сохранённый адрес");
            }
            setValue("addressId", String(saved.id), {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            });
            onAddressSaved?.(saved);
            setIsAddressModalOpen(false);
        })
            .catch((error) => {
            setErrorMessage(getRequestErrorMessage(error, "Не удалось сохранить адрес"));
        });
    };
    return (<OrderStepContainer title="2. Доставка" mode="radio">
      <OrderFieldRadio name="delivery" value="delivery" register={register('delivery', { required: 'Выберите способ получения' })} onChange={() => setValue('payment', 'card')}>
        Доставка
      </OrderFieldRadio>
      {delivery === 'delivery' && <div className={styles.order__deliveryDetails}>
      <div className={styles.order__carrierChoice} role="group" aria-label="Служба доставки">
        <button type="button" aria-pressed={provider === 'mail'} onClick={() => onProvider('mail')}>Почта России</button>
        <button type="button" aria-pressed={provider === 'cdek'} onClick={() => onProvider('cdek')}>СДЭК</button>
      </div>
      {provider === 'mail' ? postal : <>
      <div className={courierStyles.postal}>
      <CourierAddressBook provider="cdek" value={courierAddress} onSelect={onCourierAddress}/>
      <CourierAddressFields postalCode={courierAddress?.postalCode ?? ''} address={courierAddress?.formattedAddress ?? ''} international={(courierAddress?.countryCode || countryCode || 'RU').toUpperCase() !== 'RU'} onMap={() => setIsAddressModalOpen(true)} onPostalCode={(value) => editCourier({ postalCode: value })} onAddress={(value) => editCourier({ formattedAddress: value, address1: value, apartment: '' })}/>
      </div>
      </>}
      </div>}
      <OrderFieldRadio name="delivery" value="pickup" register={register('delivery', { required: 'Выберите способ получения' })} onChange={() => setValue('payment', 'card')}>
        Получение в пункте выдачи
      </OrderFieldRadio>
      {delivery === 'pickup' && <div className={styles.order__deliveryDetails}>
        <div className={styles.order__carrierChoice} role="group" aria-label="Адреса по службе доставки">
          <button type="button" disabled={addState.isLoading} aria-pressed={pickupProvider === 'mail'} onClick={() => { setPickupProvider('mail'); setErrorMessage(''); }}>Почта России</button>
          <button type="button" disabled={addState.isLoading} aria-pressed={pickupProvider === 'cdek'} onClick={() => { setPickupProvider('cdek'); setErrorMessage(''); }}>СДЭК</button>
        </div>
        <h3 className={styles.order__deliveryHeading}>Сохранённые пункты</h3>
        <div className={styles.order__addresses}>
          {pickupAddresses.map((address) => <OrderFieldRadio key={address.id} name="addressId" value={String(address.id)} register={register('addressId')}>
            <span className={styles.order__addressChoice}>{address.title && <strong>{address.title}</strong>}<span>{address.formattedAddress}</span></span>
          </OrderFieldRadio>)}
          {!pickupAddresses.length && <p className={styles.order__emptyDeliveryPoint}>У вас пока нет сохранённых адресов {pickupProvider === 'cdek' ? 'СДЭК' : 'Почты России'}.</p>}
        </div>
        <button type="button" className={styles.button} disabled={addState.isLoading} onClick={() => setIsAddressModalOpen(true)}>+ {pickupProvider === 'cdek' ? 'Добавить пункт СДЭК на карте' : 'Добавить отделение Почты России на карте'}</button>
        {pickupProvider === 'mail' && pickupPostal}
        {errorMessage && <p className={styles.order__error} role="alert">{errorMessage}</p>}
      </div>}
      {validationError && <p className={styles.order__error} role="alert">{validationError}</p>}

      {isAddressModalOpen && (delivery === 'delivery'
        ? <AddressMapModal deliverySelection requireHouse open onClose={() => setIsAddressModalOpen(false)} onSave={(address) => { onCourierAddress({ ...address, deliveryProvider: 'cdek', formattedAddress: [address.formattedAddress, address.apartment ? `квартира ${address.apartment}` : ''].filter(Boolean).join(', '), apartment: '' }); setIsAddressModalOpen(false); }}/>
        : <AddressModal key={pickupProvider} cdekOnly={pickupProvider === 'cdek'} mailOnly={pickupProvider === 'mail'} open onClose={() => setIsAddressModalOpen(false)} onSave={saveAddress} city={city} country={country} countryCode={countryCode} isSaving={addState.isLoading} saveError={errorMessage}/>)}
    </OrderStepContainer>);
};
export default DeliveryStep;


