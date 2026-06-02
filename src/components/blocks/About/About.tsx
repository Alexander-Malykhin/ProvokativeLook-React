//styles
import styles from './About.module.scss'
//images
import AboutImage from '@assets/about/about.png'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//UI
import Image from "@UI/buttons/Image/Image.tsx";

const About = () => {
    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.about}>
                <div className={styles.about__row}>
                    <div className={styles.about__column}>
                        <p className={`${styles.about__text} ${styles.about__text_container}`}>
                            <span className={styles.about__accent}><strong>PROVOKATSIA</strong></span> - это не просто
                            магазин одежды, это стиль жизни, мироощущения и свобода самовыражения!
                        </p>

                        <p className={`${styles.about__text} ${styles.about__text_container}`}>
                            Мы подчеркнём твои самобытность и душевную наполненность нетривиальным
                            дизайном! <br/> Бунтуй
                            вместе с нами против лощенного гламура и массмаркета! Будь в гармонии с собой, и помни
                            - <span className={styles.about__accent}><strong>ТЫ ТАКАЯ ОДНА!</strong></span>
                        </p>

                        <p className={`${styles.about__text} ${styles.about__text_container}`}>
                            Наполнять комфортом и яркими креативными акцентами каждый момент жизни - так звучит
                            предназначение <span className={styles.about__accent}><strong>PROVOKATSIA</strong></span> уже много лет.
                        </p>
                    </div>

                    <Image src={AboutImage} alt={'about-icon'} className={styles.about__image}/>
                </div>
                <div className={styles.about__list}>
                    <div className={styles.about__item}>
                        <h2 className={styles.about__item_title}>
                            Опыт и надёжность
                        </h2>
                        <p className={styles.about__text}>
                            Более 20 лет - официальный представитель самых крупных креативных брендов обуви и текстиля
                            Турции. Наш опыт позволяет предложить только лучшие работы талантливых дизайнеров нашим
                            клиентам. Выбираем для вас исключительно стильные модели из новых коллекций.
                        </p>
                    </div>
                    <div className={styles.about__item}>
                        <h2 className={styles.about__item_title}>
                            Индивидуальный подход
                        </h2>
                        <p className={styles.about__text}>
                            Мы понимаем свою ответственность за ваше отражение ! Наша команда профессионалов готова
                            предложить персонализированные решения относительно пропорций фигуры и личных предпочтений
                            каждой из вас! Мы знаем как помочь клиенту сделать правильный выбор!
                        </p>
                    </div>
                    <div className={styles.about__item}>
                        <h2 className={styles.about__item_title}>
                            Доверие клиентов
                        </h2>
                        <p className={styles.about__text}>
                            Уже более миллиона довольных покупателей - это не просто цифра, это результат нашей
                            преданности качеству обслуживания и клиентоориентированности! Мы ценим доверие наших модниц
                            и стремимся его оправдать !
                        </p>
                    </div>
                </div>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default About;