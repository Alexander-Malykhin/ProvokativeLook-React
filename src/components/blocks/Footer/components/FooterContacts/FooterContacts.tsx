//UI
import Text from "@UI/typography/Text/Text.tsx";
//helpers
import { convertAliasTitle } from "@helpers/convertAliasTitle.tsx";
//types
import type { FooterContactsProps } from "./types";
//styles
import styles from "./FooterContacts.module.scss";

const FooterContacts = ({ phone, workTime, email, address }: FooterContactsProps) => {
    return (
        <div className={styles.contacts}>
            <a href={`tel:${phone.replace(/\D/g, "")}`} className={styles.contacts__phone}>
                {phone}
            </a>

            <div className={styles.contacts__description}>
                <Text>{convertAliasTitle(workTime.replace(/\r?\n/g, "#br#"))}</Text>

                <Text>
                    Электронная почта:{" "}
                    <a href={`mailto:${email}`}>
                        {email}
                    </a>
                </Text>

                <Text>{convertAliasTitle(address.replace(/\r?\n/g, "#br#"))}</Text>
            </div>
        </div>
    );
};

export default FooterContacts;