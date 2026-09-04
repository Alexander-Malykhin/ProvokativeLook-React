import { useRealtimeUpdates } from "@hooks/realtime/useRealtimeUpdates";
import { useGetUserQuery } from "@store/api/user/userApi";
const RealtimeBridge = () => {
    const { data } = useGetUserQuery();
    useRealtimeUpdates(Boolean(data?.success && data.user));
    return null;
};
export default RealtimeBridge;
