import { useEffect, useRef, useState } from 'react';
import { useAddAddressMutation, useGetAddressesQuery, useLazyGeocodeAddressQuery } from '@store/api/address/addressApi';
import type { ProfileAddress } from '@components/blocks/Profile/subpages/ProfileAddresses/model/types';
import { addressesForDelivery, courierAddress, type AddressProvider } from '@components/blocks/Profile/subpages/ProfileAddresses/model/deliveryAddresses';
import { getRequestErrorMessage } from '@store/api/getRequestErrorMessage';
import styles from './PostalDelivery.module.scss';
import SavedAddressSelect from './SavedAddressSelect';

export default function CourierAddressBook({ provider, value, onSelect }: {
    provider: AddressProvider; value: ProfileAddress | null; onSelect: (address: ProfileAddress) => void;
}) {
    const { data } = useGetAddressesQuery();
    const [addAddress, { isLoading }] = useAddAddressMutation();
    const [geocode, { isFetching: isResolving }] = useLazyGeocodeAddressQuery();
    const busy = isLoading || isResolving;
    const [error, setError] = useState('');
    const [saved, setSaved] = useState<ProfileAddress | null>(null);
    const active = useRef(true);
    const saving = useRef(false);
    useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
    const all = saved ? [saved, ...(data?.addresses ?? []).filter(address => address.id !== saved.id)] : data?.addresses ?? [];
    const addresses = addressesForDelivery(all, provider, false);
    const selected = addresses.find(address => value && address.formattedAddress === value.formattedAddress && address.postalCode === value.postalCode);
    const canSave = Boolean(value?.city.trim() && (value?.formattedAddress.trim().length ?? 0) >= 10 && value?.postalCode.trim());
    const save = async () => {
        if (!value || !canSave || saving.current) return;
        saving.current = true; setError('');
        try {
            const [resolved] = await geocode({ geocode: value.formattedAddress, results: 1 }).unwrap();
            if (!active.current) return;
            if (!resolved?.hasHouse) throw new Error('Выберите адрес с номером дома на карте или уточните адрес получателя.');
            const response = await addAddress(courierAddress(provider, { ...value, ...resolved,
                formattedAddress: value.formattedAddress, postalCode: value.postalCode, id: 0, isDefault: false,
                title: value.title || `Адрес доставки — ${value.city}` })).unwrap();
            if (!response.address) throw new Error('Не удалось получить сохранённый адрес');
            if (active.current) { setSaved(response.address); onSelect(response.address); }
        } catch (failure) {
            if (active.current) setError(getRequestErrorMessage(failure, 'Не удалось сохранить адрес'));
        } finally { saving.current = false; }
    };
    return <div className={styles.addressBook}>
        <SavedAddressSelect key={provider} label={`Мои адреса — ${provider === 'mail' ? 'Почта России' : 'СДЭК'}`}
            addresses={addresses} selectedId={selected?.id} disabled={busy} onSelect={address => { setError(''); onSelect(address); }}/>
        <button type="button" className={styles.mapButton} disabled={!canSave || busy || Boolean(selected)} onClick={() => void save()}>
            {busy ? 'Сохраняем…' : selected ? 'Адрес сохранён в моём списке' : 'Сохранить адрес в мой список'}
        </button>
        {error && <p className={styles.error} role="alert">{error}</p>}
    </div>;
}
