import {useNavigate} from "react-router";
//styles
import styles from './Banner.module.scss';
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
//components
import BannerCategory from "@components/blocks/Banner/components/BannerCategory/BannerCategory.tsx";
import BannerSkeleton from "@components/blocks/Banner/components/BannerSkeleton/BannerSkeleton.tsx";
//UI
import Image from "@UI/buttons/Image/Image.tsx";
import BannerTitle from "@UI/titles/BannerTitle/BannerTitle.tsx";
import MainButton from '@/UI/buttons/MainButton/MainButton';
//api
import {useGetHomeQuery} from "@store/api/home/homeApi.ts";

const Banner = () => {
    const navigate = useNavigate();
    const {data, isLoading, isError} = useGetHomeQuery();

    if (isLoading) return <BannerSkeleton/>;
    if (isError || !data) return null;

    return (
        <SectionLayout className={styles.banner}>
            <div className={styles.banner__content}>
                {data.bannerImageLeft && <Image src={data.bannerImageLeft}/>}

                <div className={styles.banner__information}>
                    {data.bannerText.map((text) => (
                        <BannerTitle key={text} className={styles.banner__information_title}>
                            {text}
                        </BannerTitle>
                    ))}
                    <div className={styles.banner__information_footer}>
                        <MainButton
                            mode="text"
                            color="black"
                            onClick={() => navigate('/#new-collection')}
                        >
                            Новая коллекция
                        </MainButton>
                    </div>
                </div>

                {data.bannerImageRight && <Image src={data.bannerImageRight}/>}
            </div>

            <BannerCategory items={data.categoryList}/>
        </SectionLayout>
    );
};

export default Banner;