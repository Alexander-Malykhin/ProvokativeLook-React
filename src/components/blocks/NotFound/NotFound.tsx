import {useNavigate} from "react-router";
//styles
import styles from "./NotFound.module.scss";
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//UI
import MainButton from "@UI/buttons/MainButton/MainButton.tsx";

const NotFound = () => {

  const navigate = useNavigate();

  return (
    <SectionLayout>
      <MainLayoutContainer className={styles.page}>
        <div className={styles.page__content}>
          <h1 className={styles.page__title}>404</h1>
          <h2 className={styles.page__subtitle}>Страница не найдена</h2>

          <p className={styles.page__description}>
            Что-то пошло не так — страница, которую вы хотели открыть, не
            существует.
          </p>
        </div>

        <MainButton
            className={styles.page__button}
            onClick={() => navigate("/catalog")
        }>
          Вернуться в каталог
        </MainButton>
      </MainLayoutContainer>
    </SectionLayout>
  );
};

export default NotFound;
