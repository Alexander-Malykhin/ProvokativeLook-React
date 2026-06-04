//styles
import styles from './Navigation.module.scss'
//components
import NavigationItem from "@components/Navigation/components/NavigationItem.tsx";
//api
import {navigationMain} from "@api/static/navigationMain.ts";


const Navigation = () => {

    return (
        <nav className={styles.navigation}>
            {navigationMain.map(item => (
                <NavigationItem color={'black'} path={item.path} key={item.id}>
                    {item.text}
                </NavigationItem>
            ))}
        </nav>
    );
};

export default Navigation;