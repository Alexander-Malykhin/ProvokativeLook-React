//styles
import styles from './AboutPage.module.scss'
//header
import Header from "@components/blocks/Header/Header.tsx";
//blocks
import About from "@components/blocks/About/About.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
//footer
import Footer from "@components/blocks/Footer/Footer.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";
import RunningLine from "@components/RunningLine/RunningLine.tsx";

const AboutPage = () => {
    return (
        <>
            <Header/>
            <RunningLine text={'Доставка по России 300 ₽'}/>
            <Breadcrumbs title={'О нас'}/>
            <main className={styles.page__main}>
                <About/>
                <SubscribeNewsLetter/>
            </main>
            <Footer/>
        </>
    );
};

export default AboutPage;