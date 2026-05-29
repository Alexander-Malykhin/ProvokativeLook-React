//styles
import styles from './ContactUs.module.scss'
//images
import MapImage from '@assets/contacts/map.png';
import TelegramIcon from '@assets/socials/tg.svg';
import WhatsAppIcon from '@assets/socials/whats-app.svg';
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//UI
import Image from "@UI/buttons/Image/Image.tsx";


const ContactUs = () => {
    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.contacts}>
                <div className={styles.contacts__column}>
                    <div className={styles.contacts__row}>
                        <span className={styles.contacts__label}>
                            Телефон:
                        </span>
                        <a href={'tel:+79281090545'} className={styles.contacts__phone}>
                            +7 (928) 109-05-45
                        </a>
                    </div>

                    <div className={styles.contacts__row}>
                        <span className={styles.contacts__label}>
                            Электронная почта:
                        </span>
                        <a href={'mailto:provokatsiashop@gmail.com'} className={styles.contacts__text}>
                            provokatsiashop@gmail.com
                        </a>
                    </div>

                    <div className={styles.contacts__row}>
                        <span className={styles.contacts__label}>
                           Фактический адрес:
                        </span>
                        <p className={styles.contacts__text}>
                            344045, г. Ростов-на-Дону, ул. Думенко 3/2, ТЦ «Пчёлка», офис 54
                        </p>
                    </div>

                    <p className={styles.contacts__text}>
                        Работаем с 09:00-19:00, Пн-Вс
                    </p>

                    <div className={styles.contacts__list}>
                        <a href={'#'} className={styles.contacts__item}>
                            <Image src={TelegramIcon} alt={'telegram-icon'} className={styles.contacts__item_image}/>
                        </a>
                        <a  href={'#'} className={styles.contacts__item}>
                            <Image src={WhatsAppIcon} alt={'whatsApp-icon'} className={styles.contacts__item_image}/>
                        </a>
                    </div>
                </div>
                <Image src={MapImage} alt={'map-icon'} className={styles.contacts__map}/>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default ContactUs;