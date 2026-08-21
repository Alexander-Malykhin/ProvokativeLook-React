import type { MouseEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styles from "./NavigationMobileMain.module.scss";
import arrowRightImage from "@assets/arrows/arrow-shevron-right.svg";
import Image from "@UI/media/Image/Image";
import type { NavigationMobileMainInterface } from "./types";
const NavigationMobileMain = ({ items, onOpenCatalog, onClose, }: NavigationMobileMainInterface) => {
    const navigate = useNavigate();
    const location = useLocation();
    const handleHashLink = (event: MouseEvent<HTMLAnchorElement>, link: string) => {
        const hashIndex = link.indexOf("#");
        if (hashIndex === -1) {
            onClose();
            return;
        }
        event.preventDefault();
        const pathname = link.slice(0, hashIndex) || location.pathname;
        const hash = link.slice(hashIndex);
        const id = decodeURIComponent(hash.slice(1));
        onClose();
        const scrollToAnchor = () => {
            document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        };
        if (location.pathname !== pathname) {
            navigate(`${pathname}${hash}`);
            window.setTimeout(scrollToAnchor, 80);
        }
        else {
            navigate(`${pathname}${hash}`, { replace: location.hash === hash });
            requestAnimationFrame(() => requestAnimationFrame(scrollToAnchor));
        }
    };
    return (<nav className={styles.main}>
      {items.map((item) => {
            if (item.code === "catalog") {
                return (<button key={item.id} type="button" className={styles.main__item} onClick={onOpenCatalog}>
              {item.title}
              <Image src={arrowRightImage} alt="arrow-icon" className={styles.main__item_image}/>
            </button>);
            }
            return (<NavLink key={item.id} to={item.link} className={`${styles.main__item} ${item.code === "sale" ? styles.main__item_sale : ""}`} onClick={(event) => handleHashLink(event, item.link)}>
            {item.title}
          </NavLink>);
        })}
    </nav>);
};
export default NavigationMobileMain;

