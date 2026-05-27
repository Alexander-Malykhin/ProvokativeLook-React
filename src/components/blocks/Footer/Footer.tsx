//styles
import styles from './Footer.module.scss'
//layouts
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//images
import InstaIcon from '@assets/socials/insta.svg';
import OkIcon from '@assets/socials/ok.svg';
import TgIcon from '@assets/socials/tg.svg';
import TikTokIcon from '@assets/socials/tik-tok.svg';
import VkIcon from '@assets/socials/vk.svg';
import WhatsAppIcon from '@assets/socials/whats-app.svg';
import YandexIcon from '@assets/socials/yandex.svg';
import YouTubeIcon from '@assets/socials/youtube.svg';
//UI
import Text from "@UI/typography/Text/Text.tsx";
import TextAccent from "@UI/typography/TextAccent/TextAccent.tsx";
//helper
import {convertAliasTitle} from "@helpers/convertAliasTitle.tsx";
import {Link} from "react-router-dom";
import Image from "@UI/buttons/Image/Image.tsx";

export const footerData = {
    contacts: {
        phone: '+7 (928) 109-05-45',
        workTime: 'Мы работаем с 09:00-19:00, Пн-Вс, #br# г. Ростов-на-Дону, ул. Думенко 3/2',
        email: 'provokatisashop@gmail.com',
        address: 'Фактический адрес: 344045, г. Ростов-на-Дону, #br# ул. Думенко 3/2, ТЦ «Чейлэж», офис 54',
    },

    navigation: [
        {
            title: 'Каталог',

            links: [
                {
                    label: 'Одежда',
                    path: '#',
                },
                {
                    label: 'Аксессуары',
                    path: '#',
                },
                {
                    label: 'Обувь',
                    path: '#',
                },
                {
                    label: 'Распродажа',
                    path: '#',
                },
            ],
        },

        {
            title: 'Компания',

            links: [
                {
                    label: 'О нас',
                    path: '#',
                },
                {
                    label: 'Контакты',
                    path: '#',
                },
                {
                    label: 'Публичная оферта',
                    path: '#',
                },
                {
                    label: 'Пользовательское соглашение',
                    path: '#',
                },
                {
                    label: 'Политика конфиденциальности',
                    path: '#',
                },
            ],
        },

        {
            title: 'Покупателю',

            links: [
                {
                    label: 'F.A.Q.',
                    path: '#',
                },
                {
                    label: 'Доставка',
                    path: '#',
                },
                {
                    label: 'Программа лояльности',
                    path: '#',
                },
                {
                    label: 'Возврат',
                    path: '#',
                },
                {
                    label: 'Подарочные сертификаты',
                    path: '#',
                },
                {
                    label: 'Таблица размеров',
                    path: '#',
                },
            ],
        },
    ],

    socials: [
        {
            name: 'Whatsapp',
            path: '#',
            icon: WhatsAppIcon,
        },
        {
            name: 'Telegram',
            path: '#',
            icon: TgIcon,
        },
        {
            name: 'VK',
            path: '#',
            icon: VkIcon,
        },
        {
            name: 'Instagram',
            path: '#',
            icon: InstaIcon,
        },
        {
            name: 'YouTube',
            path: '#',
            icon: YouTubeIcon,
        },
        {
            name: 'TikTok',
            path: '#',
            icon: TikTokIcon,
        },
        {
            name: 'Yandex',
            path: '#',
            icon: YandexIcon,
        },
        {
            name: 'OK',
            path: '#',
            icon: OkIcon,
        },
    ],

    company: {
        owner: 'ИП Чигрина Диана Берсовна',

        requisites:
            'ИНН: 614300579614 / ОГРНИП: 307616603600183',
    },

    design: {
        company: 'ЮМК',
    },
};

const Footer = () => {

    const {contacts, navigation, company, design, socials} = footerData;

    return (
        <footer className={styles.footer}>
            <MainLayoutContainer>
                <label className={styles.select}>
                    <span className={styles.select__label}>Доставка в</span>

                    <select className={styles.select__field} defaultValue="rostov">
                        <option value="rostov">г. РОСТОВ-НА-ДОНУ</option>
                        <option value="moscow">Москва</option>
                        <option value="spb">Санкт-Петербург</option>
                        <option value="krasnodar">Краснодар</option>
                        <option value="other">Другой город...</option>
                    </select>
                </label>
            </MainLayoutContainer>

            <div className={styles.footer__line}>
                <MainLayoutContainer className={styles.footer__content}>
                    <div className={styles.footer__contacts}>
                        <a href={`tel:${contacts.phone.replace(/\D/g, '')}`}
                           className={styles.footer__contacts_phone}>
                            {contacts.phone}
                        </a>

                        <div className={styles.footer__contacts_description}>
                            <Text>{convertAliasTitle(contacts.workTime)}</Text>

                            <Text>
                                Электронная почта:{' '}
                                <a href={`mailto:${contacts.email}`}>
                                    {contacts.email}
                                </a>
                            </Text>

                            <Text>{convertAliasTitle(contacts.address)}</Text>
                        </div>
                    </div>

                    <nav className={styles.footer__nav}>
                        {navigation.map(item => (
                            <div className={styles.footer__nav__item} key={item.title}>
                                <h3 className={styles.footer__nav__item_title}>{item.title}</h3>
                                <div className={styles.footer__nav__item_list}>
                                    {item.links.map(link => <Link to={link.path} key={link.label}
                                                                  className={styles.footer__nav__item_link}>{link.label}</Link>)}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <div className={styles.footer__socials}>
                        <Text>Присоединяйтесь к нам в социальных сетях:</Text>
                        <div className={styles.footer__socials_list}>
                            {socials.map(item => (
                                <a href={item.path} className={styles.footer__socials_item} key={item.name}>
                                    <Image src={item.icon} alt={item.name} className={styles.footer__socials_item_image}/>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className={styles.footer__bottom}>
                        <div className={styles.footer__bottom_legal}>
                            <Text>{company.owner}<br/>{company.requisites}</Text>
                        </div>

                        <div className={styles.footer__bottom_design}>
                            <Text>Дизайн сайта: {design.company}</Text>
                        </div>
                    </div>
                </MainLayoutContainer>
            </div>

            <div className={styles.footer__cookie}>
                <Text>Мы используем файлы cookie, чтобы обеспечить наилучшее обслуживание. <TextAccent mode={"link"} path={'#'}>Подробнее</TextAccent></Text>

                <button className={styles.footer__cookie_button}>
                    <span className={styles.footer__cookie_button_line}></span>
                    <span className={styles.footer__cookie_button_line}></span>
                </button>
            </div>
        </footer>
    );
};

export default Footer;