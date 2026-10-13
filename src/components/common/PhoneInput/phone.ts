export type PhoneCountry = {
    iso: string;
    name: string;
    dial: string;
    lengths: number[];
};
export const PHONE_COUNTRIES: PhoneCountry[] = [
    { iso: "RU", name: "Россия", dial: "7", lengths: [11] },
    { iso: "KZ", name: "Казахстан", dial: "7", lengths: [11] },
    { iso: "BY", name: "Беларусь", dial: "375", lengths: [12] },
    { iso: "AM", name: "Армения", dial: "374", lengths: [11] },
    { iso: "AZ", name: "Азербайджан", dial: "994", lengths: [12] },
    { iso: "KG", name: "Кыргызстан", dial: "996", lengths: [12] },
    { iso: "MD", name: "Молдова", dial: "373", lengths: [11] },
    { iso: "TJ", name: "Таджикистан", dial: "992", lengths: [12] },
    { iso: "TM", name: "Туркменистан", dial: "993", lengths: [11] },
    { iso: "UZ", name: "Узбекистан", dial: "998", lengths: [12] },
    { iso: "UA", name: "Украина", dial: "380", lengths: [12] },
    { iso: "US", name: "США", dial: "1", lengths: [11] },
    { iso: "CA", name: "Канада", dial: "1", lengths: [11] },
    { iso: "GB", name: "Великобритания", dial: "44", lengths: [12] },
    { iso: "NL", name: "Нидерланды", dial: "31", lengths: [11] },
    { iso: "DE", name: "Германия", dial: "49", lengths: [11, 12, 13] },
    { iso: "FR", name: "Франция", dial: "33", lengths: [11] },
    { iso: "IT", name: "Италия", dial: "39", lengths: [11, 12, 13] },
    { iso: "ES", name: "Испания", dial: "34", lengths: [11] },
    { iso: "TR", name: "Турция", dial: "90", lengths: [12] },
    { iso: "AE", name: "ОАЭ", dial: "971", lengths: [12] },
    { iso: "CN", name: "Китай", dial: "86", lengths: [13] },
];
export const AUTH_PHONE_COUNTRIES = ['RU', 'KZ', 'BY', 'AM', 'AZ', 'KG', 'MD', 'TJ', 'TM', 'UZ'];
export const digitsOnly = (value: string) => value.replace(/\D/g, "");
export const normalizePhone = (value: string, countryIso = "RU"): string => {
    let digits = digitsOnly(value);
    if (!digits) return "";
    if (value.trim().startsWith('+')) return `+${digits.slice(0, 15)}`;
    const country = PHONE_COUNTRIES.find((item) => item.iso === countryIso) ?? PHONE_COUNTRIES[0];
    if (country.iso === "RU" || country.iso === "KZ") {
        if (digits.startsWith("8")) {
            digits = `7${digits.slice(1)}`;
        }
        else if (!digits.startsWith("7")) {
            digits = `7${digits}`;
        }
    }
    else if (!digits.startsWith(country.dial)) {
        digits = `${country.dial}${digits}`;
    }
    return digits ? `+${digits.slice(0, 15)}` : "";
};
export const detectCountry = (value: string, fallback = "RU"): string => {
    const digits = digitsOnly(value);
    if (!digits)
        return fallback;
    if (!value.trim().startsWith('+') && digits.startsWith("8") && digits.length <= 11)
        return /^8[067]/.test(digits) ? 'KZ' : 'RU';
    const matches = PHONE_COUNTRIES
        .filter((item) => digits.startsWith(item.dial))
        .sort((a, b) => b.dial.length - a.dial.length);
    if (!matches.length)
        return fallback;
    if (matches[0].dial === "7") {
        if (/^7[067]/.test(digits)) return 'KZ';
        if (/^7[3489]/.test(digits)) return 'RU';
        return fallback === "KZ" ? "KZ" : "RU";
    }
    return matches[0].iso;
};
// The input shows the national number; its value remains international for the API.
export const phoneFromInput = (raw: string, countryIso: string): string => {
    const digits = digitsOnly(raw);
    const country = PHONE_COUNTRIES.find(item => item.iso === countryIso) ?? PHONE_COUNTRIES[0];
    if (!digits) return `+${country.dial}`;
    if (raw.trim().startsWith('+')) return `+${digits.slice(0, 15)}`;
    if (country.dial === '7' && digits.length === 11 && digits.startsWith('8')) return `+7${digits.slice(1)}`;
    if (digits.startsWith(country.dial) && country.lengths.includes(digits.length)) return `+${digits}`;
    return `+${country.dial}${digits}`.slice(0, 16);
};
export const nationalPhone = (value: string, countryIso: string): string => {
    const country = PHONE_COUNTRIES.find(item => item.iso === countryIso) ?? PHONE_COUNTRIES[0];
    const digits = digitsOnly(value);
    return digits.startsWith(country.dial) ? digits.slice(country.dial.length) : digits;
};
export const formatNationalPhone = (value: string, countryIso: string): string => {
    const local = nationalPhone(value, countryIso);
    if ((countryIso === 'RU' || countryIso === 'KZ') && local.length > 0 && local.length <= 10) {
        let result = `(${local.slice(0, 3)}`;
        if (local.length >= 3) result += ')';
        if (local.length > 3) result += ` ${local.slice(3, 6)}`;
        if (local.length > 6) result += `-${local.slice(6, 8)}`;
        if (local.length > 8) result += `-${local.slice(8)}`;
        return result;
    }
    return local;
};
export const editPhoneInput = (raw: string, caret: number, countryIso: string, previous: string, inputType = '') => {
    let before = digitsOnly(raw.slice(0, caret)).length;
    // Backspace/Delete on a mask separator removes the adjacent digit, not just punctuation.
    if (inputType.startsWith('delete') && digitsOnly(raw) === digitsOnly(previous)) {
        const digits = digitsOnly(raw);
        const index = inputType === 'deleteContentBackward' ? before - 1 : before;
        if (index >= 0 && index < digits.length) {
            raw = digits.slice(0, index) + digits.slice(index + 1);
            if (inputType === 'deleteContentBackward') before--;
        }
    }
    const value = phoneFromInput(raw, countryIso);
    const country = detectCountry(value, countryIso);
    const national = nationalPhone(value, country);
    before = Math.max(0, Math.min(national.length, before - Math.max(0, digitsOnly(raw).length - national.length)));
    const formatted = formatNationalPhone(value, country);
    let position = 0, digits = 0;
    while (position < formatted.length && digits < before) {
        if (/\d/.test(formatted[position])) digits++;
        position++;
    }
    while (position < formatted.length && !/\d/.test(formatted[position])) position++;
    return { value, country, caret: position };
};
export const isValidPhone = (value: string, countryIso?: string): boolean => {
    const normalized = normalizePhone(value, countryIso ?? detectCountry(value));
    const digits = digitsOnly(normalized);
    if (!/^\d{8,15}$/.test(digits))
        return false;
    const country = PHONE_COUNTRIES.find((item) => item.iso === (countryIso ?? detectCountry(normalized)));
    if (!country)
        return true;
    return digits.startsWith(country.dial) && country.lengths.includes(digits.length);
};
export const formatPhone = (value: string): string => {
    const normalized = normalizePhone(value, detectCountry(value));
    const digits = digitsOnly(normalized);
    if (digits.startsWith("7") && digits.length <= 11) {
        const p = digits.slice(1);
        let out = "+7";
        if (p.length)
            out += ` (${p.slice(0, 3)}`;
        if (p.length >= 3)
            out += ")";
        if (p.length > 3)
            out += ` ${p.slice(3, 6)}`;
        if (p.length > 6)
            out += `-${p.slice(6, 8)}`;
        if (p.length > 8)
            out += `-${p.slice(8, 10)}`;
        return out;
    }
    return normalized;
};

