export function carouselDotIndexes(count: number, activeIndex: number, maxVisible?: number): number[] {
    if (count <= 1) return [];
    const limit = Math.max(3, maxVisible ?? count);
    if (count <= limit) return Array.from({ length: count }, (_, index) => index);
    const middleCount = limit - 2;
    const active = Math.max(0, Math.min(count - 1, activeIndex));
    const start = Math.max(1, Math.min(count - middleCount - 1, active - Math.floor(middleCount / 2)));
    return [0, ...Array.from({ length: middleCount }, (_, index) => start + index), count - 1];
}
