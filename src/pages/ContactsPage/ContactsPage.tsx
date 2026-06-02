//styles
import styles from './ContactsPage.module.scss'
//header
import Header from "@components/blocks/Header/Header.tsx";
//blocks
import ContactUs from "@components/blocks/ContactUs/ContactUs.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//footer
import Footer from "@components/blocks/Footer/Footer.tsx";
//components
import RunningLine from "@components/RunningLine/RunningLine.tsx";
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";


const ContactsPage = () => {
    return (
        <>
            <Header/>
            <RunningLine/>
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