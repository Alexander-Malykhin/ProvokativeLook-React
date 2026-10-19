import styles from './PrivacyPolicy.module.scss';
import SectionLayout from '@layouts/SectionLayout/SectionLayout.tsx';
const PrivacyPolicy = () => {
  return (
    <SectionLayout>
      <article className={styles.privacy}>
        <h1 className={styles.privacy__title}>Политика конфиденциальности</h1>

        <p className={styles.privacy__intro}>
          Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей
          сайта интернет-магазина Provokative Look.
        </p>

        <p className={styles.privacy__text}>
          Используя сайт и передавая персональные данные через формы сайта, Пользователь подтверждает, что ознакомился с
          настоящей Политикой конфиденциальности.
        </p>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>1. Общие положения</h2>

          <p className={styles.privacy__text}>
            1.1. Настоящая Политика применяется к персональным данным, которые могут быть получены при использовании
            сайта Provokative Look.
          </p>

          <p className={styles.privacy__text}>
            1.2. Обработка персональных данных осуществляется в соответствии с законодательством Российской Федерации.
          </p>

          <p className={styles.privacy__text}>
            1.3. Администрация сайта принимает необходимые организационные и технические меры для защиты персональных
            данных от неправомерного или случайного доступа, уничтожения, изменения, блокирования, копирования,
            распространения и иных неправомерных действий.
          </p>

          <p className={styles.privacy__text}>
            1.4. Настоящая Политика распространяется только на информацию, полученную через сайт и связанные с ним
            сервисы.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>2. Какие данные могут обрабатываться</h2>

          <p className={styles.privacy__text}>
            2.1. В зависимости от используемых функций сайта могут обрабатываться следующие данные Пользователя:
          </p>

          <ul className={styles.privacy__list}>
            <li className={styles.privacy__listItem}>имя;</li>
            <li className={styles.privacy__listItem}>фамилия;</li>
            <li className={styles.privacy__listItem}>отчество, если оно предоставляется;</li>
            <li className={styles.privacy__listItem}>номер телефона;</li>
            <li className={styles.privacy__listItem}>адрес электронной почты;</li>
            <li className={styles.privacy__listItem}>адрес доставки;</li>
            <li className={styles.privacy__listItem}>сведения о заказах;</li>
            <li className={styles.privacy__listItem}>сведения, указанные в личном кабинете;</li>
            <li className={styles.privacy__listItem}>
              иные данные, которые Пользователь самостоятельно предоставляет через формы сайта.
            </li>
          </ul>

          <p className={styles.privacy__text}>
            2.2. При использовании сайта также могут автоматически обрабатываться технические данные, включая:
          </p>

          <ul className={styles.privacy__list}>
            <li className={styles.privacy__listItem}>IP-адрес;</li>
            <li className={styles.privacy__listItem}>данные файлов cookie;</li>
            <li className={styles.privacy__listItem}>сведения о браузере и устройстве;</li>
            <li className={styles.privacy__listItem}>дату и время посещения;</li>
            <li className={styles.privacy__listItem}>адреса посещенных страниц;</li>
            <li className={styles.privacy__listItem}>источник перехода на сайт;</li>
            <li className={styles.privacy__listItem}>техническую информацию, необходимую для работы и защиты сайта.</li>
          </ul>

          <p className={styles.privacy__text}>
            2.3. Администрация не осуществляет намеренный сбор специальных категорий персональных данных, если это не
            требуется законодательством или отдельным функционалом сайта.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>3. Цели обработки персональных данных</h2>

          <p className={styles.privacy__text}>3.1. Персональные данные могут обрабатываться для следующих целей:</p>

          <ul className={styles.privacy__list}>
            <li className={styles.privacy__listItem}>регистрации и авторизации Пользователя;</li>
            <li className={styles.privacy__listItem}>работы личного кабинета;</li>
            <li className={styles.privacy__listItem}>оформления и исполнения заказов;</li>
            <li className={styles.privacy__listItem}>организации оплаты товаров;</li>
            <li className={styles.privacy__listItem}>организации доставки заказов;</li>
            <li className={styles.privacy__listItem}>связи с Пользователем по вопросам заказа;</li>
            <li className={styles.privacy__listItem}>обработки обращений и запросов;</li>
            <li className={styles.privacy__listItem}>предоставления информации о статусе заказа;</li>
            <li className={styles.privacy__listItem}>улучшения качества работы сайта;</li>
            <li className={styles.privacy__listItem}>обеспечения безопасности сайта;</li>
            <li className={styles.privacy__listItem}>предотвращения мошенничества и злоупотреблений;</li>
            <li className={styles.privacy__listItem}>исполнения требований законодательства Российской Федерации.</li>
          </ul>

          <p className={styles.privacy__text}>
            3.2. При наличии отдельного согласия персональные данные также могут использоваться для направления
            рекламных и информационных сообщений.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>4. Правовые основания обработки</h2>

          <p className={styles.privacy__text}>
            4.1. Обработка персональных данных осуществляется при наличии соответствующих правовых оснований, включая:
          </p>

          <ul className={styles.privacy__list}>
            <li className={styles.privacy__listItem}>согласие Пользователя;</li>
            <li className={styles.privacy__listItem}>необходимость исполнения договора или оформления заказа;</li>
            <li className={styles.privacy__listItem}>
              необходимость выполнения требований законодательства Российской Федерации;
            </li>
            <li className={styles.privacy__listItem}>иные основания, предусмотренные законодательством.</li>
          </ul>

          <p className={styles.privacy__text}>
            4.2. Если для конкретной обработки требуется отдельное согласие Пользователя, такое согласие запрашивается
            отдельно.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>5. Способы обработки персональных данных</h2>

          <p className={styles.privacy__text}>
            5.1. Обработка персональных данных может осуществляться как с использованием средств автоматизации, так и
            без их использования.
          </p>

          <p className={styles.privacy__text}>5.2. В процессе обработки могут выполняться следующие действия:</p>

          <ul className={styles.privacy__list}>
            <li className={styles.privacy__listItem}>сбор;</li>
            <li className={styles.privacy__listItem}>запись;</li>
            <li className={styles.privacy__listItem}>систематизация;</li>
            <li className={styles.privacy__listItem}>накопление;</li>
            <li className={styles.privacy__listItem}>хранение;</li>
            <li className={styles.privacy__listItem}>уточнение и обновление;</li>
            <li className={styles.privacy__listItem}>извлечение;</li>
            <li className={styles.privacy__listItem}>использование;</li>
            <li className={styles.privacy__listItem}>передача в предусмотренных законом случаях;</li>
            <li className={styles.privacy__listItem}>обезличивание;</li>
            <li className={styles.privacy__listItem}>блокирование;</li>
            <li className={styles.privacy__listItem}>удаление;</li>
            <li className={styles.privacy__listItem}>уничтожение.</li>
          </ul>

          <p className={styles.privacy__text}>
            5.3. Обработка осуществляется только в объеме, необходимом для достижения заявленных целей.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>6. Передача данных третьим лицам</h2>

          <p className={styles.privacy__text}>
            6.1. Администрация может передавать персональные данные третьим лицам только в случаях, когда это необходимо
            для работы сайта, исполнения заказа или предусмотрено законодательством.
          </p>

          <p className={styles.privacy__text}>6.2. К таким третьим лицам могут относиться:</p>

          <ul className={styles.privacy__list}>
            <li className={styles.privacy__listItem}>платежные сервисы и банки;</li>
            <li className={styles.privacy__listItem}>службы доставки;</li>
            <li className={styles.privacy__listItem}>курьерские компании;</li>
            <li className={styles.privacy__listItem}>операторы связи;</li>
            <li className={styles.privacy__listItem}>поставщики IT-сервисов и хостинга;</li>
            <li className={styles.privacy__listItem}>сервисы аналитики и технического обслуживания;</li>
            <li className={styles.privacy__listItem}>
              государственные органы в случаях, предусмотренных законодательством.
            </li>
          </ul>

          <p className={styles.privacy__text}>
            6.3. Третьим лицам передается только тот объем данных, который необходим для выполнения соответствующей
            функции или услуги.
          </p>

          <p className={styles.privacy__text}>
            6.4. Передача персональных данных в иных целях без предусмотренного законом основания не осуществляется.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>7. Платежные данные</h2>

          <p className={styles.privacy__text}>
            7.1. Оплата заказов может осуществляться через сторонние платежные системы.
          </p>

          <p className={styles.privacy__text}>
            7.2. Данные банковских карт могут вводиться Пользователем непосредственно на стороне платежного сервиса.
          </p>

          <p className={styles.privacy__text}>
            7.3. Если данные банковской карты не передаются непосредственно сайту Provokative Look, Администрация не
            получает и не хранит полный номер банковской карты, срок ее действия и защитный код.
          </p>

          <p className={styles.privacy__text}>
            7.4. Обработка платежных данных соответствующим платежным сервисом регулируется его собственными документами
            и правилами.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>8. Файлы cookie</h2>

          <p className={styles.privacy__text}>8.1. Сайт может использовать файлы cookie и аналогичные технологии.</p>

          <p className={styles.privacy__text}>8.2. Cookie могут использоваться для:</p>

          <ul className={styles.privacy__list}>
            <li className={styles.privacy__listItem}>сохранения пользовательской сессии;</li>
            <li className={styles.privacy__listItem}>авторизации;</li>
            <li className={styles.privacy__listItem}>сохранения настроек;</li>
            <li className={styles.privacy__listItem}>работы корзины;</li>
            <li className={styles.privacy__listItem}>обеспечения безопасности;</li>
            <li className={styles.privacy__listItem}>анализа работы сайта;</li>
            <li className={styles.privacy__listItem}>улучшения пользовательского опыта.</li>
          </ul>

          <p className={styles.privacy__text}>
            8.3. Пользователь может ограничить или отключить использование cookie в настройках своего браузера.
          </p>

          <p className={styles.privacy__text}>
            8.4. Отключение cookie может привести к некорректной работе отдельных функций сайта.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>9. Хранение персональных данных</h2>

          <p className={styles.privacy__text}>
            9.1. Персональные данные хранятся не дольше, чем этого требуют цели их обработки, если иной срок хранения не
            установлен законодательством Российской Федерации.
          </p>

          <p className={styles.privacy__text}>
            9.2. После достижения целей обработки персональные данные могут быть удалены, уничтожены или обезличены,
            если дальнейшее хранение не требуется по закону.
          </p>

          <p className={styles.privacy__text}>
            9.3. Данные, связанные с заказами и расчетами, могут храниться в течение сроков, предусмотренных
            законодательством о бухгалтерском, налоговом и ином обязательном учете.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>10. Защита персональных данных</h2>

          <p className={styles.privacy__text}>
            10.1. Администрация принимает разумные технические и организационные меры для защиты персональных данных.
          </p>

          <p className={styles.privacy__text}>
            10.2. В зависимости от используемой инфраструктуры меры защиты могут включать:
          </p>

          <ul className={styles.privacy__list}>
            <li className={styles.privacy__listItem}>разграничение доступа к данным;</li>
            <li className={styles.privacy__listItem}>использование паролей и средств авторизации;</li>
            <li className={styles.privacy__listItem}>защиту соединения;</li>
            <li className={styles.privacy__listItem}>резервное копирование;</li>
            <li className={styles.privacy__listItem}>журналирование действий;</li>
            <li className={styles.privacy__listItem}>обновление программного обеспечения;</li>
            <li className={styles.privacy__listItem}>ограничение доступа сотрудников к данным;</li>
            <li className={styles.privacy__listItem}>иные необходимые меры информационной безопасности.</li>
          </ul>

          <p className={styles.privacy__text}>
            10.3. Доступ к персональным данным предоставляется только лицам, которым такой доступ необходим для
            выполнения их обязанностей.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>11. Права Пользователя</h2>

          <p className={styles.privacy__text}>
            11.1. Пользователь вправе получать информацию об обработке своих персональных данных в случаях и порядке,
            предусмотренных законодательством.
          </p>

          <p className={styles.privacy__text}>
            11.2. Пользователь вправе потребовать уточнения своих персональных данных, если они являются неполными,
            устаревшими или неточными.
          </p>

          <p className={styles.privacy__text}>
            11.3. Пользователь вправе требовать блокирования или удаления персональных данных при наличии
            предусмотренных законом оснований.
          </p>

          <p className={styles.privacy__text}>
            11.4. Пользователь вправе отозвать ранее предоставленное согласие на обработку персональных данных.
          </p>

          <p className={styles.privacy__text}>
            11.5. Отзыв согласия не влияет на законность обработки, осуществленной до момента его отзыва.
          </p>

          <p className={styles.privacy__text}>
            11.6. В отдельных случаях после отзыва согласия обработка данных может продолжаться, если для этого
            существуют иные предусмотренные законодательством основания.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>12. Рекламные сообщения</h2>

          <p className={styles.privacy__text}>
            12.1. Рекламные и маркетинговые сообщения направляются только при наличии соответствующего согласия
            Пользователя, если такое согласие требуется законодательством.
          </p>

          <p className={styles.privacy__text}>
            12.2. Пользователь вправе в любое время отказаться от получения рекламных сообщений.
          </p>

          <p className={styles.privacy__text}>
            12.3. Отказ от рекламных сообщений не влияет на возможность получения сервисных уведомлений, связанных с
            оформленными заказами, безопасностью учетной записи и работой сайта.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>13. Данные несовершеннолетних</h2>

          <p className={styles.privacy__text}>
            13.1. Сайт не предназначен для целенаправленного сбора персональных данных несовершеннолетних лиц без
            участия их законных представителей.
          </p>

          <p className={styles.privacy__text}>
            13.2. Если Администрации станет известно о получении персональных данных несовершеннолетнего без
            необходимого правового основания, такие данные могут быть удалены.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>14. Сторонние сайты и сервисы</h2>

          <p className={styles.privacy__text}>14.1. На сайте могут размещаться ссылки на сторонние сайты и сервисы.</p>

          <p className={styles.privacy__text}>
            14.2. Администрация не контролирует порядок обработки персональных данных на сторонних ресурсах.
          </p>

          <p className={styles.privacy__text}>
            14.3. Пользователю рекомендуется самостоятельно ознакомиться с политикой конфиденциальности соответствующего
            стороннего сервиса перед передачей ему своих данных.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>15. Изменение Политики конфиденциальности</h2>

          <p className={styles.privacy__text}>
            15.1. Администрация вправе изменять настоящую Политику конфиденциальности.
          </p>

          <p className={styles.privacy__text}>
            15.2. Актуальная редакция Политики размещается на соответствующей странице сайта.
          </p>

          <p className={styles.privacy__text}>
            15.3. Новая редакция вступает в силу с момента ее публикации, если иное не указано в самой редакции.
          </p>

          <p className={styles.privacy__text}>
            15.4. Пользователю рекомендуется периодически проверять актуальную редакцию настоящей Политики.
          </p>
        </section>

        <section className={styles.privacy__section}>
          <h2 className={styles.privacy__sectionTitle}>16. Контактная информация</h2>

          <p className={styles.privacy__text}>
            По вопросам обработки и защиты персональных данных Пользователь может обратиться по контактным данным,
            указанным в разделе «Контакты» на сайте Provokative Look.
          </p>
        </section>

        <p className={styles.privacy__updated}>Дата последнего обновления: 18 августа 2026 года.</p>
      </article>
    </SectionLayout>
  );
};
export default PrivacyPolicy;
