import { useState } from "react";
import styles from "./Reviews.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import { useGetReviewsQuery } from "@store/api/reviews/reviewsApi";
import { useGetUserQuery } from "@store/api/user/userApi";
import { useAppDispatch } from "@store/hooks";
import { openAuthModal } from "@store/slices/toggleAuthModalSlice";
import { useCarousel } from "@hooks/useCarousel";
import CarouselHeader from "@components/Carousel/CarouselHeader";
import CarouselDots from "@components/Carousel/CarouselDots";
import ReviewsSkeleton from "./components/ReviewsSkeleton/ReviewsSkeleton";
import ReviewsSlider from "./components/ReviewsSlider/ReviewsSlider";
import ReviewModal from "./components/ReviewModal/ReviewModal";
import { formatForumReviewDate } from "./lib/formatForumReviewDate";
const Reviews = () => {
    const dispatch = useAppDispatch();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const { data: reviewsData, isLoading: isReviewsLoading, isError: isReviewsError, } = useGetReviewsQuery();
    const { data: userData } = useGetUserQuery();
    const reviews = (reviewsData?.items ?? [])
        .filter((item) => item.approved)
        .map((item) => ({
        id: item.id,
        name: item.author,
        text: item.text,
        date: formatForumReviewDate(item.date),
    }));
    const carousel = useCarousel({
        itemCount: reviews.length,
        mode: "progress",
    });
    const authenticated = Boolean(userData?.success && userData.user);
    const handleCreateReview = () => {
        if (!authenticated) {
            dispatch(openAuthModal("login"));
            return;
        }
        setIsReviewModalOpen(true);
    };
    if (isReviewsLoading) {
        return <ReviewsSkeleton />;
    }
    if (isReviewsError) {
        return null;
    }
    return (<>
      <SectionLayout className={styles.reviews}>
        <div className={styles.reviews__column}>
          <CarouselHeader title="Отзывы" onPrevious={carousel.showPrevious} onNext={carousel.showNext}/>
          <button type="button" className={styles.reviews__create} onClick={handleCreateReview}>
            Оставить отзыв
          </button>
        </div>
        {reviews.length > 0 && (<div className={styles.reviews__content}>
            <ReviewsSlider sliderRef={carousel.sliderRef} reviews={reviews}/>
            <CarouselDots count={reviews.length} activeIndex={carousel.activeIndex} onChange={carousel.scrollToIndex} itemLabel="отзыву"/>
          </div>)}
      </SectionLayout>
      <ReviewModal open={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)}/>
    </>);
};
export default Reviews;

