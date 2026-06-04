import styles from './SearchModal.module.scss'
import Image from "@UI/buttons/Image/Image.tsx";
import SearchImage from '@assets/header/search.svg'
import CategoryImage from '@assets/category/category.svg'
import type {RootState, AppDispatch} from "@store/store";
import {useDispatch, useSelector} from "react-redux";
import CardSlider from "@components/MainSliderCards/components/CardSlider/CardSlider.tsx";
import {products} from "@api/static/products.ts";
import {close} from '@store/slices/toggleSearchSlice'

const SearchModal = () => {

    const dispatch = useDispatch<AppDispatch>();

    const active = useSelector((state: RootState) => state.toggleSearch.active);

    return active && (
        <div className={styles.search}>
            <div className={styles.search__content}>
                <div className={styles.search__top}>
                    <div className={styles.search__header}>
                        <div className={styles.field}>
                            <Image src={SearchImage} alt={'search-icon'} className={styles.field__image}/>
                            <input type="search" className={styles.field__input} placeholder={'Поиск по каталогу'}/>
                        </div>
                        <div className={styles.search__buttons}>
                            <button className={styles.button__search}>
                                Найти
                            </button>
                            <button className={styles.button__close} onClick={() => dispatch(close())}>
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.search__bottom}>
                    <div className={styles.search__category}>
                        <article className={styles.search__category_item}>
                            Куртка
                        </article>
                        <article className={styles.search__category_item}>
                            Пальто
                        </article>
                        <article className={styles.search__category_item}>
                            Джинсы
                        </article>
                    </div>

                    <div className={styles.popular}>
                        <aside className={styles.aside}>
                            <div className={styles.aside__content}>
                                <h2 className={styles.aside__content_title}>Популярные запросы</h2>

                                <div className={styles.aside__list}>
                                    <span className={styles.aside__list_item}>куртка</span>
                                    <span className={styles.aside__list_item}>джинсы</span>
                                    <span className={styles.aside__list_item}>футболка</span>
                                </div>
                            </div>

                            <div className={styles.aside__content}>
                                <h2 className={styles.aside__content_title}>Категории</h2>

                                <div className={styles.aside__list}>
                                    <article className={styles.aside__list_category}>
                                        <Image src={CategoryImage} alt={'category-com'}/>
                                        Верхняя одежда
                                    </article>
                                    <article className={styles.aside__list_category}>
                                        <Image src={CategoryImage} alt={'category-com'}/>
                                        Распродажа
                                    </article>
                                    <article className={styles.aside__list_category}>
                                        <Image src={CategoryImage} alt={'category-com'}/>
                                        Распродажа
                                    </article>
                                </div>
                            </div>
                        </aside>

                        <div className={styles.grid}>
                            <h2 className={styles.aside__content_title}>Популярные товары</h2>

                            <div className={styles.grid__content}>
                                {products.map(card => <CardSlider
                                    key={card.id}
                                    image={card.image}
                                    title={card.title}
                                    sizes={card.sizes}
                                    price={card.price}/>
                                ).slice(0, 4)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.search__overlay} onClick={() => dispatch(close())}></div>
        </div>
    );
};

export default SearchModal;