import styles from "./Reviews.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import { useGetHomeQuery } from "@store/api/home/homeApi";
import { useCarousel } from "@hooks/useCarousel";
import CarouselHeader from "@components/Carousel/CarouselHeader";
import CarouselDots from "@components/Carousel/CarouselDots";
import ReviewsSkeleton from "./components/ReviewsSkeleton/ReviewsSkeleton";
import ReviewsSlider from "./components/ReviewsSlider/ReviewsSlider";
import { formatReviewDate } from "./lib/formatReviewDate";

const Reviews = () => {
  const { data, isLoading, isError } = useGetHomeQuery();
  const reviews =
    data?.reviews.map((item) => ({
      id: item.id,
      name: item.properties.REVIEW_NAME,
      text: item.properties.REVIEW_COMMENT,
      date: formatReviewDate(item.properties.REVIEW_DATE),
    })) ?? [];
  const carousel = useCarousel({
    itemCount: reviews.length,
    mode: "progress",
  });

  if (isLoading) {
    return <ReviewsSkeleton />;
  }

  if (isError || !data) {
    return null;
  }

  return (
    <SectionLayout className={styles.reviews}>
      <CarouselHeader
        title="Отзывы"
        onPrevious={carousel.showPrevious}
        onNext={carousel.showNext}
      />
      <ReviewsSlider sliderRef={carousel.sliderRef} reviews={reviews} />
      <CarouselDots
        count={reviews.length}
        activeIndex={carousel.activeIndex}
        onChange={carousel.scrollToIndex}
        itemLabel="отзыву"
      />
    </SectionLayout>
  );
};

export default Reviews;
