import { Link } from "react-router-dom";
//styles
import styles from './Logo.module.scss';
//UI
import Image from "@UI/buttons/Image/Image.tsx";
//components
import LogoSkeleton from "@components/Logo/components/LogoSkeleton.tsx";
//api
import { useGetSettingsQuery } from "@store/api/settings/settingsApi.ts";

const Logo = () => {
    const { data, isLoading } = useGetSettingsQuery();

    if (isLoading) return <LogoSkeleton />;

    const logo = data?.logo;

    return (
        <Link to={logo?.link || '/'} className={styles.logo}>
            {logo?.image && (
                <Image
                    src={logo.image}
                    alt={logo.title || 'logo'}
                    className={styles.logo__image}
                />
            )}
        </Link>
    );
};

export default Logo;