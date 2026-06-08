//UI
import Text from "@UI/typography/Text/Text.tsx";
import Image from "@UI/buttons/Image/Image.tsx";
//types
import type { FooterSocialsProps } from "./types";
//styles
import styles from "./FooterSocials.module.scss";

const FooterSocials = ({ items }: FooterSocialsProps) => {
    return (
        <div className={styles.socials}>
            <Text>Присоединяйтесь к нам в социальных сетях:</Text>

            <div className={styles.socials__list}>
                {items.map((item) => (
                    <a
                        href={item.properties.MESSENGERS_LINK}
                        className={styles.socials__item}
                        key={item.id}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {item.properties.MESSENGERS_ICON && (
                            <Image
                                src={item.properties.MESSENGERS_ICON}
                                alt={item.title}
                                className={styles.socials__image}
                            />
                        )}
                    </a>
                ))}
            </div>
        </div>
    );
};

export default FooterSocials;