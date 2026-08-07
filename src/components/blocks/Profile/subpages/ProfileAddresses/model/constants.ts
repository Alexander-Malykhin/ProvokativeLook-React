import type { AddressFormState, Coordinates } from "./types";

export const DEFAULT_CENTER: Coordinates = [47.235713, 39.701505];
export const DEFAULT_ZOOM = 12;
export const SELECTED_ZOOM = 17;
export const SEARCH_DELAY = 320;
export const MAX_SUGGESTIONS = 10;
export const MAX_COMMENT_LENGTH = 500;
export const MOBILE_BREAKPOINT = 768;

export const ADDRESS_CITIES = [
  "Ростов-на-Дону",
  "Москва",
  "Санкт-Петербург",
  "Краснодар",
];

export const INITIAL_ADDRESS_FORM: AddressFormState = {
  formattedAddress: "",
  address1: "",
  city: ADDRESS_CITIES[0],
  region: "",
  province: "",
  country: "Россия",
  countryCode: "RU",
  postalCode: "",
  entrance: "",
  floor: "",
  apartment: "",
  comment: "",
  isDefault: true,
  latitude: 0,
  longitude: 0,
};
