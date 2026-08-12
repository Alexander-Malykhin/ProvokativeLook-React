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

const hiddenFooterLinks = new Set([
  "распродажа",
  "публичная оферта",
  "пользовательское соглашение",
  "политика конфиденциальности",
  "оферта",
  "конфиденциальность",
]);

const buyerAllowedLinks = new Set([
  "доставка",
  "доставка и оплата",
  "возврат",
  "условия возврата",
  "таблица размеров",
]);

const resolveFooterLink = (title: string, link: string) => {
  const normalized = normalizeTitle(title);

  if (normalized === "возврат" || normalized === "условия возврата") {
    return "/info/return-policy";
  }

  if (normalized === "доставка" || normalized === "доставка и оплата") {
    return "/info/delivery-payment";
  }

  const cleanLink = link.replace(/^-/, "").trim();
  if (!cleanLink) return "/";

  return cleanLink.startsWith("/") ? cleanLink : `/${cleanLink}`;
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
        const sectionTitle = normalizeTitle(title);
        const isBuyerSection = sectionTitle.startsWith("покупател");

        const navigationList = item.navigationList.filter((link) => {
          const linkTitle = normalizeTitle(link.title);

          if (hiddenFooterLinks.has(linkTitle)) return false;
          if (isBuyerSection) return buyerAllowedLinks.has(linkTitle);

          return true;
        });

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

                return (
                  <Link
                    key={link.title}
                    to={resolveFooterLink(link.title, link.link)}
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
