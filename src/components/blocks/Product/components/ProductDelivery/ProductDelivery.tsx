import { useEffect, useRef, useState } from "react";

import styles from "./ProductDelivery.module.scss";
import Image from "@UI/media/Image/Image";
import BoxImage from "@assets/params/box.svg";
import InfoImage from "@assets/params/info.svg";
import ShopImage from "@assets/params/shop.svg";
import CarImage from "@assets/params/car.svg";
import CitySelect from "@components/CitySelect/CitySelect";
import { DEFAULT_DELIVERY_CITY, useDeliveryCity } from "@/hooks/useDeliveryCity";

const DELIVERY_ITEMS = [
  {
    id: "courier",
    icon: BoxImage,
    title: "Доставка курьером",
    details:
      "Бесплатно для заказа от 12 000 ₽. Курьер позвонит заранее, доставку можно перенести на удобное время. Вы получите уведомления об отправлении заказа и прибытии его в город выдачи.",
  },
  {
    id: "pickup",
    icon: ShopImage,
    title: "В пункты выдачи Почты России, СДЭК, Boxberry",
    details:
      "Выберите удобный пункт выдачи при оформлении заказа. Срок и стоимость доставки зависят от города и выбранной службы.",
  },
  {
    id: "regions",
    icon: CarImage,
    title: "По России 300 ₽, в страны СНГ 500 ₽",
    details:
      "Стоимость указана для стандартной доставки. Для удалённых регионов и отдельных направлений итоговая стоимость может отличаться.",
  },
];

const ProductDelivery = () => {
  const { city, setCity } = useDeliveryCity();
  const [openInfoId, setOpenInfoId] = useState<string | null>(null);
  const deliveryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || deliveryRef.current?.contains(target)) return;
      setOpenInfoId(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenInfoId(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const openOnHover = (id: string) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setOpenInfoId(id);
  };

  const closeOnHover = () => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setOpenInfoId(null);
  };

  return (
    <div ref={deliveryRef} className={styles.delivery}>
      <div className={styles.delivery__city}>
        <CitySelect
          value={city}
          onChange={setCity}
          label="Доставка в"
          defaultCity={DEFAULT_DELIVERY_CITY}
          allowReset
          className={styles.delivery__citySelect}
        />
      </div>

      <div className={styles.delivery__items}>
        {DELIVERY_ITEMS.map((item) => {
          const isInfoOpen = openInfoId === item.id;

          return (
            <article key={item.id} className={styles.delivery__item}>
              <div className={styles.delivery__content}>
                <Image src={item.icon} className={styles.delivery__icon} />
                <span className={styles.delivery__text}>{item.title}</span>
              </div>

              <div
                className={styles.delivery__infoWrap}
                onPointerEnter={() => openOnHover(item.id)}
                onPointerLeave={closeOnHover}
              >
                <button
                  type="button"
                  className={styles.delivery__infoButton}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenInfoId((current) => (current === item.id ? null : item.id));
                  }}
                  aria-expanded={isInfoOpen}
                  aria-label={`Подробнее: ${item.title}`}
                >
                  <Image src={InfoImage} className={styles.delivery__info} />
                </button>

                {isInfoOpen && (
                  <div
                    className={styles.delivery__tooltip}
                    role="tooltip"
                    onPointerDown={(event) => event.stopPropagation()}
                  >
                    {item.details}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default ProductDelivery;
