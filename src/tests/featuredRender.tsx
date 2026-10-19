import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { catalogApi } from '../store/api/catalog/catalogApi';
import Bestsellers from '../components/blocks/Bestsellers/Bestsellers';
import News from '../components/blocks/News/News';

export async function renderFeatured(emptyNews = false) {
  const store = configureStore({
    reducer: { [catalogApi.reducerPath]: catalogApi.reducer },
    middleware: (getDefault) => getDefault().concat(catalogApi.middleware),
  });
  try {
    if (emptyNews)
      await store.dispatch(
        catalogApi.util.upsertQueryData('getFeaturedProducts', 'new', {
          pages: [{ success: true, products: [], pagination: { limit: 10, hasMore: false, nextCursor: null } }],
          pageParams: [null],
        }),
      );
    const bestsellers = await store.dispatch(catalogApi.endpoints.getFeaturedProducts.initiate('bestsellers')).unwrap();
    const news = await store.dispatch(catalogApi.endpoints.getFeaturedProducts.initiate('new')).unwrap();
    return {
      bestsellers: bestsellers.pages[0],
      news: news.pages[0],
      html: renderToStaticMarkup(
        <Provider store={store}>
          <MemoryRouter>
            <Bestsellers />
            <News />
          </MemoryRouter>
        </Provider>,
      ),
    };
  } finally {
    store.dispatch(catalogApi.util.resetApiState());
  }
}

export async function loadFeaturedPages(type: 'new' | 'bestsellers') {
  const store = configureStore({
    reducer: { [catalogApi.reducerPath]: catalogApi.reducer },
    middleware: (getDefault) => getDefault().concat(catalogApi.middleware),
  });
  try {
    let data = await store.dispatch(catalogApi.endpoints.getFeaturedProducts.initiate(type)).unwrap();
    let requests = 1;
    while (data.pages.at(-1)?.pagination.hasMore) {
      if (++requests > 20) throw new Error('Pagination did not terminate');
      const next = store.dispatch(catalogApi.endpoints.getFeaturedProducts.initiate(type, { direction: 'forward' }));
      const duplicate = store.dispatch(
        catalogApi.endpoints.getFeaturedProducts.initiate(type, { direction: 'forward' }),
      );
      data = await next.unwrap();
      await duplicate.unwrap();
    }
    return data;
  } finally {
    store.dispatch(catalogApi.util.resetApiState());
  }
}

export async function recoverFeaturedPage() {
  const store = configureStore({
    reducer: { [catalogApi.reducerPath]: catalogApi.reducer },
    middleware: (getDefault) => getDefault().concat(catalogApi.middleware),
  });
  const nativeFetch = globalThis.fetch;
  let failNextPage = true;
  globalThis.fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : input.toString());
    if (failNextPage && url.searchParams.has('cursor')) {
      return new Response(JSON.stringify({ error: 'Temporary test failure' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return nativeFetch(input, init);
  };
  try {
    const first = await store.dispatch(catalogApi.endpoints.getFeaturedProducts.initiate('bestsellers')).unwrap();
    const failed = await store.dispatch(
      catalogApi.endpoints.getFeaturedProducts.initiate('bestsellers', { direction: 'forward' }),
    );
    const retained = catalogApi.endpoints.getFeaturedProducts.select('bestsellers')(store.getState()).data;
    failNextPage = false;
    const recovered = await store
      .dispatch(catalogApi.endpoints.getFeaturedProducts.initiate('bestsellers', { direction: 'forward' }))
      .unwrap();
    return { first, failed: !!failed.error, retained, recovered };
  } finally {
    globalThis.fetch = nativeFetch;
    store.dispatch(catalogApi.util.resetApiState());
  }
}
