//styles
import styles from './UserActions.module.scss'
//UI
import ActionButton from "@UI/buttons/ActionButton/ActionButton.tsx";
import Image from "@UI/buttons/Image/Image.tsx";

const actions = [
    {
        id:1,
        image: `${import.meta.env.BASE_URL}header/search.svg`,
        func: () => ''
    },
    {
        id:2,
        image: `${import.meta.env.BASE_URL}header/user.svg`,
        func: () => ''
    },
    {
        id:3,
        image: `${import.meta.env.BASE_URL}header/favorite.svg`,
        func: () => ''
    },
    {
        id:4,
        image: `${import.meta.env.BASE_URL}header/basket.svg`,
        func: () => ''
    }
]

const UserActions = () => {
    return (
        <div className={styles.actions}>
            {actions.map(item => (
                <ActionButton key={item.id} onClick={item.func} className={styles.actions__image}>
                    <Image src={item.image} alt={'action-icon'}/>
                </ActionButton>
            ))}
        </div>
    );
};

export default UserActions;