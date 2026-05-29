//styles
import styles from './ContactsPage.module.scss'
import Header from "@components/blocks/Header/Header.tsx";
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import Footer from "@components/blocks/Footer/Footer.tsx";
import RunningLine from "@components/RunningLine/RunningLine.tsx";
import ContactUs from "@components/blocks/ContactUs/ContactUs.tsx";
//blocks

const ContactsPage = () => {
    return (
        <>
            <Header/>
            <RunningLine text={'Доставка по России 300 ₽'}/>
            <Breadcrumbs title={'Связаться с нами'}/>
            <main className={styles.page__main}>
                <ContactUs/>
                <SubscribeNewsLetter/>
            </main>
            <Footer/>
        </>
    );
};

export default ContactsPage;