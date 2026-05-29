//styles
import styles from './OrderForm.module.scss'
//UI
import MainButton from "@UI/buttons/MainButton/MainButton.tsx";
import FormRow from "@components/blocks/Basket/UI/FormRow/FormRow.tsx";

const OrderForm = () => {
    return (
        <form className={styles.form}>
            <div className={styles.form__header}>
                <FormRow mode={'description'} label={'Ваша корзина'} value={'3 товара'}/>

                <div className={styles.form__list}>
                    <FormRow mode={'price'} label={'Сумма:'} value={'51 100 ₽'}/>
                    <FormRow mode={'description'} label={'Бонусы к списанию:'} value={'1000 ₽'}/>
                    <FormRow mode={'description'} label={'Скидка:'} value={'8 525 ₽'}/>
                </div>
            </div>

            <MainButton type={'submit'}>
                Оформить заказ
            </MainButton>
        </form>
    );
};

export default OrderForm;