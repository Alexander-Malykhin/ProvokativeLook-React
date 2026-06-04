import { Link } from 'react-router-dom';
//styles
import styles from './CategoryPromo.module.scss';
//layouts
import SectionLayout from '@layouts/SectionLayout/SectionLayout';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer';
//UI
import Image from '@UI/buttons/Image/Image';
import Title from "@UI/typography/Title/Title.tsx";
//api
import {navigationHomePromo} from "@api/static/navigationHomePromo.ts";


const CategoryPromo = () => {
    return (
        <SectionLayout>
            <MainLayoutContainer className={styles.promo}>
                {navigationHomePromo.map((item) => (
                    <Link key={item.id} to={item.path} className={styles.promo__item}>
                        <Image src={item.image} alt={item.title} className={styles.promo__image}/>

                        <div className={styles.promo__information}>
                            <Title className={styles.promo__title} size={'xl'}>
                                {item.title}
                            </Title>
                        </div>
                    </Link>
                ))}
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default CategoryPromo;