import styles from "./RunningLine.module.scss";
import RunningLineItem from "./components/RunningLineItem/RunningLineItem.tsx";
import { useRunningLineItems } from "@hooks/useRunningLineItems.ts";
import type { RunningLineInterface } from "./types/types.ts";
import { useGetSettingsQuery } from "@store/api/settings/settingsApi.ts";
import { useEffect, useState } from "react";
const RunningLine = ({ text, repeat = 8, speed = 20, className = "", }: RunningLineInterface) => {
    const { data, isLoading } = useGetSettingsQuery();
    const items = useRunningLineItems(repeat);
    const [now, setNow] = useState(() => Date.now());
    const setting = data?.running_line;
    const runningText = (text || setting?.text || "").trim();
    const activeFrom = setting?.activeFrom ? Date.parse(setting.activeFrom) : null;
    const activeTo = setting?.activeTo ? Date.parse(setting.activeTo) : null;
    useEffect(() => {
        const nextBoundary = [activeFrom, activeTo]
            .filter((value): value is number => value !== null && Number.isFinite(value) && value > Date.now())
            .sort((left, right) => left - right)[0];
        if (nextBoundary === undefined)
            return;
        const timeout = window.setTimeout(() => setNow(Date.now()), Math.min(nextBoundary - Date.now() + 100, 2_147_483_647));
        return () => window.clearTimeout(timeout);
    }, [activeFrom, activeTo, now]);
    const usesApiSetting = !text;
    const hasStarted = !usesApiSetting || activeFrom === null || !Number.isFinite(activeFrom) || now >= activeFrom;
    const hasNotEnded = !usesApiSetting || activeTo === null || !Number.isFinite(activeTo) || now <= activeTo;
    if (isLoading || !runningText || !hasStarted || !hasNotEnded)
        return null;
    return (<div className={`${styles.line} ${className}`}>
      <RunningLineItem text={runningText} speed={speed} items={items}/>
    </div>);
};
export default RunningLine;
