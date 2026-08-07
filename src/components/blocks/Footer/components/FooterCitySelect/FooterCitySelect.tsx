import { useState } from "react";
//layouts
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//components
import CitySelect from "@components/CitySelect/CitySelect.tsx";
//styles
import styles from "./FooterCitySelect.module.scss";

const FooterCitySelect = () => {
  const [city, setCity] = useState("Ростов-на-Дону");

  return (
    <MainLayoutContainer>
      <CitySelect
        value={city}
        onChange={setCity}
        uppercase
        className={styles.select}
      />
    </MainLayoutContainer>
  );
};

export default FooterCitySelect;
