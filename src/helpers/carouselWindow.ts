export function carouselWindow(count: number, scrollLeft: number, viewport: number, step: number) {
  if (count === 0) return { start: 0, end: 0 };
  if (step <= 0) return { start: 0, end: Math.min(count, 12) };
  const first = Math.max(0, Math.min(count - 1, Math.floor(scrollLeft / step)));

  const start = Math.max(0, Math.floor(first / 4) * 4 - 4);
  const end = Math.min(count, start + Math.ceil(viewport / step) + 12);
  return { start, end };
}
