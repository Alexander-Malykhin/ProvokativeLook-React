//styles
import styles from './ContactsPage.module.scss'
//blocks
import ContactUs from "@components/blocks/ContactUs/ContactUs.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";


const ContactsPage = () => {
    return (
        <>
            <Breadcrumbs title={'Связаться с нами'}/>
            <main className={styles.page__main}>
                <ContactUs/>
                <SubscribeNewsLetter/>
            </main>
        </>
    );
};

export default ContactsPage;