//styles
import styles from './AboutPage.module.scss'
//blocks
import About from "@components/blocks/About/About.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";

const AboutPage = () => {
    return (
        <>
            <Breadcrumbs title={'О нас'}/>
            <main className={styles.page__main}>
                <About/>
                <SubscribeNewsLetter/>
            </main>
        </>
    );
};

export default AboutPage;