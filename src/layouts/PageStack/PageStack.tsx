import type { HTMLAttributes } from "react";

import styles from "./PageStack.module.scss";

const PageStack = ({
  className = "",
  children,
  ...mainProps
}: HTMLAttributes<HTMLElement>) => (
  <main {...mainProps} className={`${styles.page} ${className}`.trim()}>
    {children}
  </main>
);

export default PageStack;
