import { IMAGE_BASE_URL } from "@/config/env";
import styles from "./Image.module.scss";
import type { ImageProps } from "./types";

const Image = ({
  src,
  alt = "",
  className = "",
  loading = "lazy",
  decoding = "async",
  ...imageProps
}: ImageProps) => {
  if (!src) {
    return null;
  }

  const imageSrc = src.startsWith("/upload/") ? `${IMAGE_BASE_URL}${src}` : src;

  return (
    <img
      {...imageProps}
      src={imageSrc}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={`${styles.image} ${className}`.trim()}
    />
  );
};

export default Image;
