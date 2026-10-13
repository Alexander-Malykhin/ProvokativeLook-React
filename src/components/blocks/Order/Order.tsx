import { safeSessionStorage } from "@helpers/browserStorage";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import styles from "./Order.module.scss";
import SectionLayout from "@layouts/SectionLayout/SectionLayout";
import MainLayoutContainer from "@layouts/MainLayoutContainer/MainLayoutContainer";
import OrderSummary from "@components/blocks/Basket/components/OrderSummary/OrderSummary";
import DeliveryStep from "./components/DeliveryStep/DeliveryStep";
import PaymentStep from "./components/PaymentStep/PaymentStep";
import RecipientStep from "./components/RecipientStep/RecipientStep";
import type { OrderFormValues } from "./model/types";
import { useGetCartQuery } from "@store/api/cart/cartApi";
import { useGetUserQuery } from "@store/api/user/userApi";
import { useGetAddressesQuery } from "@store/api/address/addressApi";
import type { ProfileAddress } from "@components/blocks/Profile/subpages/ProfileAddresses/model/types";
import { useCreateOrderMutation } from "@store/api/orders/ordersApi";
import { baseApi } from "@store/api/baseApi";
import { useAppDispatch } from "@store/hooks";
import { getRequestErrorMessage } from "@store/api/getRequestErrorMessage";
import { detectCountry, formatPhone, normalizePhone } from "@components/common/PhoneInput/phone";
import PostalDelivery from './components/PostalDelivery/PostalDelivery';
import type { PostalQuote } from '@store/api/orders/types';
import { CheckoutAttempt } from './model/checkoutAttempt';
const Order = () => {
    const [courierAddress, setCourierAddress] = useState<ProfileAddress | null>(null);
    const [provider, setProvider] = useState<'mail' | 'cdek'>('mail');
    const [postalQuote, setPostalQuote] = useState<PostalQuote | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { data: cartData, isLoading: isCartLoading, error: cartError, refetch: refetchCart } = useGetCartQuery();
    const { data: userData, isLoading: isUserLoading, error: userError, refetch: refetchUser } = useGetUserQuery();
    const { data: addressesData, isLoading: isAddressesLoading, error: addressesError, refetch: refetchAddresses } = useGetAddressesQuery();
    const [recentlySavedAddress, setRecentlySavedAddress] = useState<ProfileAddress | null>(null);
    const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
    const [errorMessage, setErrorMessage] = useState("");
    const [attempt] = useState(() => new CheckoutAttempt());
    const initializedRef = useRef(false);
    const creatingRef = useRef(false);
    const deliveryRef = useRef<HTMLDivElement>(null);
    const scrollToDelivery = () => {
        deliveryRef.current?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        deliveryRef.current?.focus({ preventScroll: true });
    };
    const cart = cartData?.cart;
    const addresses = useMemo(() => addressesData?.addresses ?? [], [addressesData?.addresses]);
    const effectiveAddresses = useMemo(() => {
        if (!recentlySavedAddress)
            return addresses;
        return [
            recentlySavedAddress,
            ...addresses.filter((item) => Number(item.id) !== Number(recentlySavedAddress.id)),
        ];
    }, [addresses, recentlySavedAddress]);
    const hasUnavailableItems = cart?.items.some((item) => !item.isAvailable) ?? false;
    const { register, handleSubmit, reset, setValue, control, formState: { errors }, } = useForm<OrderFormValues>({
        shouldFocusError: false,
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            addressId: "",
            delivery: '',
            payment: "card",
            privacy: false,
        },
    });
    const delivery = useWatch({ control, name: 'delivery' });
    const selectedAddressId = useWatch({ control, name: 'addressId' });
    const selectedPickup = effectiveAddresses.find(address => String(address.id) === selectedAddressId);
    const needsPostalQuote = delivery === 'delivery' ? provider === 'mail' : delivery === 'pickup' && selectedPickup?.deliveryProvider === 'mail';
    const validPostalQuote = postalQuote && (delivery === 'pickup'
        ? postalQuote.mode === 'office' && Number(postalQuote.address.id) === Number(selectedAddressId)
        : postalQuote.mode === 'door') ? postalQuote : null;
    useEffect(() => {
        if (initializedRef.current || !userData?.user || !addressesData)
            return;
        reset({
            firstName: userData.user.firstName ?? "",
            lastName: userData.user.lastName ?? "",
            email: userData.user.email ?? "",
            phone: userData.user.phone ? formatPhone(userData.user.phone) : "",
            addressId: "",
            delivery: '',
            payment: "card",
            privacy: false,
        });
        initializedRef.current = true;
    }, [addresses, addressesData, reset, userData?.user]);
    const onSubmit = (event: FormEvent<HTMLFormElement>) => handleSubmit(async (values) => {
        if (creatingRef.current) return;
        setErrorMessage("");
        if (!cart || cart.items.length === 0) {
            setErrorMessage("Корзина пуста");
            return;
        }
        if (hasUnavailableItems) {
            setErrorMessage("В корзине есть товар, которого уже нет в нужном количестве");
            return;
        }
        if (!values.delivery || (values.delivery === 'pickup' && !selectedPickup?.pickupCode) || (needsPostalQuote && (!validPostalQuote || validPostalQuote.expiresAt * 1000 <= Date.now())) || (values.delivery === 'delivery' && provider === 'cdek' && (!courierAddress?.postalCode.trim() || (courierAddress?.formattedAddress.trim().length ?? 0) < 10))) {
            setErrorMessage(needsPostalQuote && !validPostalQuote ? 'Рассчитайте доставку Почтой России' : values.delivery === 'pickup' ? 'Выберите пункт выдачи' : 'Выберите адрес доставки');
            scrollToDelivery();
            return;
        }
        creatingRef.current = true;
        try {
            const payload = {
                recipient: {
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    phone: normalizePhone(values.phone, detectCountry(values.phone)),
                },
                addressId: values.delivery === 'pickup' ? Number(values.addressId) : undefined,
                courierAddress: values.delivery === 'delivery' && provider === 'cdek' ? courierAddress ?? undefined : undefined,
                shippingQuoteId: needsPostalQuote ? validPostalQuote?.id : undefined,
                delivery: values.delivery,
                payment: values.payment,
                privacy: values.privacy,
            };
            const response = await createOrder({ ...payload, requestId: attempt.forPayload(payload) }).unwrap();
            if (response.order.payment.required && response.order.payment.url) {
                safeSessionStorage.removeItem('provokativelook.payment.purpose');
                safeSessionStorage.setItem("provokativelook.payment.url", response.order.payment.url);
                safeSessionStorage.setItem("provokativelook.payment.order", String(response.order.orderId));
                navigate("/payment/redirect");
                window.setTimeout(() => {
                    dispatch(baseApi.util.invalidateTags(["Cart"]));
                }, 0);
                return;
            }
            navigate("/profile/orders", { replace: true });
            window.setTimeout(() => {
                dispatch(baseApi.util.invalidateTags(["Cart"]));
            }, 0);
        }
        catch (error) {
            setErrorMessage(getRequestErrorMessage(error, "Не удалось оформить заказ"));
        } finally {
            creatingRef.current = false;
        }
    }, (invalid) => {
        if (invalid.delivery || invalid.addressId || !delivery) scrollToDelivery();
        else {
            const first = Object.keys(invalid)[0];
            document.getElementsByName(first)[0]?.focus();
        }
    })(event);
    if (isCartLoading || isUserLoading || isAddressesLoading) {
        return (<SectionLayout>
        <MainLayoutContainer>
          <div className={styles.order__loading}>Загрузка данных заказа...</div>
        </MainLayoutContainer>
      </SectionLayout>);
    }
    if ((!cartData && cartError) || (!userData && userError) || (!addressesData && addressesError)) {
        return <SectionLayout><MainLayoutContainer><div role="alert">
            Не удалось загрузить данные заказа. Проверьте подключение.
            <button type="button" onClick={() => { void refetchCart(); void refetchUser(); void refetchAddresses(); }}>Повторить загрузку</button>
        </div></MainLayoutContainer></SectionLayout>;
    }
    if (!cart || cart.items.length === 0) {
        return (<SectionLayout>
        <MainLayoutContainer>
          <div className={styles.order__empty}>
            <h2>Корзина пуста</h2>
            <button type="button" onClick={() => navigate("/catalog")}>Перейти в каталог</button>
          </div>
        </MainLayoutContainer>
      </SectionLayout>);
    }
    return (<SectionLayout>
      <form onSubmit={onSubmit}>
        <MainLayoutContainer className={styles.order}>
          <div className={styles.order__list}>
            {hasUnavailableItems && (<div className={styles.order__stockWarning}>
                В корзине есть позиции, которых недостаточно на складе. Измените количество или удалите их перед оформлением.
              </div>)}

            <RecipientStep register={register} errors={errors}/>
            <div ref={deliveryRef} tabIndex={-1} style={{ scrollMarginTop: 100 }}>
              <DeliveryStep pickupPostal={selectedPickup?.deliveryProvider === 'mail' ? <PostalDelivery key={JSON.stringify([selectedPickup.id, cart.items.map(item => [item.offerId, item.quantity, item.price])])} office={selectedPickup} quote={validPostalQuote} onQuote={setPostalQuote}/> : null} courierAddress={courierAddress} onCourierAddress={setCourierAddress} selectedAddressId={selectedAddressId} provider={provider} onProvider={(next) => { setProvider(next); setPostalQuote(null); }} postal={<PostalDelivery key={JSON.stringify(cart.items.map((item) => [item.offerId, item.quantity, item.price]))} quote={postalQuote} onQuote={setPostalQuote}/>} delivery={delivery} validationError={errors.delivery?.message || (delivery === 'delivery' ? errors.addressId?.message : undefined)} register={register} setValue={setValue} addresses={effectiveAddresses} onAddressSaved={setRecentlySavedAddress} city={userData?.user?.city ?? effectiveAddresses[0]?.city ?? "Ростов-на-Дону"} country={userData?.user?.country ?? effectiveAddresses[0]?.country ?? "Россия"} countryCode={userData?.user?.countryCode ?? effectiveAddresses[0]?.countryCode ?? "RU"}/>
            </div>
            <PaymentStep delivery={delivery} register={register} errors={errors} isSubmitting={isCreating} errorMessage={errorMessage}/>
          </div>
          <div><OrderSummary cart={cart}/>{needsPostalQuote && <p style={{ marginTop: 20, lineHeight: 1.5 }}>Доставка отдельным платежом: <strong>{validPostalQuote ? validPostalQuote.amount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }) : 'рассчитайте в разделе доставки'}</strong></p>}</div>
        </MainLayoutContainer>
      </form>
    </SectionLayout>);
};
export default Order;


