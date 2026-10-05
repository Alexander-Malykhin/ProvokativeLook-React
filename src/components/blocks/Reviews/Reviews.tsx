import { useState } from "react";
import styles from "./Reviews.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import { useGetReviewsQuery, useLazyGetReviewStatusQuery } from "@store/api/reviews/reviewsApi";
import { useAppDispatch } from "@store/hooks";
import { openAuthModal } from "@store/slices/toggleAuthModalSlice";
import { useCarousel } from "@hooks/useCarousel";
import CarouselHeader from "@components/Carousel/CarouselHeader";
import CarouselDots from "@components/Carousel/CarouselDots";
import ReviewsSkeleton from "./components/ReviewsSkeleton/ReviewsSkeleton";
import ReviewsSlider from "./components/ReviewsSlider/ReviewsSlider";
import ReviewsItem from "./components/ReviewsItem/ReviewsItem";
import ReviewModal from "./components/ReviewModal/ReviewModal";
import { formatForumReviewDate } from "./lib/formatForumReviewDate";
const Reviews = ({ productId }: { productId?: number }) => {
    const dispatch = useAppDispatch();
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [eligibilityMessage, setEligibilityMessage] = useState("");
    const [checkReviewStatus, { isFetching: isChecking }] = useLazyGetReviewStatusQuery();
    const { currentData: data, isLoading, isFetching, isError, refetch } = useGetReviewsQuery(productId, { refetchOnMountOrArgChange: true, refetchOnFocus: true, refetchOnReconnect: true });
    const reviews = (data?.items ?? [])
        .filter((item) => item.approved && (!productId || item.productId === productId))
        .map((item) => ({ id: item.id, name: item.author, text: item.text,
            date: formatForumReviewDate(item.date), photos: item.photos ?? [] }));
    const carousel = useCarousel({ itemCount: reviews.length, mode: "progress" });
    const addReview = async () => {
        if (!productId || isChecking) return;
        setEligibilityMessage("");
        try {
            const status = await checkReviewStatus(productId, false).unwrap();
            if (!status.currentUserId) {
                dispatch(openAuthModal("login"));
            } else if (status.productId === productId && status.canCreate) {
                setIsReviewModalOpen(true);
            } else {
                setEligibilityMessage("Отзыв можно оставить после оплаты и доставки этого товара. Подходящий заказ в вашем аккаунте пока не найден.");
            }
        } catch {
            setEligibilityMessage("Не удалось проверить покупку. Попробуйте ещё раз.");
        }
    };
    if (isLoading) return productId ? <SectionLayout className={`${styles.reviews} ${styles.reviews_product}`}><h2 className={styles.reviews__title}>Отзывы о товаре</h2><p role="status">Загрузка отзывов…</p></SectionLayout> : <ReviewsSkeleton />;
    if (!productId && !reviews.length && !isError) return null;
    return <>
        <SectionLayout className={`${styles.reviews} ${productId ? styles.reviews_product : ""}`}>
            <div className={styles.reviews__column}>
                {productId ? <h2 className={styles.reviews__title}>Отзывы о товаре</h2> : <CarouselHeader title="Отзывы" onPrevious={carousel.showPrevious} onNext={carousel.showNext}/>}
                {productId && <>
                    <p className={styles.reviews__hint}>Отзыв можно оставить после доставки товара.</p>
                    <button type="button" className={styles.reviews__create} disabled={isChecking} onClick={() => void addReview()}>{isChecking ? "Проверяем покупку…" : "Добавить отзыв"}</button>
                    {eligibilityMessage && <p className={styles.reviews__hint} role="alert">{eligibilityMessage}</p>}
                </>}
            </div>
            {isError && <p role="status">Не удалось {data ? "обновить" : "загрузить"} отзывы. <button type="button" disabled={isFetching} onClick={() => void refetch()}>{isFetching ? "Загрузка…" : "Повторить"}</button></p>}
            {reviews.length ? productId ? <div className={styles.reviews__thread} role="list" aria-label="Отзывы покупателей о товаре">
                {reviews.map((review) => <div key={review.id} role="listitem"><ReviewsItem {...review}/></div>)}
            </div> : <div className={styles.reviews__content}>
                <ReviewsSlider sliderRef={carousel.sliderRef} reviews={reviews}/>
                <div className={styles.reviews__dots}><CarouselDots count={reviews.length} activeIndex={carousel.activeIndex} onChange={carousel.scrollToIndex} itemLabel="отзыву"/></div>
            </div> : !isError && <p>У этого товара пока нет отзывов.</p>}
        </SectionLayout>
        {productId && isReviewModalOpen && <ReviewModal productId={productId} open onClose={() => setIsReviewModalOpen(false)}/>}
    </>;
};
export default Reviews;
