//styles
import styles from './ContactUs.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//UI
import Image from "@UI/buttons/Image/Image.tsx";
//components
import ContactUsSkeleton from "@components/blocks/ContactUs/components/ContactUsSkeleton.tsx";
//api
import { useGetContactsQuery } from "@store/api/contacts/contactsApi.ts";


const ContactUs = () => {
    const { data, isLoading, isError } = useGetContactsQuery();

    if (isLoading) return <ContactUsSkeleton />;

    if (isError || !data) return null;

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.contacts}>
                <div className={styles.contacts__column}>
                    <div className={styles.contacts__row}>
                        <span className={styles.contacts__label}>
                            Телефон:
                        </span>
                        <a href={`tel:${data.phone.replace(/\D/g, '')}`} className={styles.contacts__phone}>
                            {data.phone}
                        </a>
                    </div>

                    <div className={styles.contacts__row}>
                        <span className={styles.contacts__label}>
                            Электронная почта:
                        </span>
                        <a href={`mailto:${data.email}`} className={styles.contacts__text}>
                            {data.email}
                        </a>
                    </div>

                    <div className={styles.contacts__row}>
                        <span className={styles.contacts__label}>
                            Фактический адрес:
                        </span>
                        <p className={styles.contacts__text}>
                            {data.address}
                        </p>
                    </div>

                    <p className={styles.contacts__text}>
                        {data.workTime}
                    </p>

                    <div className={styles.contacts__list}>
                        {data.links.map((item) => (
                            <a
                                key={item.id}
                                href={item.link}
                                target="_blank"
                                rel="noreferrer"
                                className={styles.contacts__item}
                            >
                                {item.icon && (
                                    <Image
                                        src={item.icon}
                                        alt={`${item.title}-icon`}
                                        className={styles.contacts__item_image}
                                    />
                                )}
                            </a>
                        ))}
                    </div>
                </div>

                {data.map && (
                    <Image
                        src={data.map}
                        alt="map"
                        className={styles.contacts__map}
                    />
                )}
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default ContactUs;