import {useForm} from "react-hook-form"
//styles
import styles from './SubscribeNewsLetter.module.scss'
//layouts
import SectionLayout from "@layouts/SectionLayout/SectionLayout.tsx";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer.tsx";
//UI
import MainButton from "@UI/buttons/MainButton/MainButton.tsx";
import MainInput from "@UI/inputs/MainInput/MainInput.tsx";
import MainCheckbox from "@UI/inputs/MainCheckbox/MainCheckbox.tsx";
import TextAccent from "@UI/typography/TextAccent/TextAccent.tsx";

interface SubscribeFormValues {
    email: string;
    advertising: boolean;
    privacy: boolean;
}

const SubscribeNewsLetter = () => {

    const {register, handleSubmit, formState: {errors}} = useForm<SubscribeFormValues>({
        defaultValues: {
            advertising: false,
            privacy: false,
        }
    })

    const onSubmit = (data: SubscribeFormValues) => {
        console.log(data)
    }

    return (
        <SectionLayout className={styles.subscribe}>
            <MainLayoutContainer className={styles.subscribe__content}>
                <p className={styles.subscribe__text}>
                    Получайте информацию о новинках, акциях и специальных предложения первой
                </p>

                <form className={styles.subscribe__form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.subscribe__form_row}>
                        <MainInput
                            type="email"
                            placeholder="Email"
                            register={register('email', {
                                required: 'Введите E-mail',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Введите корректный E-mail',
                                },
                            })}
                            error={errors.email?.message}
                        />

                        <MainButton type={'submit'} className={styles.subscribe__form_button}>
                            Подписаться
                        </MainButton>
                    </div>
                    <div className={styles.subscribe__form__column}>
                        <MainCheckbox register={register('advertising')}>
                            Хочу получать рекламные предложения и узнавать о новинках, скидках и бонусах
                        </MainCheckbox>

                        {errors.advertising && (
                            <span className={styles.subscribe__form_checkbox_error}>
                                Поставьте галочку, чтобы получать предложения
                            </span>
                        )}

                        <MainCheckbox register={register('privacy', {
                            required: 'Подтвердите согласие на обработку данных',
                        })}>
                            Соглашаюсь на обработку моих <TextAccent mode={'main'}>персональных данных</TextAccent> в соответствии с <TextAccent mode={'link'} path={'#'}>политикой конфиденциальности</TextAccent>
                        </MainCheckbox>

                        {errors.privacy && (
                            <span className={styles.subscribe__form_checkbox_error}>
                                {errors.privacy.message}
                            </span>
                        )}
                    </div>
                </form>
            </MainLayoutContainer>
        </SectionLayout>
    );
};

export default SubscribeNewsLetter;