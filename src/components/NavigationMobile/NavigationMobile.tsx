import {useEffect, useState} from "react";
import {useDispatch, useSelector} from 'react-redux';
import type {RootState} from '@store/store';
import {NavLink} from "react-router-dom";
//styles
import styles from './NavigationMobile.module.scss'
//images
import arrowRightImage from '@assets/arrows/arrow-shevron-right.svg'
//layouts
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//UI
import Image from "@UI/buttons/Image/Image.tsx";
//api
import {navigationMain} from "@api/static/navigationMain.ts";
//store
import {close} from '@store/slices/toggleMenuNavigationSlice';

const catalogItems = [
    { text: 'СМОТРЕТЬ ВСЁ', path: '/catalog' },
    { text: 'Комбинезоны и костюмы', path: '/catalog/kombinezony-i-kostyumy' },
    { text: 'Верхняя одежда', path: '/catalog/verhnyaya-odezhda' },
    { text: 'Платья и сарафаны', path: '/catalog/platya-i-sarafany' },
    { text: 'Обувь', path: '/catalog/obuv' },
    { text: 'Брюки и шорты', path: '/catalog/bryuki-i-shorty' },
    { text: 'Комплекты', path: '/catalog/komplekty' },
    { text: 'Топы и футболки', path: '/catalog/topy-i-futbolki' },
    { text: 'Юбки', path: '/catalog/yubki' },
];

const NavigationMobile = () => {
    const [menu, setMenu] = useState<'main' | 'catalog'>('main');

    const dispatch = useDispatch();

    const active = useSelector(
        (state: RootState) => state.toggleMenuNavigation.active
    );

    useEffect(() => {
        if (!active) {
            setMenu('main');
        }
    }, [active]);

    if (!active) return null;

    return (
        <MainLayoutContainer className={styles.navigation}>
            <nav className={styles.navigation__list}>
                {menu === 'main' && (
                    <>
                        {navigationMain.map((item) => {
                            if (item.text === 'Каталог') {
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        className={styles.navigation__item}
                                        onClick={() => setMenu('catalog')}
                                    >
                                        {item.text}
                                        <Image src={arrowRightImage} alt={'arrow-icon'}
                                               className={styles.navigation__item_image}/>
                                    </button>
                                );
                            }

                            return (
                                <NavLink
                                    key={item.id}
                                    to={item.path}
                                    className={`${styles.navigation__item} ${
                                        item.text === 'Распродажа'
                                            ? styles.navigation__item_sale
                                            : ''
                                    }`}
                                    onClick={() => dispatch(close())}
                                >
                                    {item.text}
                                </NavLink>
                            );
                        })}
                    </>
                )}

                {menu === 'catalog' && (
                    <>
                        <button
                            type="button"
                            className={styles.navigation__back}
                            onClick={() => setMenu('main')}
                        >
                            <Image src={arrowRightImage} className={styles.navigation__back_image}/>
                            Каталог
                        </button>

                        <div className={styles.navigation__list_back}>
                            {catalogItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={styles.navigation__item}
                                    onClick={() => dispatch(close())}
                                >
                                    {item.text}
                                </NavLink>
                            ))}
                        </div>
                    </>
                )}
            </nav>
        </MainLayoutContainer>
    );
};

export default NavigationMobile;