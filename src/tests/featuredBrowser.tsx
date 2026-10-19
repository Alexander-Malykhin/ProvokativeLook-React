import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { catalogApi } from '../store/api/catalog/catalogApi';
import Bestsellers from '../components/blocks/Bestsellers/Bestsellers';
import News from '../components/blocks/News/News';
import '../scss/main.scss';
import { useCarousel } from '../hooks/useCarousel';

const store = configureStore({
  reducer: { [catalogApi.reducerPath]: catalogApi.reducer },
  middleware: (getDefault) => getDefault().concat(catalogApi.middleware),
});
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
async function until(check: () => boolean) {
  for (let i = 0; i < 100; i++) {
    if (check()) return;
    await wait(20);
  }
  throw new Error('Scroll did not reach its target within 2 seconds');
}
export function StressControls() {
  const [result, setResult] = useState('Проверка не запущена');
  const run = async () => {
    setResult('Проверяем 500 товаров в каждой карусели…');
    try {
      for (const type of ['bestsellers', 'new'] as const) {
        const source = await store.dispatch(catalogApi.endpoints.getFeaturedProducts.initiate(type)).unwrap();
        const sourceProducts = source.pages[0].products;
        const products = Array.from({ length: 500 }, (_, i) => ({
          ...sourceProducts[i % sourceProducts.length],
          id: 10000 + i,
          name: `Товар ${i + 1}`,
          slug: `tovar-${i + 1}`,
        }));
        await store.dispatch(
          catalogApi.util.upsertQueryData('getFeaturedProducts', type, {
            pages: [{ success: true, products, pagination: { limit: 10, hasMore: false, nextCursor: null } }],
            pageParams: [null],
          }),
        );
      }
      await wait(100);
      const results = [];
      for (const name of ['bestsellers', 'news']) {
        const section = document.querySelector(`[data-testid="${name}"]`)!;
        const slot = section.querySelector<HTMLElement>('[data-carousel-index]')!;
        const slider = slot.parentElement!;
        const step = slot.offsetWidth + parseFloat(getComputedStyle(slider).columnGap);
        const next = section.querySelector<HTMLButtonElement>('[aria-label="Следующий слайд"]')!;
        const prev = section.querySelector<HTMLButtonElement>('[aria-label="Предыдущий слайд"]')!;
        slider.scrollTo({ left: 0, behavior: 'instant' });
        await wait(50);
        for (let i = 0; i < 5; i++) {
          next.click();
          await wait(15);
        }
        await until(() => Math.abs(slider.scrollLeft - step * 5) < 2);
        const mounted = slider.querySelectorAll('article').length;
        if (mounted > 20) throw new Error(`Too many mounted cards: ${mounted}`);
        const last = section.querySelector<HTMLButtonElement>('[aria-label="Перейти к слайду 500"]')!;
        const started = performance.now();
        last.click();
        await until(() => Math.abs(slider.scrollLeft - (slider.scrollWidth - slider.clientWidth)) < 2);
        await until(() => !!slider.lastElementChild?.querySelector('article'));
        const jumpMs = Math.round(performance.now() - started);
        if (jumpMs > 500) throw new Error(`Distant jump too slow: ${jumpMs}`);
        const end = slider.scrollLeft;
        prev.click();
        await until(() => slider.scrollLeft < end - step / 2);
        results.push(
          `${name}: 500 товаров, ${mounted} карточек в DOM; 5 быстрых нажатий — OK; переход в конец ${jumpMs} мс; назад — OK`,
        );
      }
      const probe = document.querySelector('[data-testid="progress-probe"]')!;
      const progressSlider = probe.querySelector<HTMLElement>('[data-track]')!;
      progressSlider.scrollTo({ left: 0, behavior: 'instant' });
      await wait(50);
      const nextProgress = probe.querySelector<HTMLButtonElement>('[data-next]')!;
      nextProgress.click();
      nextProgress.click();
      await until(
        () =>
          Math.abs(progressSlider.scrollLeft - ((progressSlider.scrollWidth - progressSlider.clientWidth) * 2) / 3) < 2,
      );
      results.push('Общий режим progress (отзывы и баннеры): 2 быстрых нажатия — OK');
      setResult('PASS\n' + results.join('\n'));
    } catch (error) {
      setResult('FAIL: ' + String(error));
    }
  };
  return (
    <div style={{ padding: 20 }}>
      <button type="button" onClick={run}>
        Проверить прокрутку 500 товаров
      </button>
      <pre data-testid="stress-result" style={{ whiteSpace: 'pre-wrap' }}>
        {result}
      </pre>
    </div>
  );
}
export function PaginationControls() {
  const [result, setResult] = useState('Проверка подгрузки не запущена');
  const run = async () => {
    setResult('Проверяем первую порцию и автоматическую подгрузку…');
    try {
      store.dispatch(catalogApi.util.resetApiState());
      const reports = [];
      for (const name of ['bestsellers', 'news']) {
        const section = document.querySelector(`[data-testid="${name}"]`)!;
        await until(() => section.querySelectorAll('[data-carousel-index]').length === 10);
        await wait(250);
        if (section.querySelectorAll('[data-carousel-index]').length !== 10)
          throw new Error('Loaded more than the first page without scrolling');
        const firstLink = section.querySelector('article a')?.getAttribute('href');
        const slider = section.querySelector('[data-carousel-index]')!.parentElement!;
        slider.scrollTo({ left: slider.scrollWidth - slider.clientWidth, behavior: 'instant' });
        await until(() => section.querySelectorAll('[data-carousel-index]').length === 20);
        if (slider.scrollLeft <= 0) throw new Error('Appending a page reset scroll position');
        slider.scrollTo({ left: 0, behavior: 'instant' });
        await until(() => !!section.querySelector('[data-carousel-index="0"] article'));
        if (section.querySelector('article a')?.getAttribute('href') !== firstLink)
          throw new Error('Previous page was replaced');
        reports.push(`${name}: сначала 10, после прокрутки 20; позиция сохранена`);
      }
      setResult('PASS\n' + reports.join('\n'));
    } catch (error) {
      setResult('FAIL: ' + String(error));
    }
  };
  return (
    <div style={{ padding: 20 }}>
      <button type="button" onClick={run}>
        Проверить подгрузку по 10
      </button>
      <pre data-testid="pagination-result" style={{ whiteSpace: 'pre-wrap' }}>
        {result}
      </pre>
    </div>
  );
}
export function ProgressProbe() {
  const { sliderRef, showNext } = useCarousel({ itemCount: 4, mode: 'progress' });
  return (
    <div data-testid="progress-probe" style={{ padding: 20 }}>
      <p>Проверка общего механизма прокрутки</p>
      <button type="button" data-next onClick={showNext}>
        Далее в проверке
      </button>
      <div
        data-track
        ref={sliderRef}
        style={{
          display: 'grid',
          gridAutoFlow: 'column',
          gridAutoColumns: 320,
          gap: 24,
          overflowX: 'auto',
          maxWidth: 700,
        }}
      >
        {[1, 2, 3, 4].map((index) => (
          <div key={index} style={{ height: 30 }}>
            Проверка {index}
          </div>
        ))}
      </div>
    </div>
  );
}
const root = createRoot(document.getElementById('root')!);
if (import.meta.hot)
  import.meta.hot.dispose(() => {
    root.unmount();
    store.dispatch(catalogApi.util.resetApiState());
  });
root.render(
  <Provider store={store}>
    <MemoryRouter>
      <p style={{ padding: 20 }}>Изолированная проверка каруселей. Тестовые данные, рабочая CRM не изменяется.</p>
      <StressControls />
      <PaginationControls />
      <div data-testid="bestsellers">
        <Bestsellers />
      </div>
      <div data-testid="news">
        <News />
      </div>
      <ProgressProbe />
    </MemoryRouter>
  </Provider>,
);
