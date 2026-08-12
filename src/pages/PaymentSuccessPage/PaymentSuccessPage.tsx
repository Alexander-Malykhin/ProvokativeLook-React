import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./PaymentSuccessPage.module.scss";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const order = params.get("order") || sessionStorage.getItem("provokativelook.payment.order") || "";

  useEffect(() => {
    sessionStorage.removeItem("provokativelook.payment.url");
    const timeout = window.setTimeout(() => {
      navigate(`/profile/orders${order ? `?paid=${encodeURIComponent(order)}` : ""}`, { replace: true });
    }, 1400);
    return () => window.clearTimeout(timeout);
  }, [navigate, order]);

  return (
    <main className={styles.success}>
      <div className={styles.success__mark}>✓</div>
      <h1>Оплата принята</h1>
      <p>Возвращаем вас к заказам.</p>
    </main>
  );
};

export default PaymentSuccessPage;
