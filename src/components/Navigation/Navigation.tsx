//styles
import styles from './Navigation.module.scss'
//components
import NavigationItem from "@components/Navigation/components/NavigationItem/NavigationItem.tsx";
import NavigationSkeleton from "@components/Navigation/components/NavigationSkeleton/NavigationSkeleton.tsx";
//api
import { useGetNavigationQuery } from "@store/api/navigation/navigationApi.ts";

const Navigation = () => {
    const { data, isLoading, isError } = useGetNavigationQuery();

    if (isLoading) return <NavigationSkeleton />;

    if (isError || !data) return null;

    return (
        <nav className={styles.navigation}>
            {data.map((item) => (
                <NavigationItem color="black" path={item.link} key={item.id}>
                    {item.title}
                </NavigationItem>
            ))}
        </nav>
    );
};


export default Navigation;