//UI
import Text from "@UI/typography/Text/Text.tsx";
//helpers
import { convertAliasTitle } from "@helpers/convertAliasTitle.tsx";
//types
import type { FooterBottomProps } from "./types";
//styles
import styles from "./FooterBottom.module.scss";

const FooterBottom = ({ requisites, design }: FooterBottomProps) => {
    return (
        <div className={styles.bottom}>
            <div className={styles.bottom__legal}>
                <Text>{convertAliasTitle(requisites.replace(/\r?\n/g, "#br#"))}</Text>
            </div>

            <div className={styles.bottom__design}>
                <Text>Дизайн сайта: {design}</Text>
            </div>
        </div>
    );
};

export default FooterBottom;