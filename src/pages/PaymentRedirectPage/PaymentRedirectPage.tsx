import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PaymentRedirectPage.module.scss";

const PaymentRedirectPage = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(2);

  useEffect(() => {
    const paymentUrl = sessionStorage.getItem("provokativelook.payment.url") ?? "";
    if (!paymentUrl) {
      navigate("/profile/orders", { replace: true });
      return;
    }

    const interval = window.setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    const timeout = window.setTimeout(() => {
      window.location.assign(paymentUrl);
    }, 1200);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <main className={styles.payment}>
      <div className={styles.payment__brand}>PROVOKATIVELOOK</div>
      <div className={styles.payment__loader} aria-hidden="true" />
      <h1>Переходим к оплате</h1>
      <p>Сейчас откроется защищённая страница банка.</p>
      <small>{seconds > 0 ? `Переход через ${seconds} сек.` : "Открываем оплату…"}</small>
    </main>
  );
};

export default PaymentRedirectPage;
