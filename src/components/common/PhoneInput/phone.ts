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
export const digitsOnly = (value: string) => value.replace(/\D/g, "");
export const normalizePhone = (value: string, countryIso = "RU"): string => {
    let digits = digitsOnly(value);
    if (!digits) return "";
    const country = PHONE_COUNTRIES.find((item) => item.iso === countryIso) ?? PHONE_COUNTRIES[0];
    if (country.iso === "RU") {
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
    if (digits.startsWith("8") && digits.length <= 11)
        return "RU";
    const matches = PHONE_COUNTRIES
        .filter((item) => digits.startsWith(item.dial))
        .sort((a, b) => b.dial.length - a.dial.length);
    if (!matches.length)
        return fallback;
    if (matches[0].dial === "7")
        return fallback === "KZ" ? "KZ" : "RU";
    return matches[0].iso;
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

