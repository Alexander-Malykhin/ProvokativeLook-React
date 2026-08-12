import { useEffect, useMemo, useState } from "react";
import styles from "./ProfileData.module.scss";
import type { ProfilePageProps } from "@components/blocks/Profile/types/types.ts";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@store/api/user/userApi.ts";
import {
  useLazyGeocodeAddressQuery,
  useLazyGetAddressSuggestionsQuery,
} from "@store/api/address/addressApi";
import type { Suggestion } from "@components/blocks/Profile/subpages/ProfileAddresses/model/types";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
import BirthdayPicker from "./components/BirthdayPicker/BirthdayPicker";
import ContactAddressEditor from "./components/ContactAddressEditor/ContactAddressEditor";
import Modal from "@UI/overlays/Modal/Modal";
import type { ProfileAddress } from "@components/blocks/Profile/subpages/ProfileAddresses/model/types";
import { useLazySearchCountriesQuery } from "@store/api/countries/countriesApi";

interface ProfileFormState {
  firstName: string;
  lastName: string;
  birthday: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  countryId: number | null;
  address: ProfileAddress | null;
}

const EMPTY_FORM: ProfileFormState = {
  firstName: "",
  lastName: "",
  birthday: "",
  email: "",
  phone: "",
  city: "",
  country: "",
  countryId: null,
  address: null,
};

const displayBirthday = (value: string): string => {
  const match = value.match(/^(\d{2})[./](\d{2})[./](\d{4})$/);
  if (!match) return value || "Не указана";
  return `${match[1]} / ${match[2]} / ${match[3]}`;
};

const ProfileData = ({ title }: ProfilePageProps) => {
  const { data, isLoading, isError } = useGetUserQuery();
  const [updateUser, updateState] = useUpdateUserMutation();
  const [getSuggestions] = useLazyGetAddressSuggestionsQuery();
  const [geocode] = useLazyGeocodeAddressQuery();
  const [searchCountries] = useLazySearchCountriesQuery();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM);
  const [citySuggestions, setCitySuggestions] = useState<Suggestion[]>([]);
  const [cityOpen, setCityOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressDraft, setAddressDraft] = useState<ProfileAddress | null>(null);

  const user = data?.user;

  const initialForm = useMemo<ProfileFormState>(() => {
    if (!user) return EMPTY_FORM;

    return {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      birthday: user.birthday ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      city: user.city ?? user.address?.city ?? "",
      country: user.country ?? user.address?.country ?? "",
      countryId: user.countryId ?? user.address?.countryId ?? null,
      address: user.address ?? null,
    };
  }, [
    user?.id,
    user?.firstName,
    user?.lastName,
    user?.birthday,
    user?.email,
    user?.phone,
    user?.city,
    user?.country,
    user?.countryId,
    user?.address?.city,
    user?.address?.country,
    user?.address?.countryId,
    user?.address?.formattedAddress,
    user?.address?.latitude,
    user?.address?.longitude,
  ]);

  useEffect(() => {
    if (isEditing) return;

    setForm((current) =>
      JSON.stringify(current) === JSON.stringify(initialForm) ? current : initialForm,
    );
  }, [initialForm, isEditing]);

  useEffect(() => {
    if (!isEditing) {
      setCitySuggestions([]);
      setCityOpen(false);
      return;
    }

    const query = form.city.trim();
    if (query.length < 2 || query === (user?.city ?? "")) {
      setCitySuggestions([]);
      setCityOpen(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(() => {
      void getSuggestions({ query })
        .unwrap()
        .then((items) => {
          if (cancelled) return;
          setCitySuggestions(items.slice(0, 8));
          setCityOpen(items.length > 0);
        })
        .catch(() => {
          if (cancelled) return;
          setCitySuggestions([]);
          setCityOpen(false);
        });
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [form.city, getSuggestions, isEditing, user?.city]);

  const changeField = (field: keyof ProfileFormState, value: string) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
      ...(field === "city" ? { country: "", countryId: null } : {}),
    }));
    setMessage("");
  };

  const selectCity = async (suggestion: Suggestion) => {
    setCityOpen(false);
    setCitySuggestions([]);

    try {
      const result = await geocode({ geocode: suggestion.fullText, results: 1 }).unwrap();
      const address = result[0];

      if (!address) {
        setForm((previous) => ({ ...previous, city: suggestion.title }));
        return;
      }

      const resolvedCountry = (address.country || "").trim();
      let resolvedCountryId: number | null = null;
      let resolvedCountryName = resolvedCountry;

      if (resolvedCountry) {
        try {
          const countries = await searchCountries({ query: resolvedCountry, limit: 10 }).unwrap();
          const exact = countries.countries.find(
            (country) => country.name.trim().toLocaleLowerCase("ru-RU") === resolvedCountry.toLocaleLowerCase("ru-RU"),
          ) ?? countries.countries[0];

          if (exact) {
            resolvedCountryId = exact.id;
            resolvedCountryName = exact.name;
          }
        } catch {
          // Текст страны всё равно сохраняем из геокодера.
        }
      }

      setForm((previous) => ({
        ...previous,
        city: address.city || suggestion.title,
        country: resolvedCountryName || previous.country,
        countryId: resolvedCountryId ?? previous.countryId,
      }));
    } catch {
      setForm((previous) => ({ ...previous, city: suggestion.title }));
    }
  };

  const startEditing = () => {
    setForm(initialForm);
    setMessage("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setForm(initialForm);
    setCitySuggestions([]);
    setCityOpen(false);
    setMessage("");
    setIsEditing(false);
  };

  const save = async () => {
    setMessage("");

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setMessage("Заполните имя, фамилию и электронную почту");
      return;
    }

    try {
      await updateUser({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        birthday: form.birthday.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        city: form.city.trim(),
        country: form.country.trim(),
        countryId: form.countryId,
        address: form.address,
      }).unwrap();

      // Успешное сохранение не показываем отдельным уведомлением: данные
      // просто обновляются в карточке профиля.
      setMessage("");
      setIsEditing(false);
    } catch (error) {
      setMessage(getRequestErrorMessage(error, "Не удалось сохранить данные"));
    }
  };

  if (isLoading) {
    return (
      <div className={styles.content}>
        <h2 className={styles.content__title}>{title}</h2>
        <div className={styles.content__skeleton} />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className={styles.content}>
        <h2 className={styles.content__title}>{title}</h2>
        <p className={styles.content__error}>Не удалось загрузить данные пользователя</p>
      </div>
    );
  }

  return (
    <div className={styles.content}>
      <div className={styles.content__heading}>
        <h2 className={styles.content__title}>{title}</h2>

        {!isEditing ? (
          <button type="button" className={styles.content__edit} onClick={startEditing}>
            Изменить данные
          </button>
        ) : (
          <div className={styles.content__actions}>
            <button type="button" className={styles.content__cancel} onClick={cancelEditing}>
              Отмена
            </button>
            <button
              type="button"
              className={styles.content__save}
              disabled={updateState.isLoading}
              onClick={save}
            >
              {updateState.isLoading ? "Сохраняем..." : "Сохранить"}
            </button>
          </div>
        )}
      </div>

      <div className={styles.content__fields}>
        <label className={styles.content__field}>
          <span className={styles.content__label}>Имя*</span>
          {isEditing ? (
            <input className={styles.content__input} value={form.firstName} onChange={(event) => changeField("firstName", event.target.value)} />
          ) : (
            <p className={styles.content__value}>{form.firstName || "Не указано"}</p>
          )}
        </label>

        <label className={styles.content__field}>
          <span className={styles.content__label}>Фамилия*</span>
          {isEditing ? (
            <input className={styles.content__input} value={form.lastName} onChange={(event) => changeField("lastName", event.target.value)} />
          ) : (
            <p className={styles.content__value}>{form.lastName || "Не указано"}</p>
          )}
        </label>

        <div className={styles.content__field}>
          <span className={styles.content__label}>Дата рождения</span>
          {isEditing ? (
            <BirthdayPicker value={form.birthday} onChange={(value) => changeField("birthday", value)} />
          ) : (
            <p className={styles.content__value}>{displayBirthday(form.birthday)}</p>
          )}
        </div>

        <label className={styles.content__field}>
          <span className={styles.content__label}>Электронная почта*</span>
          {isEditing ? (
            <input type="email" className={styles.content__input} value={form.email} onChange={(event) => changeField("email", event.target.value)} />
          ) : (
            <p className={styles.content__value}>{form.email || "Не указано"}</p>
          )}
        </label>

        <label className={styles.content__field}>
          <span className={styles.content__label}>Телефон*</span>
          {isEditing ? (
            <input type="tel" className={styles.content__input} value={form.phone} onChange={(event) => changeField("phone", event.target.value)} />
          ) : (
            <p className={styles.content__value}>{form.phone || "Не указано"}</p>
          )}
        </label>

        <label className={styles.content__field}>
          <span className={styles.content__label}>Город</span>
          {isEditing ? (
            <>
              <input
                className={styles.content__input}
                value={form.city}
                placeholder="Начните вводить город"
                autoComplete="off"
                onChange={(event) => changeField("city", event.target.value)}
                onFocus={() => citySuggestions.length && setCityOpen(true)}
              />

              {cityOpen && citySuggestions.length > 0 && (
                <div className={styles.content__suggestions}>
                  {citySuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      className={styles.content__suggestion}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => void selectCity(suggestion)}
                    >
                      <span>{suggestion.title}</span>
                      <small>{suggestion.subtitle}</small>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className={styles.content__value}>{form.city || "Не указано"}</p>
          )}
        </label>

        <div className={styles.content__field}>
          <span className={styles.content__label}>Страна</span>
          <p className={`${styles.content__value} ${isEditing ? styles.content__value_muted : ""}`}>
            {form.country || (isEditing ? "Определится после выбора города" : "Не указано")}
          </p>
        </div>

        <div className={`${styles.content__field} ${styles.content__field_address}`}>
          <span className={styles.content__label}>Фактический адрес</span>
          <p className={styles.content__value}>{form.address?.formattedAddress || form.address?.address1 || "Не указан"}</p>
          {form.address?.postalCode && <p className={styles.content__addressMeta}>Индекс: {form.address.postalCode}</p>}
          {isEditing && (
            <button
              type="button"
              className={styles.content__addressButton}
              onClick={() => {
                setAddressDraft(form.address);
                setIsAddressModalOpen(true);
              }}
            >
              Выбрать адрес на карте
            </button>
          )}
        </div>
      </div>

      {message && <p className={styles.content__message}>{message}</p>}

      <Modal
        open={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        overlayClassName={styles.addressModal}
        contentClassName={styles.addressModal__content}
        ariaLabelledBy="profile-address-modal-title"
      >
        <div className={styles.addressModal__header}>
          <h3 id="profile-address-modal-title">Фактический адрес</h3>
          <button type="button" onClick={() => setIsAddressModalOpen(false)} aria-label="Закрыть">×</button>
        </div>
        <ContactAddressEditor
          city={form.city || "Ростов-на-Дону"}
          value={addressDraft}
          onChange={setAddressDraft}
        />
        <div className={styles.addressModal__actions}>
          <button type="button" className={styles.content__cancel} onClick={() => setIsAddressModalOpen(false)}>Отмена</button>
          <button
            type="button"
            className={styles.content__save}
            disabled={!addressDraft}
            onClick={() => {
              if (!addressDraft) return;
              setForm((previous) => ({
                ...previous,
                address: addressDraft,
                city: addressDraft.city || previous.city,
                country: addressDraft.country || previous.country,
                countryId: addressDraft.country && addressDraft.country !== previous.country ? null : previous.countryId,
              }));
              setMessage("");
              setIsAddressModalOpen(false);
            }}
          >
            Выбрать адрес
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileData;
