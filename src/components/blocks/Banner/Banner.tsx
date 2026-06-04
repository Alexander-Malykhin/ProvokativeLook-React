import {useNavigate} from "react-router";
//styles
import styles from './Banner.module.scss'
//images
import BannerLeftImage from '@assets/banner/banner-left.png'
import BannerRightImage from '@assets/banner/banner-right.png'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
//components
import BannerCategory from "@components/blocks/Banner/components/BannerCategory/BannerCategory.tsx";
//UI
import Image from "@UI/buttons/Image/Image.tsx";
import BannerTitle from "@UI/titles/BannerTitle/BannerTitle.tsx";
import MainButton from '@/UI/buttons/MainButton/MainButton';


const Banner = () => {

    const navigate = useNavigate();

    return (
        <SectionLayout className={styles.banner}>
            <div className={styles.banner__content}>
                <Image src={BannerLeftImage}/>
                <div className={styles.banner__information}>
                    <BannerTitle className={styles.banner__information_title}>
                        Стиль жизни, мироощущения
                    </BannerTitle>
                    <BannerTitle className={styles.banner__information_title}>
                        Свобода самовыражения
                    </BannerTitle>
                    <div className={styles.banner__information_footer}>
                        <MainButton mode="text" color="black" onClick={() => navigate('/#new-collection')}>
                            Новая коллекция
                        </MainButton>
                    </div>
                </div>
                <Image src={BannerRightImage}/>
            </div>
            <BannerCategory/>
        </SectionLayout>
    );
};

export default Banner;