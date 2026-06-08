import { useEffect, useRef, useState } from 'react';
//components
import CatalogPromoItem from "@components/blocks/CatalogPromo/components/CatalogPromoItem/CatalogPromoItem.tsx";
import BestsellersDots from "@components/blocks/Bestsellers/components/BestsellersDots/BestsellersDots.tsx";
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
//styles
import styles from './CatalogPromo.module.scss';
//api
import { useGetHomeQuery } from '@store/api/home/homeApi.ts';

const CatalogPromo = () => {
    const { data } = useGetHomeQuery();

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const promoOrder = [
        'Комбинезоны #br# и костюмы',
        'Верхняя #br# одежда',
        'Платья #br# и сарафаны',
    ];

    const promoCategories = [...(data?.categories ?? [])]
        .filter((category) => category.properties.CATEGORY_SHOW_PROMO === 'Да')
        .sort((a, b) => (
            promoOrder.indexOf(a.properties.CATEGORY_NAME_PROMO) -
            promoOrder.indexOf(b.properties.CATEGORY_NAME_PROMO)
        ));

    const getMaxScrollLeft = () => {
        const slider = sliderRef.current;

        if (!slider) return 0;

        return slider.scrollWidth - slider.clientWidth;
    };

    const getSlideLeft = (index: number) => {
        const maxScrollLeft = getMaxScrollLeft();

        if (promoCategories.length <= 1) return 0;

        return (maxScrollLeft / (promoCategories.length - 1)) * index;
    };

    const scrollToIndex = (index: number) => {
        const slider = sliderRef.current;

        if (!slider) return;

        slider.scrollTo({
            left: getSlideLeft(index),
            behavior: 'smooth',
        });

        setActiveIndex(index);
    };

    useEffect(() => {
        const slider = sliderRef.current;

        if (!slider) return;

        const handleSliderScroll = () => {
            const maxScrollLeft = getMaxScrollLeft();

            if (!maxScrollLeft) {
                setActiveIndex(0);
                return;
            }

            const nextIndex = Math.round(
                (slider.scrollLeft / maxScrollLeft) * (promoCategories.length - 1)
            );

            setActiveIndex(nextIndex);
        };

        slider.addEventListener('scroll', handleSliderScroll);

        return () => {
            slider.removeEventListener('scroll', handleSliderScroll);
        };
    }, [promoCategories.length]);

    return (
        <SectionLayout className={styles.promo}>
            <div className={styles.promo__list} ref={sliderRef}>
                {promoCategories.map((category, index) => (
                    <CatalogPromoItem
                        key={category.id}
                        index={index + 1}
                        title={category.properties.CATEGORY_NAME_PROMO}
                        image={category.properties.CATEGORY_IMAGE_PROMO}
                        link={category.properties.CATEGORY_LINK}
                    />
                ))}
            </div>

            <BestsellersDots
                count={promoCategories.length}
                activeIndex={activeIndex}
                onDotClick={scrollToIndex}
            />
        </SectionLayout>
    );
};

export default CatalogPromo;