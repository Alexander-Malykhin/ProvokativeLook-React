import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
import CitySelect from "@components/CitySelect/CitySelect.tsx";
import { useDeliveryCity, DEFAULT_DELIVERY_CITY } from "@/hooks/useDeliveryCity";
import styles from "./FooterCitySelect.module.scss";

const FooterCitySelect = () => {
  const { city, setCity } = useDeliveryCity();

  return (
    <MainLayoutContainer>
      <CitySelect
        value={city}
        onChange={setCity}
        defaultCity={DEFAULT_DELIVERY_CITY}
        allowReset
        uppercase
        className={styles.select}
      />
    </MainLayoutContainer>
  );
};

export default FooterCitySelect;
