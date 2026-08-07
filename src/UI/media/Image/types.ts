import type { ImgHTMLAttributes } from "react";

export interface ImageProps extends Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src"
> {
  src: string | null | undefined;
}
