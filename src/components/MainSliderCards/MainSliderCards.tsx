import { useEffect, useState } from 'react';
//hooks
import { useHorizontalSlider } from '@/hooks/useHorizontalSlider';
//styles
import styles from './MainSliderCards.module.scss';
//layouts
import SectionLayout from '@layouts/SectionLayout/SectionLayout';
import MainLayoutContainer from '@layouts/MainLayoutContainer/MainLayoutContainer';
//components
import ActionColumn from './components/ActionColumn/ActionColumn';
//types
import type { MainSliderCardsInterface } from './types/types';
//UI
import MainButton from "@UI/buttons/MainButton/MainButton.tsx";

const MainSliderCards = ({title, children, withControls = true, withFullContainer = false, scrollStep = 240, mode = 'slider', showMoreButton = false, moreButtonText = 'Показать больше',}: MainSliderCardsInterface) => {
    const { sliderRef, scrollSlider } = useHorizontalSlider(scrollStep);

    const [activeIndex, setActiveIndex] = useState(0);
    const [dotsCount, setDotsCount] = useState(0);

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const updateDots = () => {
            const step = slider.clientWidth;
            if (!step) return;

            const count = Math.ceil(slider.scrollWidth / step);
            const index = Math.round(slider.scrollLeft / step);

            setDotsCount(count);
            setActiveIndex(Math.min(index, count - 1));
        };

        updateDots();

        slider.addEventListener('scroll', updateDots);
        window.addEventListener('resize', updateDots);

        return () => {
            slider.removeEventListener('scroll', updateDots);
            window.removeEventListener('resize', updateDots);
        };
    }, [sliderRef]);

    const scrollToSlide = (index: number) => {
        const slider = sliderRef.current;
        if (!slider) return;

        slider.scrollTo({
            left: slider.clientWidth * index,
            behavior: 'smooth',
        });
    };

    const content = (
        <div
            className={`${styles.slider} ${
                withFullContainer ? styles.slider_container : ''
            } ${styles[`slider_${mode}`]}`}
        >
            <ActionColumn
                title={title}
                scrollSlider={scrollSlider}
                withControls={withControls}
            />

            {typeof children === 'function'
                ? children({ sliderRef, scrollSlider })
                : children}

            {mode === 'grid' && showMoreButton && (
                <MainButton type="button" className={styles.slider__more}>
                    {moreButtonText}
                </MainButton>
            )}

            {!showMoreButton && (
                <div className={styles.slider__dots}>
                    {Array.from({ length: dotsCount }).map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            className={`${styles.slider__dot} ${
                                activeIndex === index ? styles.slider__dot_active : ''
                            }`}
                            onClick={() => scrollToSlide(index)}
                            aria-label={`Перейти к слайду ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <SectionLayout>
            {withFullContainer ? (
                <MainLayoutContainer>{content}</MainLayoutContainer>
            ) : (
                content
            )}
        </SectionLayout>
    );
};

export default MainSliderCards;