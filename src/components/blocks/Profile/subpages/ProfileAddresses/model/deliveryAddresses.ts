import type { ProfileAddress } from './types';

export type AddressProvider = 'mail' | 'cdek';
export const isPickupAddress = (address: ProfileAddress) => Boolean(address.pickupCode?.trim() || address.pickupName?.trim());
export const addressesForDelivery = (addresses: ProfileAddress[], provider: AddressProvider, pickup: boolean) =>
    addresses.filter(address => (address.deliveryProvider || 'mail') === provider && isPickupAddress(address) === pickup);

export const courierAddress = (provider: AddressProvider, patch: Partial<ProfileAddress>): ProfileAddress => ({
    id: 0, title: '', formattedAddress: '', address1: '', address2: '', city: 'Ростов-на-Дону',
    country: 'Россия', countryCode: 'RU', countryId: 0, region: '', province: '', postalCode: '',
    apartment: '', entrance: '', floor: '', comment: '', isDefault: false, latitude: 0, longitude: 0,
    ...patch, deliveryProvider: provider, pickupCode: '', pickupName: '',
});
