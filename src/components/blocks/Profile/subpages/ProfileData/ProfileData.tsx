// styles
import styles from "./ProfileData.module.scss";
// types
import type {
  ProfileDataFieldInterface,
  ProfilePageProps,
} from "@components/blocks/Profile/types/types.ts";
// api
import { useGetUserQuery } from "@store/api/user/userApi.ts";
// components
import ProfileDataField from "./components/ProfileDataField/ProfileDataField";

const formatBirthday = (birthday: string | null): string => {
  if (!birthday) return "Не указана";

  const date = new Date(birthday);

  if (Number.isNaN(date.getTime())) return birthday;

  return date.toLocaleDateString("ru-RU");
};

const ProfileData = ({ title }: ProfilePageProps) => {
  const { data, isLoading, isError } = useGetUserQuery();

  if (isLoading) {
    return (
      <div className={styles.content}>
        <h2 className={styles.content__title}>{title}</h2>

        <p>Загрузка...</p>
      </div>
    );
  }

  if (isError || !data?.success || !data.user) {
    return (
      <div className={styles.content}>
        <h2 className={styles.content__title}>{title}</h2>

        <p className={styles.content__error}>
          Не удалось загрузить данные пользователя
        </p>
      </div>
    );
  }

  const fields: ProfileDataFieldInterface[] = [
    {
      id: "firstName",
      label: "Имя*",
      value: data.user.firstName,
    },
    {
      id: "lastName",
      label: "Фамилия*",
      value: data.user.lastName,
    },
    {
      id: "birthday",
      label: "Дата рождения",
      value: formatBirthday(data.user.birthday),
    },
    {
      id: "email",
      label: "Электронная почта*",
      value: data.user.email,
    },
    {
      id: "phone",
      label: "Телефон*",
      value: data.user.phone,
    },
    {
      id: "city",
      label: "Город",
      value: data.user.city,
    },
  ];

  return (
    <div className={styles.content}>
      <h2 className={styles.content__title}>{title}</h2>

      <div className={styles.content__fields}>
        {fields.map((field) => (
          <ProfileDataField key={field.id} field={field} />
        ))}
      </div>
    </div>
  );
};

export default ProfileData;
