//styles
import styles from './Navigation.module.scss'
import NavigationItem from "@components/Navigation/components/NavigationItem.tsx";

const navigation = [
    {
        id: 1,
        text: 'Новая коллекция',
        path: '/'
    },
    {
        id: 2,
        text: 'Каталог',
        path: '/'
    },
    {
        id: 3,
        text: 'О бренде',
        path: '/'
    },
    {
        id: 4,
        text: 'Доставка и оплата',
        path: '/'
    },
    {
        id: 5,
        text: 'Контакты',
        path: '/'
    },
    {
        id: 6,
        text: 'Распродажа',
        path: '/'
    },
]

const Navigation = () => {

    return (
        <nav className={styles.navigation}>
            {navigation.map(item => (
                <NavigationItem color={'black'} path={item.path} key={item.id}>
                    {item.text}
                </NavigationItem>
            ))}
        </nav>
    );
};

export default Navigation;