import { Link, useParams } from "react-router-dom";

import styles from "./ProfileReturn.module.scss";
import type { ProfilePageProps } from "@components/blocks/Profile/types/types.ts";
import { PROFILE_RETURNS } from "./data";
import ReturnCard from "./components/ReturnCard/ReturnCard";

const ProfileReturn = ({ title }: ProfilePageProps) => {
  const { id } = useParams<{ id?: string }>();
  const selectedReturn = id
    ? PROFILE_RETURNS.find((item) => item.id === Number(id))
    : undefined;
  const visibleReturns = id
    ? selectedReturn
      ? [selectedReturn]
      : []
    : PROFILE_RETURNS;

  return (
    <div className={styles.content}>
      <h2 className={styles.content__title}>
        {selectedReturn
          ? `Возврат по заказу № ${selectedReturn.orderNumber}`
          : title}
      </h2>

      {id && (
        <Link to="/profile/return" className={styles.content__back}>
          Вернуться к возвратам
        </Link>
      )}

      {id && !selectedReturn && <p>Возврат не найден.</p>}

      <div className={styles.content__list}>
        {visibleReturns.map((item) => (
          <ReturnCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default ProfileReturn;
