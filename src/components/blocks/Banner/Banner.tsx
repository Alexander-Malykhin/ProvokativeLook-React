import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Banner.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import BannerCategory from "./components/BannerCategory/BannerCategory";
import BannerSkeleton from "./components/BannerSkeleton/BannerSkeleton";
import { useGetBannersQuery, useGetMainBannersQuery } from "@store/api/banners/bannersApi";
import type { MainBannerItem } from "@store/api/banners/types";
import { IMAGE_BASE_URL } from "@/config/env";
import { useDragScroll } from "@/hooks/useDragScroll";

const imageUrl = (src: string) => src.startsWith('/upload/') ? `${IMAGE_BASE_URL}${src}` : src;
const safeLink = (link: string) => /^(\/(?!\/)|#|https?:\/\/)/i.test(link) ? link : '/catalog/';

const MainBannerSlider = ({ items }: { items: MainBannerItem[] }) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);
    const [failed, setFailed] = useState<string[]>([]);
    const visible = items.filter(item => !failed.includes(`${item.id}:${item.image}:${item.mobileImage}`));
    useDragScroll(trackRef, visible.length);
    const goTo = (index: number) => {
        const track = trackRef.current;
        if (!track) return;
        track.scrollTo({ left: index * track.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    };
    if (!visible.length) return null;
    return <div className={styles.hero} role="region" aria-label="Главные баннеры" aria-roledescription={visible.length > 1 ? 'карусель' : undefined}>
        <div ref={trackRef} className={styles.track} onScroll={event => {
            const track = event.currentTarget;
            setActive(Math.round(track.scrollLeft / (track.clientWidth || 1)));
        }} onKeyDown={event => {
            if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
            event.preventDefault();
            const next = Math.max(0, Math.min(visible.length - 1, active + (event.key === 'ArrowRight' ? 1 : -1)));
            goTo(next);
            trackRef.current?.querySelectorAll<HTMLAnchorElement>('a')[next]?.focus({ preventScroll: true });
        }}>
            {visible.map((item, index) => <div key={item.id} className={styles.slide}
                role="group" aria-label={`${index + 1} из ${visible.length}: ${item.name}`}
                style={{ color: /^#(?:[a-f\d]{3}|[a-f\d]{6})$/i.test(item.textColor) ? item.textColor : '#222222' }} draggable={false}>
                <picture className={styles.picture}>
                    {item.mobileImage && <source media="(max-width: 768px)" srcSet={imageUrl(item.mobileImage)} />}
                    <img src={imageUrl(item.image)} alt="" draggable={false} loading={index === 0 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : 'auto'} onError={() => setFailed(previous => [...previous, `${item.id}:${item.image}:${item.mobileImage}`])} />
                </picture>
                <div className={styles.information}>
                    {item.title && <p className={styles.title}>{item.title}</p>}
                    {item.subtitle && <p className={`${styles.title} ${styles.subtitle}`}>{item.subtitle}</p>}
                    <Link to={safeLink(item.link)} className={styles.label}
                        tabIndex={index === Math.min(active, visible.length - 1) ? 0 : -1} draggable={false}>
                        {item.label || 'Новая коллекция'}
                    </Link>
                </div>
            </div>)}
        </div>
        {visible.length > 1 && <div className={styles.dots} aria-label="Выбор баннера">
            {visible.map((item, index) => <button key={item.id} type="button" className={styles.dot}
                aria-label={`Баннер ${index + 1}`} aria-pressed={index === Math.min(active, visible.length - 1)} onClick={() => goTo(index)} />)}
        </div>}
    </div>;
};

const Banner = () => {
    const { data, isLoading, isError, refetch } = useGetMainBannersQuery();
    const { data: categoriesData } = useGetBannersQuery('miniBanners');
    if (isLoading) return <BannerSkeleton />;
    const items = [...(data?.items ?? [])].filter(item => item.image?.trim()).sort((a, b) => a.sort - b.sort);
    const categories = [...(categoriesData?.items ?? [])].sort((a, b) => a.sort - b.sort);
    if (!items.length && !categories.length && !isError) return null;
    return <SectionLayout className={styles.banner}>
        {items.length > 0 && <MainBannerSlider key={items.map(item => item.id).join(',')} items={items} />}
        {isError && !items.length && <div className={styles.error} role="status">
            Не удалось загрузить баннер. <button type="button" onClick={() => refetch()}>Повторить</button>
        </div>}
        <BannerCategory items={categories} />
    </SectionLayout>;
};
export default Banner;
