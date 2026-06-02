import {useEffect, useRef, useState} from "react";
//styles
import styles from './Reviews.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
//components
import ReviewsColumn from "@components/blocks/Reviews/components/ReviewsColumn/ReviewsColumn.tsx";
import ReviewsSlider from "@components/blocks/Reviews/components/ReviewsSlider/ReviewsSlider.tsx";
import ReviewsDots from "@components/blocks/Reviews/components/ReviewsDots/ReviewsDots.tsx";

const reviews = [
    {
        id: 1,
        name: 'Александра',
        date: '26 февраля 2025',
        text: 'Этот магазин женской одежды – просто находка! Ассортимент невероятно разнообразен и стильный. На любой вкус и случай можно найти что-то особенное. Я уже несколько раз совершала покупки в этом магазине, и каждый раз остаюсь в восторге! Вещи отлично сидят, долго носятся и вызывают положительные эмоции.',
    },
    {
        id: 2,
        name: 'Елена',
        date: '15 февраля 2025',
        text: 'Восхитительный магазин! Нашла идеальное платье быстро и легко. Качество превосходное, ткань приятная к телу, швы ровные. Размер подошел идеально по описанию на сайте. Доставка быстрая, курьер вежливый. Упаковка аккуратная, платье пришло не мятым. Обслуживание на высоте!',
    },
    {
        id: 3,
        name: 'Александра',
        date: '26 февраля 2025',
        text: 'Этот магазин женской одежды – просто находка! Ассортимент невероятно разнообразен и стильный. На любой вкус и случай можно найти что-то особенное. Я уже несколько раз совершала покупки в этом магазине, и каждый раз остаюсь в восторге! Вещи отлично сидят, долго носятся и вызывают положительные эмоции.',
    },
    {
        id: 4,
        name: 'Елена',
        date: '15 февраля 2025',
        text: 'Восхитительный магазин! Нашла идеальное платье быстро и легко. Качество превосходное, ткань приятная к телу, швы ровные. Размер подошел идеально по описанию на сайте. Доставка быстрая, курьер вежливый. Упаковка аккуратная, платье пришло не мятым. Обслуживание на высоте!',
    },
];

const Reviews = () => {

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const getScrollStep = () => {
        const slider = sliderRef.current;
        const firstCard = slider?.firstElementChild as HTMLElement | null;

        if (!slider || !firstCard) return 0;

        const gap = parseFloat(window.getComputedStyle(slider).gap) || 0;

        return firstCard.offsetWidth + gap;
    };

    const scrollToIndex = (index: number) => {
        const slider = sliderRef.current;
        const scrollStep = getScrollStep();

        if (!slider) return;

        slider.scrollTo({
            left: scrollStep * index,
            behavior: 'smooth',
        });

        setActiveIndex(index);
    };

    const handleScroll = (direction: 'prev' | 'next') => {
        const nextIndex =
            direction === 'next'
                ? Math.min(activeIndex + 1, reviews.length - 1)
                : Math.max(activeIndex - 1, 0);

        scrollToIndex(nextIndex);
    };

    useEffect(() => {
        const slider = sliderRef.current;

        if (!slider) return;

        const handleSliderScroll = () => {
            const scrollStep = getScrollStep();

            if (!scrollStep) return;

            setActiveIndex(Math.round(slider.scrollLeft / scrollStep));
        };

        slider.addEventListener('scroll', handleSliderScroll);

        return () => {
            slider.removeEventListener('scroll', handleSliderScroll);
        };
    }, []);

    return (
        <SectionLayout className={styles.reviews}>
            <ReviewsColumn
                onPrev={() => handleScroll('prev')}
                onNext={() => handleScroll('next')}
            />
            <ReviewsSlider
                sliderRef={sliderRef}
                reviews={reviews}
            />
            <ReviewsDots
                count={reviews.length}
                activeIndex={activeIndex}
                onDotClick={scrollToIndex}
            />
        </SectionLayout>
    );
};

export default Reviews;