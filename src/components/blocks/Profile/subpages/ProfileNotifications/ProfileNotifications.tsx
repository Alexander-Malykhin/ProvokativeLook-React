import {useState} from "react";
//styles
import styles from "./ProfileNotifications.module.scss";
//types
import type { ProfilePageProps } from "@components/blocks/Profile/types/types.ts";
//data
import { type ProfileNotification, PROFILE_NOTIFICATIONS } from "./data";
//components
import NotNotification from "./components/NotNotification/NotNotification";
import NotificationItem from "./components/NotificationItem/NotificationItem";

const ProfileNotifications = ({ title }: ProfilePageProps) => {

    const [notifications] = useState<ProfileNotification[]>(PROFILE_NOTIFICATIONS);

    return (
        <div className={styles.content}>
            <h2 className={styles.content__title}>{title}</h2>

            {
                notifications.length > 0 ?
                    (
                        <>
                            <div className={styles.content__list}>
                                {notifications.map((item) => (
                                    <NotificationItem key={item.id} item={item} />
                                ))}
                            </div>

                            <button type="button" className={styles.button}>
                                Загрузить ещё
                            </button>
                        </>
                    ) :
                    <NotNotification />
            }
        </div>
    );
};

export default ProfileNotifications;
