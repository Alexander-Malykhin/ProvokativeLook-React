import { useLocation, useNavigate } from "react-router";
import styles from "./Banner.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import BannerCategory from "@components/blocks/Banner/components/BannerCategory/BannerCategory.tsx";
import BannerSkeleton from "@components/blocks/Banner/components/BannerSkeleton/BannerSkeleton.tsx";
import Image from "@UI/media/Image/Image";
import BannerTitle from "@UI/titles/BannerTitle/BannerTitle.tsx";
import MainButton from "@/UI/buttons/MainButton/MainButton";
import { useGetHomeQuery } from "@store/api/home/homeApi.ts";
import { useGetBannersQuery } from "@store/api/banners/bannersApi";
const Banner = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { data, isLoading, isError } = useGetHomeQuery();
    const { data: categoriesData, isLoading: isCategoriesLoading, isError: isCategoriesError, } = useGetBannersQuery('miniBanners');
    if (isLoading || isCategoriesLoading)
        return <BannerSkeleton />;
    if (isError || isCategoriesError || !data || !categoriesData)
        return null;
    const bannerCategories = [...(categoriesData.items ?? [])].sort((a, b) => a.sort - b.sort);
    return (<SectionLayout className={styles.banner}>
      <div className={styles.banner__content}>
        {data.bannerImageLeft && <Image src={data.bannerImageLeft}/>}

        <div className={styles.banner__information}>
          {data.bannerText.map((text) => (<BannerTitle key={text} className={styles.banner__information_title}>
              {text}
            </BannerTitle>))}
          <div className={styles.banner__information_footer}>
            <MainButton mode="text" color="black" onClick={() => {
            const scroll = () => document.getElementById("new-collection")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
            if (location.pathname !== "/") {
                navigate("/#new-collection");
                window.setTimeout(scroll, 80);
            }
            else {
                navigate("/#new-collection", { replace: location.hash === "#new-collection" });
                requestAnimationFrame(() => requestAnimationFrame(scroll));
            }
        }}>
              Новая коллекция
            </MainButton>
          </div>
        </div>

        {data.bannerImageRight && <Image src={data.bannerImageRight}/>}
      </div>

      <BannerCategory items={bannerCategories}/>
    </SectionLayout>);
};
export default Banner;
