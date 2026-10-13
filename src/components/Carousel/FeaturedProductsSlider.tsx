import { memo, useEffect, useState, type RefObject } from 'react';
import ProductCard from '@components/ProductCard/ProductCard';
import { useDragScroll } from '@hooks/useDragScroll';
import { carouselWindow } from '@/helpers/carouselWindow';
import type { ProductListItem } from '@/types/product';

interface Props {
    sliderRef: RefObject<HTMLDivElement | null>;
    products: ProductListItem[];
    className: string;
}

const ProductSlot = memo(({ product, index, visible }: { product: ProductListItem; index: number; visible: boolean }) => (
    // Empty slots preserve the complete track and its native scroll-snap positions.
    <div data-carousel-index={index} aria-hidden={!visible || undefined}>
        {visible && <ProductCard {...product} showPurchase={false} showSizes={false}/>}
    </div>
));

const FeaturedProductsSlider = memo(({ sliderRef, products, className }: Props) => {
    const [range, setRange] = useState({ start: 0, end: 12 });
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    useDragScroll(sliderRef, products.length, true);

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;
        let step = 0;
        let viewport = 0;
        const update = () => {
            const next = carouselWindow(products.length, slider.scrollLeft, viewport, step);
            setRange(current => current.start === next.start && current.end === next.end ? current : next);
        };
        const measure = () => {
            step = (slider.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0;
            step += Number.parseFloat(getComputedStyle(slider).columnGap) || 0;
            viewport = slider.clientWidth;
            update();
        };
        const observer = new ResizeObserver(measure);
        observer.observe(slider);
        slider.addEventListener('scroll', update, { passive: true });
        measure();
        return () => {
            observer.disconnect();
            slider.removeEventListener('scroll', update);
        };
    }, [products.length, sliderRef]);

    return <div ref={sliderRef} className={className}
        onFocusCapture={event => {
            const slot = (event.target as HTMLElement).closest<HTMLElement>('[data-carousel-index]');
            if (slot) setFocusedIndex(Number(slot.dataset.carouselIndex));
        }}
        onBlurCapture={event => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusedIndex(null);
        }}>
        {products.map((product, index) => <ProductSlot key={product.id} product={product} index={index}
            visible={(index >= range.start && index < range.end) || index === focusedIndex}/>)}
    </div>;
});

export default FeaturedProductsSlider;
