import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

// styles
import styles from "./Breadcrumbs.module.scss";

// layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";

// types
import type {
  BreadcrumbItemInterface,
  BreadcrumbsInterface,
} from "@components/Breadcrumbs/types/types.ts";
import { BREADCRUMB_TITLES } from "./data";

const Breadcrumbs = ({ title, hideTitleOnMobile = false }: BreadcrumbsInterface) => {
  const { pathname } = useLocation();

  const parts = pathname.split("/").filter(Boolean);

  const crumbs: BreadcrumbItemInterface[] = parts
    .map((part, index) => {
      const path = `/${parts.slice(0, index + 1).join("/")}`;

      return {
        title:
          BREADCRUMB_TITLES[part] ?? (/^\d+$/.test(part) ? `№ ${part}` : part),
        path,
        hidden: part === "info",
      };
    })
    .filter((crumb) => !crumb.hidden);

  const currentPageTitle = title ?? crumbs.at(-1)?.title ?? "Главная";

  return (
    <SectionLayout>
      <MainLayoutContainer className={styles.navigation}>
        <nav className={styles.navigation__list} aria-label="Хлебные крошки">
          <Link to="/" className={styles.navigation__item}>
            Главная
          </Link>

          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <Fragment key={crumb.path}>
                <span
                  className={styles.navigation__separator}
                  aria-hidden="true"
                >
                  \
                </span>

                {isLast ? (
                  <span className={styles.navigation__item} aria-current="page">
                    {isLast && title ? title : crumb.title}
                  </span>
                ) : (
                  <Link to={crumb.path} className={styles.navigation__item}>
                    {crumb.title}
                  </Link>
                )}
              </Fragment>
            );
          })}
        </nav>

        <h1
          className={`${styles.navigation__title} ${
            hideTitleOnMobile ? styles.navigation__title_hiddenMobile : ""
          }`}
        >
          {title ?? currentPageTitle}
        </h1>
      </MainLayoutContainer>
    </SectionLayout>
  );
};

export default Breadcrumbs;
