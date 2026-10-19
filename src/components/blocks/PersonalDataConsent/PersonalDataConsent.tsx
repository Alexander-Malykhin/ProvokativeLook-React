import styles from './PersonalDataConsent.module.scss';
import SectionLayout from '@layouts/SectionLayout/SectionLayout.tsx';
const PersonalDataConsent = () => {
  return (
    <SectionLayout>
      <article className={styles.consent}>
        <h1 className={styles.consent__title}>Согласие на обработку персональных данных</h1>

        <p className={styles.consent__intro}>
          Настоящим я свободно, своей волей и в своем интересе даю согласие владельцу интернет-магазина Provokative Look
          (далее — «Оператор») на обработку моих персональных данных на условиях, изложенных ниже.
        </p>

        <section className={styles.consent__section}>
          <h2 className={styles.consent__sectionTitle}>1. Персональные данные</h2>

          <p className={styles.consent__text}>
            1.1. Я даю согласие на обработку персональных данных, которые самостоятельно предоставляю при использовании
            сайта Provokative Look.
          </p>

          <p className={styles.consent__text}>1.2. К таким персональным данным могут относиться:</p>

          <ul className={styles.consent__list}>
            <li className={styles.consent__listItem}>имя;</li>

            <li className={styles.consent__listItem}>фамилия;</li>

            <li className={styles.consent__listItem}>отчество, если оно предоставляется;</li>

            <li className={styles.consent__listItem}>номер телефона;</li>

            <li className={styles.consent__listItem}>адрес электронной почты;</li>

            <li className={styles.consent__listItem}>адрес доставки;</li>

            <li className={styles.consent__listItem}>данные, указанные при регистрации и в личном кабинете;</li>

            <li className={styles.consent__listItem}>сведения, необходимые для оформления и исполнения заказа;</li>

            <li className={styles.consent__listItem}>
              иные сведения, которые я самостоятельно передаю через формы сайта.
            </li>
          </ul>
        </section>

        <section className={styles.consent__section}>
          <h2 className={styles.consent__sectionTitle}>2. Цели обработки персональных данных</h2>

          <p className={styles.consent__text}>
            2.1. Я даю согласие на обработку персональных данных для следующих целей:
          </p>

          <ul className={styles.consent__list}>
            <li className={styles.consent__listItem}>регистрации и авторизации на сайте;</li>

            <li className={styles.consent__listItem}>работы личного кабинета;</li>

            <li className={styles.consent__listItem}>оформления и исполнения заказов;</li>

            <li className={styles.consent__listItem}>организации оплаты товаров;</li>

            <li className={styles.consent__listItem}>организации доставки заказов;</li>

            <li className={styles.consent__listItem}>предоставления информации о состоянии заказа;</li>

            <li className={styles.consent__listItem}>связи со мной по вопросам оформления и исполнения заказа;</li>

            <li className={styles.consent__listItem}>обработки моих обращений и запросов;</li>

            <li className={styles.consent__listItem}>обеспечения безопасности сайта;</li>

            <li className={styles.consent__listItem}>предотвращения мошенничества и злоупотреблений;</li>

            <li className={styles.consent__listItem}>исполнения требований законодательства Российской Федерации.</li>
          </ul>
        </section>

        <section className={styles.consent__section}>
          <h2 className={styles.consent__sectionTitle}>3. Действия с персональными данными</h2>

          <p className={styles.consent__text}>
            3.1. В рамках настоящего согласия Оператор вправе осуществлять следующие действия с моими персональными
            данными:
          </p>

          <ul className={styles.consent__list}>
            <li className={styles.consent__listItem}>сбор;</li>

            <li className={styles.consent__listItem}>запись;</li>

            <li className={styles.consent__listItem}>систематизацию;</li>

            <li className={styles.consent__listItem}>накопление;</li>

            <li className={styles.consent__listItem}>хранение;</li>

            <li className={styles.consent__listItem}>уточнение и обновление;</li>

            <li className={styles.consent__listItem}>извлечение;</li>

            <li className={styles.consent__listItem}>использование;</li>

            <li className={styles.consent__listItem}>
              передачу лицам, привлекаемым для исполнения заказа, в случаях, предусмотренных законодательством;
            </li>

            <li className={styles.consent__listItem}>обезличивание;</li>

            <li className={styles.consent__listItem}>блокирование;</li>

            <li className={styles.consent__listItem}>удаление;</li>

            <li className={styles.consent__listItem}>уничтожение персональных данных.</li>
          </ul>
        </section>

        <section className={styles.consent__section}>
          <h2 className={styles.consent__sectionTitle}>4. Способы обработки</h2>

          <p className={styles.consent__text}>
            4.1. Обработка персональных данных может осуществляться с использованием средств автоматизации и без
            использования таких средств.
          </p>

          <p className={styles.consent__text}>
            4.2. Обработка осуществляется только в объеме, необходимом для достижения указанных в настоящем согласии
            целей.
          </p>
        </section>

        <section className={styles.consent__section}>
          <h2 className={styles.consent__sectionTitle}>5. Передача персональных данных</h2>

          <p className={styles.consent__text}>
            5.1. Я соглашаюсь с тем, что для исполнения заказа Оператор может передавать необходимый объем моих
            персональных данных третьим лицам.
          </p>

          <p className={styles.consent__text}>5.2. К таким лицам могут относиться:</p>

          <ul className={styles.consent__list}>
            <li className={styles.consent__listItem}>платежные сервисы и банки;</li>

            <li className={styles.consent__listItem}>службы доставки и курьерские компании;</li>

            <li className={styles.consent__listItem}>поставщики IT-сервисов;</li>

            <li className={styles.consent__listItem}>иные организации, участвующие в исполнении заказа.</li>
          </ul>

          <p className={styles.consent__text}>
            5.3. Третьим лицам передается только тот объем персональных данных, который необходим для выполнения
            соответствующей услуги или обязанности.
          </p>
        </section>

        <section className={styles.consent__section}>
          <h2 className={styles.consent__sectionTitle}>6. Срок действия согласия</h2>

          <p className={styles.consent__text}>
            6.1. Настоящее согласие действует с момента его предоставления и до достижения целей обработки персональных
            данных либо до момента его отзыва, если иное не предусмотрено законодательством Российской Федерации.
          </p>

          <p className={styles.consent__text}>
            6.2. Отдельные персональные данные могут продолжать обрабатываться после отзыва согласия при наличии иных
            законных оснований для их обработки.
          </p>
        </section>

        <section className={styles.consent__section}>
          <h2 className={styles.consent__sectionTitle}>7. Отзыв согласия</h2>

          <p className={styles.consent__text}>
            7.1. Я вправе в любое время отозвать настоящее согласие, направив соответствующее обращение Оператору по
            контактным данным, указанным на сайте.
          </p>

          <p className={styles.consent__text}>
            7.2. После получения отзыва Оператор прекращает обработку персональных данных в случаях и порядке,
            предусмотренных законодательством Российской Федерации.
          </p>
        </section>

        <section className={styles.consent__section}>
          <h2 className={styles.consent__sectionTitle}>8. Подтверждение согласия</h2>

          <p className={styles.consent__text}>
            8.1. Устанавливая соответствующий флажок в форме сайта, нажимая кнопку отправки формы, регистрации или
            оформления заказа, я подтверждаю, что ознакомился с настоящим Согласием и Политикой конфиденциальности.
          </p>

          <p className={styles.consent__text}>
            8.2. Я подтверждаю, что предоставляю настоящее согласие добровольно, своей волей и в своем интересе.
          </p>
        </section>

        <section className={styles.consent__section}>
          <h2 className={styles.consent__sectionTitle}>9. Контактная информация</h2>

          <p className={styles.consent__text}>
            По вопросам обработки персональных данных и отзыва настоящего согласия можно обратиться по контактным
            данным, указанным в разделе «Контакты» на сайте Provokative Look.
          </p>
        </section>

        <p className={styles.consent__updated}>Дата последнего обновления: 18 августа 2026 года.</p>
      </article>
    </SectionLayout>
  );
};
export default PersonalDataConsent;
