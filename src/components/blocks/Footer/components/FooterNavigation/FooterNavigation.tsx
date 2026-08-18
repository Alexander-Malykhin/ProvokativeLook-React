import { Link } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";
import { openTableSizes } from "@store/slices/toggleModalTableSizesSlice";
//types
import type { FooterNavigationProps } from "./types";
//styles
import styles from "./FooterNavigation.module.scss";

const normalizeTitle = (value: string) =>
  value
    .replace(/^-/, "")
    .trim()
    .toLocaleLowerCase("ru-RU");

const resolveFooterLink = (title: string, link: string) => {
  const normalized = normalizeTitle(title);

  const knownRoutes: Record<string, string> = {
    "о нас": "/about",
    "контакты": "/contacts",
    "доставка": "/info/delivery-payment",
    "доставка и оплата": "/info/delivery-payment",
    "возврат": "/info/return-policy",
    "условия возврата": "/info/return-policy",
    "публичная оферта": "/public-offer",
    "оферта": "/public-offer",
    "пользовательское соглашение": "/terms-of-use",
    "политика конфиденциальности": "/privacy-policy",
    "конфиденциальность": "/privacy-policy",
    "согласие на обработку персональных данных": "/personal-data-consent",
  };

  const cleanLink = link.replace(/^-/, "").trim();

  // Если в инфоблоке задан настоящий путь, используем именно его.
  if (cleanLink) {
    if (/^https?:\/\//i.test(cleanLink)) return cleanLink;
    return cleanLink.startsWith("/") ? cleanLink : `/${cleanLink}`;
  }

  // Для старых записей вида #link#- восстанавливаем известный маршрут по названию.
  return knownRoutes[normalized] ?? "/";
};

const FooterNavigation = ({
  items,
  opened,
  onToggle,
}: FooterNavigationProps) => {
  const dispatch = useAppDispatch();

  return (
    <nav className={styles.nav}>
      {items.map((item) => {
        const title = item.navigationTitle;
        const isOpen = opened === title;
        // Показываем все ссылки, которые пришли из инфоблока.
        // Никаких скрытых списков/white-list на фронте больше нет.
        const navigationList = item.navigationList;

        return (
          <div
            key={item.id}
            className={`${styles.nav__item} ${isOpen ? styles.nav__item_open : ""}`}
          >
            <button
              type="button"
              className={styles.nav__item_head}
              onClick={() => onToggle(isOpen ? null : title)}
            >
              <span className={styles.nav__item_title}>{title}</span>
              <span className={styles.nav__item_arrow} />
            </button>

            <div className={styles.nav__item_list}>
              {navigationList.map((link) => {
                const normalizedLinkTitle = normalizeTitle(link.title);

                if (normalizedLinkTitle === "таблица размеров") {
                  return (
                    <button
                      key={link.title}
                      type="button"
                      className={`${styles.nav__item_link} ${styles.nav__item_link_button}`}
                      onClick={() => dispatch(openTableSizes())}
                    >
                      {link.title.replace(/^-/, "")}
                    </button>
                  );
                }

                const resolvedLink = resolveFooterLink(link.title, link.link);

                if (/^https?:\/\//i.test(resolvedLink)) {
                  return (
                    <a
                      key={link.title}
                      href={resolvedLink}
                      className={styles.nav__item_link}
                    >
                      {link.title.replace(/^-/, "")}
                    </a>
                  );
                }

                return (
                  <Link
                    key={link.title}
                    to={resolvedLink}
                    className={styles.nav__item_link}
                  >
                    {link.title.replace(/^-/, "")}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
};

export default FooterNavigation;
