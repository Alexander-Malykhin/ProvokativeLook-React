import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const returnedOrder = sessionStorage.getItem("provokativelook.payment.order") ?? "";
    sessionStorage.removeItem("provokativelook.payment.url");
    if (returnedOrder) {
      sessionStorage.setItem("provokativelook.payment.returnedOrder", returnedOrder);
      sessionStorage.setItem("provokativelook.payment.pendingUntil", String(Date.now() + 60_000));
    }
    navigate("/profile/orders", { replace: true });
  }, [navigate]);

  return null;
};

export default PaymentSuccessPage;
