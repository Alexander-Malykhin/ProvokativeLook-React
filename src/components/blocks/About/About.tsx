//styles
import styles from './About.module.scss';
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import AboutSkeleton from "@components/blocks/About/components/AboutSkeleton/AboutSkeleton.tsx";
import AboutFormatedText from "@components/blocks/About/components/AboutFormatedText/AboutFormatedText.tsx";
//UI
import Image from "@UI/buttons/Image/Image.tsx";
//api
import { useGetAboutQuery } from "@store/api/about/aboutApi.ts";

const About = () => {
    const { data, isLoading, isError } = useGetAboutQuery();

    if (isLoading) return <AboutSkeleton />;

    if (isError || !data) {
        console.log(data)
        return null
    };

    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.about}>
                <div className={styles.about__row}>
                    <AboutFormatedText
                        text={data.text}
                        className={styles.about__column}
                        paragraphClassName={`${styles.about__text} ${styles.about__text_container}`}
                        accentClassName={styles.about__accent}
                    />

                    {data.image && (
                        <Image
                            src={data.image}
                            alt={data.title}
                            className={styles.about__image}
                        />
                    )}
                </div>

                <div className={styles.about__list}>
                    {data.blocks.map((block, index) => (
                        <div key={index} className={styles.about__item}>
                            <h2 className={styles.about__item_title}>
                                {block.title}
                            </h2>

                            <p className={styles.about__text}>
                                {block.text}
                            </p>
                        </div>
                    ))}
                </div>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default About;