import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Breadcrumbs.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
import type { BreadcrumbItemInterface, BreadcrumbsInterface, } from "@components/Breadcrumbs/types/types.ts";
import { BREADCRUMB_TITLES } from "./data";
import { useGetNavigationQuery } from "@store/api/navigation/navigationApi.ts";
const normalizePath = (link: string) => {
    try {
        const path = new URL(link, "https://provokativelook.local").pathname;
        return path.replace(/\/+$/, "") || "/";
    }
    catch {
        return link.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
    }
};
const Breadcrumbs = ({ title, hideTitleOnMobile = false, hideTitle = false, items }: BreadcrumbsInterface) => {
    const { pathname } = useLocation();
    const { data: navigation = [] } = useGetNavigationQuery();
    const pathnameParts = pathname.split("/").filter(Boolean);
    const parts = pathnameParts[0] === "profile" ? pathnameParts.slice(0, 1) : pathnameParts;
    const navigationTitles = new Map(navigation.map((item) => [normalizePath(item.link), item.title]));
    const generatedCrumbs: BreadcrumbItemInterface[] = parts
        .map((part, index) => {
        const path = `/${parts.slice(0, index + 1).join("/")}/`;
        return {
            title: BREADCRUMB_TITLES[part] ?? (/^\d+$/.test(part) ? `№ ${part}` : part),
            path,
            hidden: part === "info",
        };
    })
        .filter((crumb) => !crumb.hidden);
    const crumbs = items ?? generatedCrumbs;
    const navigationPageTitle = navigationTitles.get(normalizePath(pathname));
    const currentPageTitle = navigationPageTitle ?? title ?? crumbs.at(-1)?.title ?? "Главная";
    return (<SectionLayout>
      <MainLayoutContainer className={styles.navigation}>
        <nav className={styles.navigation__list} aria-label="Хлебные крошки">
          <Link to="/" className={styles.navigation__item}>
            Главная
          </Link>

          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            const navigationTitle = items ? undefined : navigationTitles.get(normalizePath(crumb.path));
            const crumbTitle = navigationTitle ?? (isLast && title ? title : crumb.title);
            return (<Fragment key={crumb.path}>
                <span className={styles.navigation__separator} aria-hidden="true">
                  \
                </span>

                {isLast ? (<span className={styles.navigation__item} aria-current="page">
                    {crumbTitle}
                  </span>) : (<Link to={crumb.path} className={styles.navigation__item}>
                    {navigationTitle ?? crumb.title}
                  </Link>)}
              </Fragment>);
        })}
        </nav>

        <h1 className={`${styles.navigation__title} ${hideTitleOnMobile ? styles.navigation__title_hiddenMobile : ""} ${hideTitle ? styles.navigation__title_hidden : ""}`}>
          {currentPageTitle}
        </h1>
      </MainLayoutContainer>
    </SectionLayout>);
};
export default Breadcrumbs;
