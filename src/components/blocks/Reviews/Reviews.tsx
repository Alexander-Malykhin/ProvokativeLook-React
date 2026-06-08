import { useEffect, useRef, useState } from "react";
//styles
import styles from "./Reviews.module.scss";
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
//components
import ReviewsColumn from "@components/blocks/Reviews/components/ReviewsColumn/ReviewsColumn.tsx";
import ReviewsSlider from "@components/blocks/Reviews/components/ReviewsSlider/ReviewsSlider.tsx";
import ReviewsDots from "@components/blocks/Reviews/components/ReviewsDots/ReviewsDots.tsx";
import ReviewsSkeleton from "@components/blocks/Reviews/components/ReviewsSkeleton/ReviewsSkeleton.tsx";
//api
import { useGetHomeQuery } from "@store/api/home/homeApi.ts";

const Reviews = () => {
    const { data, isLoading, isError } = useGetHomeQuery();

    const sliderRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const formatReviewDate = (date: string) => {
        if (!date) return "";

        const [day, month, year] = date.split(".");
        const parsedDate = new Date(Number(year), Number(month) - 1, Number(day));

        return parsedDate.toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const reviews = data?.reviews.map((item) => ({
        id: item.id,
        name: item.properties.REVIEW_NAME,
        text: item.properties.REVIEW_COMMENT,
        date: formatReviewDate(item.properties.REVIEW_DATE),
    })) ?? [];

    const getMaxScrollLeft = () => {
        const slider = sliderRef.current;

        if (!slider) return 0;

        return slider.scrollWidth - slider.clientWidth;
    };

    const getSlideLeft = (index: number) => {
        const maxScrollLeft = getMaxScrollLeft();

        if (reviews.length <= 1) return 0;

        return (maxScrollLeft / (reviews.length - 1)) * index;
    };

    const scrollToIndex = (index: number) => {
        const slider = sliderRef.current;

        if (!slider) return;

        slider.scrollTo({
            left: getSlideLeft(index),
            behavior: "smooth",
        });

        setActiveIndex(index);
    };

    const handleScroll = (direction: "prev" | "next") => {
        const nextIndex =
            direction === "next"
                ? Math.min(activeIndex + 1, reviews.length - 1)
                : Math.max(activeIndex - 1, 0);

        scrollToIndex(nextIndex);
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
                (slider.scrollLeft / maxScrollLeft) * (reviews.length - 1)
            );

            setActiveIndex(nextIndex);
        };

        slider.addEventListener("scroll", handleSliderScroll);

        return () => {
            slider.removeEventListener("scroll", handleSliderScroll);
        };
    }, [reviews.length]);

    if (isLoading) return <ReviewsSkeleton />;
    if (isError || !data) return null;

    return (
        <SectionLayout className={styles.reviews}>
            <ReviewsColumn
                onPrev={() => handleScroll("prev")}
                onNext={() => handleScroll("next")}
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