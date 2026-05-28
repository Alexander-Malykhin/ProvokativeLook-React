import type { RefObject } from 'react';

import styles from './ReviewsList.module.scss';

interface Review {
    id: number;
    name: string;
    date: string;
    text: string;
}

interface ReviewsListProps {
    sliderRef: RefObject<HTMLDivElement | null>;
    reviews: Review[];
}

const ReviewsList = ({ sliderRef, reviews }: ReviewsListProps) => {
    return (
        <div ref={sliderRef} className={styles.list}>
            {reviews.map((item) => (
                <article key={item.id} className={styles.item}>
                    <div className={styles.item__head}>
                        <span className={styles.item__name}>{item.name}</span>
                        <span className={styles.item__date}>{item.date}</span>
                    </div>

                    <p className={styles.item__text}>{item.text}</p>
                </article>
            ))}
        </div>
    );
};

export default ReviewsList;