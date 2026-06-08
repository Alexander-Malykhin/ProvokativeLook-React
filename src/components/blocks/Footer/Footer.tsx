import { useState } from "react";
//layouts
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import FooterCitySelect from "./components/FooterCitySelect/FooterCitySelect";
import FooterContacts from "./components/FooterContacts/FooterContacts";
import FooterNavigation from "./components/FooterNavigation/FooterNavigation";
import FooterSocials from "./components/FooterSocials/FooterSocials";
import FooterBottom from "./components/FooterBottom/FooterBottom";
import FooterCookie from "./components/FooterCookie/FooterCookie";
import FooterSkeleton from "./components/FooterSkeleton/FooterSkeleton";
//api
import { useGetHomeQuery } from "@store/api/home/homeApi.ts";
//styles
import styles from "./Footer.module.scss";

const Footer = () => {
    const { data, isLoading, isError } = useGetHomeQuery();
    const [opened, setOpened] = useState<string | null>("Каталог");

    if (isLoading) return <FooterSkeleton />;
    if (isError || !data) return null;

    const getInfo = (key: string) =>
        data.footerInformation.find((item) => item.key === key)?.text ?? "";

    const phone = getInfo("phone");
    const workTime = getInfo("workTime");
    const email = getInfo("email").replace("Электронная почта:", "").trim();
    const address = getInfo("address");
    const requisites = getInfo("requisites");
    const design = getInfo("design").replace("Дизайн сайта:", "").trim();

    return (
        <footer className={styles.footer}>
            <FooterCitySelect />

            <div className={styles.footer__line}>
                <MainLayoutContainer className={styles.footer__content}>
                    <FooterContacts
                        phone={phone}
                        workTime={workTime}
                        email={email}
                        address={address}
                    />

                    <FooterNavigation
                        items={data.footerNavigation}
                        opened={opened}
                        onToggle={setOpened}
                    />

                    <FooterSocials items={data.footerSocials} />

                    <FooterBottom
                        requisites={requisites}
                        design={design}
                    />
                </MainLayoutContainer>
            </div>

            <FooterCookie />
        </footer>
    );
};

export default Footer;