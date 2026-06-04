//styles
import styles from './InfoPage.module.scss'
//blocks
import Reviews from "@components/blocks/Reviews/Reviews.tsx";
import AnswersToQuestions from "@components/blocks/AnswersToQuestions/AnswersToQuestions.tsx";
import SubscribeNewsLetter from "@components/blocks/SubscribeNewsLetter/SubscribeNewsLetter.tsx";
import InfoComponent from "@components/blocks/InfoComponent/InfoComponent.tsx";
//components
import Breadcrumbs from "@components/Breadcrumbs/Breadcrumbs.tsx";

const InfoPage = () => {
    return (
        <>
            <Breadcrumbs/>
            <main className={styles.page__main}>
                <InfoComponent/>
                <Reviews/>
                <AnswersToQuestions/>
                <SubscribeNewsLetter/>
            </main>
        </>
    );
};

export default InfoPage;