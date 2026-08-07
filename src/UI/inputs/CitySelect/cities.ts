import type { CityOptionInterface } from './CitySelect';

export const CITY_OPTIONS: CityOptionInterface[] = [
    {
        value: 'Ростов-на-Дону',
        label: 'г. РОСТОВ-НА-ДОНУ',
        coordinates: [47.235713, 39.701505],
    },
    {
        value: 'Москва',
        label: 'г. МОСКВА',
        coordinates: [55.755864, 37.617698],
    },
    {
        value: 'Санкт-Петербург',
        label: 'г. САНКТ-ПЕТЕРБУРГ',
        coordinates: [59.939095, 30.315868],
    },
    {
        value: 'Краснодар',
        label: 'г. КРАСНОДАР',
        coordinates: [45.03547, 38.975313],
    },
];

export const DEFAULT_CITY = CITY_OPTIONS[0];

export const getCityOption = (city: string): CityOptionInterface => {
    return CITY_OPTIONS.find(option => option.value === city) ?? DEFAULT_CITY;
};
