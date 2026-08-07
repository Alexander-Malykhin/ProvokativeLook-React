import { Link } from "react-router-dom";

import styles from "./Logo.module.scss";

import Image from "@UI/media/Image/Image";

import type { LogoInterface } from "./types";

const Logo = ({ logo }: LogoInterface) => {
  return (
    <Link to={logo?.link || "/"} className={styles.logo}>
      {logo?.image && (
        <Image
          src={logo.image}
          alt={logo.title || "logo"}
          loading="eager"
          fetchPriority="high"
          className={styles.logo__image}
        />
      )}
    </Link>
  );
};

export default Logo;
