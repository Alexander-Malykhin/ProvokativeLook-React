export type Coordinates = [number, number];
export type GeocoderKind = "house" | "street" | "locality" | "";
export type MobileStep = "map" | "search" | "selected" | "form";

export interface ProfileAddress {
  id: number;
  title: string;
  formattedAddress: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  province: string;
  country: string;
  countryId: number;
  countryCode: string;
  postalCode: string;
  entrance: string;
  floor: string;
  apartment: string;
  comment: string;
  deliveryProvider?: "cdek" | "mail" | "";
  pickupCode?: string;
  pickupName?: string;
  isDefault: boolean;
  latitude: number;
  longitude: number;
}

export interface AddressFormState {
  formattedAddress: string;
  address1: string;
  city: string;
  region: string;
  province: string;
  country: string;
  countryCode: string;
  postalCode: string;
  entrance: string;
  floor: string;
  apartment: string;
  comment: string;
  isDefault: boolean;
  latitude: number;
  longitude: number;
}

export interface ParsedAddress {
  formattedAddress: string;
  address1: string;
  city: string;
  postalCode: string;
  region: string;
  province: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  hasHouse: boolean;
  kind: GeocoderKind;
}

export interface Suggestion {
  id: string;
  title: string;
  subtitle: string;
  fullText: string;
}

export interface GeocoderComponent {
  kind?: string;
  name?: string;
}

export interface GeocoderFeatureMember {
  GeoObject?: {
    name?: string;
    description?: string;
    Point?: { pos?: string };
    metaDataProperty?: {
      GeocoderMetaData?: {
        kind?: string;
        text?: string;
        Address?: {
          formatted?: string;
          postal_code?: string;
          country_code?: string;
          Components?: GeocoderComponent[];
        };
      };
    };
  };
}

export interface GeocoderResponse {
  response?: {
    GeoObjectCollection?: {
      featureMember?: GeocoderFeatureMember[];
    };
  };
}

export interface SuggestApiItem {
  title?: { text?: string };
  subtitle?: { text?: string };
  address?: { formatted_address?: string };
  uri?: string;
}

export interface SuggestApiResponse {
  results?: SuggestApiItem[];
}

export interface ApiEnvelope<T> {
  success?: boolean;
  statusCode?: number;
  response?: T | string | null;
  rawResponse?: string;
  error?: string;
  message?: string;
}
