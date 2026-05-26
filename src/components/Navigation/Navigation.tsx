//styles
import styles from './Navigation.module.scss'
import NavigationItem from "@components/Navigation/components/NavigationItem.tsx";

const navigation = [
    {
        id: 1,
        text: 'Коллекция',
        path: '/'
    },
    {
        id: 2,
        text: 'Коллекция',
        path: '/'
    },
    {
        id: 3,
        text: 'Коллекция',
        path: '/'
    },
    {
        id: 4,
        text: 'Коллекция',
        path: '/'
    },
    {
        id: 5,
        text: 'Коллекция',
        path: '/'
    },
    {
        id: 6,
        text: 'Коллекция',
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