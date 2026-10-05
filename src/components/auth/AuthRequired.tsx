import { useEffect, type PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "@store/hooks";
import { openAuthModal } from "@store/slices/toggleAuthModalSlice";
import { useGetUserQuery } from "@store/api/user/userApi";
const AuthRequired = ({ children }: PropsWithChildren) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { data, isLoading, isFetching, error, refetch } = useGetUserQuery();
    const authenticated = Boolean(data?.success && data.user);
    const unauthorized = error && 'status' in error && error.status === 401;
    useEffect(() => {
        if (isLoading || isFetching || authenticated || !unauthorized)
            return;
        navigate("/", { replace: true });
        dispatch(openAuthModal("login"));
    }, [authenticated, dispatch, isLoading, isFetching, navigate, unauthorized]);
    if (!authenticated && error && !unauthorized)
        return <div role="alert">Не удалось загрузить личный кабинет. <button type="button" disabled={isFetching} onClick={() => void refetch()}>Повторить</button></div>;
    if (isLoading || !authenticated)
        return null;
    return <>{children}</>;
};
export default AuthRequired;

