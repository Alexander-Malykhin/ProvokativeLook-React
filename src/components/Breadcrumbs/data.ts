export const CATALOG_CATEGORIES = [
  { slug: "costumes", title: "Комбинезоны и костюмы" },
  { slug: "outerwear", title: "Верхняя одежда" },
  { slug: "dresses", title: "Платья и сарафаны" },
  { slug: "shoes", title: "Обувь" },
  { slug: "shirts", title: "Блузы и рубашки" },
  { slug: "shorts", title: "Брюки и шорты" },
  { slug: "sets", title: "Комплекты" },
  { slug: "tops", title: "Топы и футболки" },
  { slug: "skirts", title: "Юбки" },
  { slug: "sweaters", title: "Свитеры и кардиганы" },
  { slug: "hoodie", title: "Толстовки и худи" },
  { slug: "jeans", title: "Джинсы" },
  { slug: "jackets", title: "Жакеты" },
  { slug: "accessories", title: "Аксессуары" },
];

export const CATALOG_TAGS = [
  { slug: "hity-prodazh", title: "Хиты продаж" },
  { slug: "rasprodazha", title: "Распродажа" },
];

export const INFO_PAGES = [
  { url: "delivery-payment", title: "Доставка и оплата" },
  { url: "loyalty-program", title: "Программа лояльности" },
  { url: "return-policy", title: "Условия возврата" },
  { url: "gift-certificates", title: "Подарочные сертификаты" },
];

const BASE_TITLES: Record<string, string> = {
  about: "О нас",
  catalog: "Каталог",
  contacts: "Контакты",
  basket: "Корзина",
  order: "Оформление заказа",
  favorites: "Избранное",
  product: "Товар",
  profile: "Личный кабинет",
  data: "Мои данные",
  orders: "Мои заказы",
  addresses: "Мои адреса",
  return: "Возврат",
  notifications: "Уведомления",
};

export const BREADCRUMB_TITLES: Record<string, string> = {
  ...BASE_TITLES,
  ...Object.fromEntries(
    [...CATALOG_CATEGORIES, ...CATALOG_TAGS].map(({ slug, title }) => [
      slug,
      title,
    ]),
  ),
  ...Object.fromEntries(INFO_PAGES.map(({ url, title }) => [url, title])),
};
