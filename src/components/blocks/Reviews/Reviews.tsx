import {useEffect, useRef, useState} from "react";
//styles
import styles from './Reviews.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
//components
import ReviewsColumn from "@components/blocks/Reviews/components/ReviewsColumn/ReviewsColumn.tsx";
import ReviewsSlider from "@components/blocks/Reviews/components/ReviewsSlider/ReviewsSlider.tsx";
import ReviewsDots from "@components/blocks/Reviews/components/ReviewsDots/ReviewsDots.tsx";
//api
import {reviews} from "@api/static/reviews.ts";

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