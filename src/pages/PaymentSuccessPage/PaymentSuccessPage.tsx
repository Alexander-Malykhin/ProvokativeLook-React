import { safeSessionStorage } from "@helpers/browserStorage";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const returnedOrder = safeSessionStorage.getItem("provokativelook.payment.order") ?? "";
        safeSessionStorage.removeItem("provokativelook.payment.url");
        if (returnedOrder) {
            safeSessionStorage.setItem("provokativelook.payment.returnedOrder", returnedOrder);
            safeSessionStorage.setItem("provokativelook.payment.pendingUntil", String(Date.now() + 60000));
        }
        navigate("/profile/orders", { replace: true });
    }, [navigate]);
    return null;
};
export default PaymentSuccessPage;

