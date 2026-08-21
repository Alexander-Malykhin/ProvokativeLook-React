import { useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";
import { openAuthModal } from "@store/slices/toggleAuthModalSlice";
import { useGetUserQuery } from "@store/api/user/userApi";
const AuthRequired = ({ children }: PropsWithChildren) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data, isLoading } = useGetUserQuery();
    const authenticated = Boolean(data?.success && data.user);
    useEffect(() => {
        if (isLoading || authenticated)
            return;
        navigate("/", { replace: true });
        dispatch(openAuthModal("login"));
    }, [authenticated, dispatch, isLoading, navigate]);
    if (isLoading || !authenticated)
        return null;
    return <>{children}</>;
};
export default AuthRequired;

