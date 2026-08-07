import { MAX_SUGGESTIONS } from "../model/constants";
import type {
  ApiEnvelope,
  GeocoderFeatureMember,
  GeocoderResponse,
  ParsedAddress,
  SuggestApiResponse,
  Suggestion,
} from "../model/types";

const parseJson = <T>(value: string): T => {
  try {
    return JSON.parse(value) as T;
  } catch {
    throw new Error("API вернул некорректный JSON");
  }
};

const unwrapApiResponse = <T>(payload: T | ApiEnvelope<T>): T => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    ("statusCode" in payload ||
      "success" in payload ||
      "rawResponse" in payload)
  ) {
    const envelope = payload as ApiEnvelope<T>;

    if (envelope.success === false) {
      throw new Error(
        envelope.message ||
          envelope.error ||
          `API вернул ошибку ${envelope.statusCode ?? ""}`.trim(),
      );
    }

    if (typeof envelope.response === "string") {
      return parseJson<T>(envelope.response);
    }

    if (envelope.response !== null && envelope.response !== undefined) {
      return envelope.response;
    }

    if (envelope.rawResponse) {
      return parseJson<T>(envelope.rawResponse);
    }

    throw new Error("API вернул пустой ответ");
  }

  return payload as T;
};

const parseFeature = (member: GeocoderFeatureMember): ParsedAddress | null => {
  const object = member.GeoObject;
  const metadata = object?.metaDataProperty?.GeocoderMetaData;
  const position = object?.Point?.pos;

  if (!metadata || !position) {
    return null;
  }

  const [longitude, latitude] = position.trim().split(/\s+/).map(Number);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  const components = (metadata.Address?.Components ?? []).reduce<
    Record<string, string>
  >((result, component) => {
    if (component.kind && component.name) {
      result[component.kind] = component.name;
    }

    return result;
  }, {});

  const street = components.street ?? components.route ?? "";
  const house = components.house ?? components.premise ?? "";
  const address1 =
    [street, house].filter(Boolean).join(", ") || object?.name || "";
  const metadataKind = metadata.kind ?? "";

  return {
    formattedAddress:
      metadata.Address?.formatted ??
      metadata.text ??
      [object?.description, object?.name].filter(Boolean).join(", "),
    address1,
    city: components.locality ?? components.area ?? "",
    postalCode: metadata.Address?.postal_code ?? "",
    region: components.province ?? "",
    province: components.province ?? "",
    country: components.country ?? "",
    countryCode: metadata.Address?.country_code ?? "",
    latitude,
    longitude,
    hasHouse: Boolean(house) || metadataKind === "house",
    kind:
      metadataKind === "house" ||
      metadataKind === "street" ||
      metadataKind === "locality"
        ? metadataKind
        : "",
  };
};

const parsePayload = <T>(payload: unknown): T => {
  const parsed =
    typeof payload === "string"
      ? parseJson<T | ApiEnvelope<T>>(payload)
      : (payload as T | ApiEnvelope<T>);

  return unwrapApiResponse(parsed);
};

export const parseGeocoderResponse = (payload: unknown): ParsedAddress[] => {
  const data = parsePayload<GeocoderResponse>(payload);
  const members = data.response?.GeoObjectCollection?.featureMember ?? [];

  return members
    .map(parseFeature)
    .filter((address): address is ParsedAddress => Boolean(address));
};

export const parseSuggestResponse = (payload: unknown): Suggestion[] => {
  const data = parsePayload<SuggestApiResponse>(payload);
  const unique = new Map<string, Suggestion>();

  (data.results ?? []).forEach((item, index) => {
    const title = item.title?.text?.trim() ?? "";
    const subtitle = item.subtitle?.text?.trim() ?? "";
    const formattedAddress = item.address?.formatted_address?.trim() ?? "";
    const fullText =
      formattedAddress || [title, subtitle].filter(Boolean).join(", ");

    if (!title || !fullText) {
      return;
    }

    const key = fullText.toLocaleLowerCase("ru-RU");

    if (!unique.has(key)) {
      unique.set(key, {
        id: item.uri || `${key}-${index}`,
        title,
        subtitle,
        fullText,
      });
    }
  });

  return [...unique.values()].slice(0, MAX_SUGGESTIONS);
};
