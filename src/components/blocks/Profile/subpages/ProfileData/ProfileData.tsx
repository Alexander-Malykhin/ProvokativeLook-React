//styles
import styles from './ProfileData.module.scss'

interface ProfileDataInterface {
    title: string
}

interface Field {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
}

const initialFields: Field[] = [
    {id: 'firstName', label: 'Имя*', value: 'Иван'},
    {id: 'lastName', label: 'Фамилия*', value: 'Иванов'},
    {id: 'birth', label: 'Дата рождения', value: '14/02/1997 '},
    {id: 'email', label: 'Электронная почта*', value: 'mail@yandex.ru'},
    {id: 'phone', label: 'Телефон*', value: '+7 (908) 333-44-55'},
    {id: 'city', label: 'Город', value: 'Ростов-на-Дону'},
];

const ProfileData = ({title}: ProfileDataInterface) => {

    return (
        <div className={styles.content}>
            <h2 className={styles.content__title}>{title}</h2>

            <div className={styles.content__fields}>
                {initialFields.map(item => (
                    <div key={item.id} className={styles.content__item}>
                        <span className={styles.content__item_label}>
                            {item.label}
                        </span>
                        <p className={styles.content__item_value}>{item.value}</p>
                    </div>
                ))
                }
            </div>
        </div>
    );
};

export default ProfileData;