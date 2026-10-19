import type { MouseEvent } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import styles from './NavigationItem.module.scss';
import type { NavigationItemProps } from '@components/Navigation/types/types.ts';
const NavigationItem = ({ item }: NavigationItemProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    const hashIndex = item.link.indexOf('#');
    if (hashIndex === -1) return;
    event.preventDefault();
    const pathname = item.link.slice(0, hashIndex) || location.pathname;
    const hash = item.link.slice(hashIndex);
    const scrollToAnchor = () => {
      const id = decodeURIComponent(hash.slice(1));
      const target = document.getElementById(id);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    if (location.pathname !== pathname) {
      navigate(`${pathname}${hash}`);
      window.setTimeout(scrollToAnchor, 80);
      return;
    }
    navigate(`${pathname}${hash}`, { replace: location.hash === hash });
    requestAnimationFrame(() => requestAnimationFrame(scrollToAnchor));
  };
  return (
    <NavLink
      key={item.id}
      to={item.link}
      onClick={handleClick}
      className={`${styles.item} ${item.code === 'sale' ? styles.item__sale : ''}`}
    >
      {item.title}
    </NavLink>
  );
};
export default NavigationItem;
