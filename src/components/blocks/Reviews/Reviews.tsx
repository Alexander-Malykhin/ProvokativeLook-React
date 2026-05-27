import styles from './Reviews.module.scss';
// hooks
import { useHorizontalSlider } from '@/hooks/useHorizontalSlider';
// layouts
import SectionLayout from '@layouts/SectionLayout/SectionLayout.tsx';
// helpers
import { convertAliasTitle } from '@helpers/convertAliasTitle.tsx';
// components
import ActionColumn from '@components/MainSliderCards/components/ActionColumn/ActionColumn.tsx';

interface ReviewsInterface {
    title: string;
}

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
        name: 'Марина',
        date: '10 февраля 2025',
        text: 'Очень понравился сервис и быстрая доставка. Вещи пришли аккуратно упакованные, размер подошёл идеально.',
    },
    {
        id: 4,
        name: 'Александра',
        date: '26 февраля 2025',
        text: 'Этот магазин женской одежды – просто находка! Ассортимент невероятно разнообразен и стильный. На любой вкус и случай можно найти что-то особенное. Я уже несколько раз совершала покупки в этом магазине, и каждый раз остаюсь в восторге! Вещи отлично сидят, долго носятся и вызывают положительные эмоции.',
    },
    {
        id: 5,
        name: 'Елена',
        date: '15 февраля 2025',
        text: 'Восхитительный магазин! Нашла идеальное платье быстро и легко. Качество превосходное, ткань приятная к телу, швы ровные. Размер подошел идеально по описанию на сайте. Доставка быстрая, курьер вежливый. Упаковка аккуратная, платье пришло не мятым. Обслуживание на высоте!',
    },
];

const Reviews = ({ title }: ReviewsInterface) => {
    const { sliderRef, scrollSlider } = useHorizontalSlider(668);

    return (
        <SectionLayout>
            <div className={styles.reviews}>
                <ActionColumn
                    title={convertAliasTitle(title)}
                    scrollSlider={scrollSlider}
                />

                <div ref={sliderRef} className={styles.reviews__list}>
                    {reviews.map((item) => (
                        <article key={item.id} className={styles.reviews__item}>
                            <div className={styles.reviews__item_head}>
                                <span className={styles.reviews__item_name}>
                                    {item.name}
                                </span>

                                <span className={styles.reviews__item_date}>
                                    {item.date}
                                </span>
                            </div>

                            <p className={styles.reviews__item_text}>
                                {item.text}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </SectionLayout>
    );
};

export default Reviews;