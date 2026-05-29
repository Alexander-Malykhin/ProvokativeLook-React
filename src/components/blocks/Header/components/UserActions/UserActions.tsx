import {useNavigate} from "react-router";
//styles
import styles from './UserActions.module.scss'
//UI
import ActionButton from "@UI/buttons/ActionButton/ActionButton.tsx";
import Image from "@UI/buttons/Image/Image.tsx";


const UserActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            id: 1,
            image: `${import.meta.env.BASE_URL}header/search.svg`,
            func: () => console.log('search'),
        },
        {
            id: 2,
            image: `${import.meta.env.BASE_URL}header/user.svg`,
            path: '/profile',
        },
        {
            id: 3,
            image: `${import.meta.env.BASE_URL}header/favorite.svg`,
            path: '/favorites',
        },
        {
            id: 4,
            image: `${import.meta.env.BASE_URL}header/basket.svg`,
            path: '/basket',
        },
    ];

    const handleClick = (item: any) => {
        if (item.path) {
            navigate(item.path);
            return;
        }

        item.func?.();
    };

    return (
        <div className={styles.actions}>
            {actions.map((item) => (
                <ActionButton
                    key={item.id}
                    onClick={() => handleClick(item)}
                    className={styles.actions__image}
                >
                    <Image src={item.image} alt="action-icon" />
                </ActionButton>
            ))}
        </div>
    );
};

export default UserActions;