import styles from "./RunningLine.module.scss";
import RunningLineItem from "./components/RunningLineItem/RunningLineItem.tsx";
import { useRunningLineItems } from "@hooks/useRunningLineItems.ts";
import type { RunningLineInterface } from "./types/types.ts";
import { useGetSettingsQuery } from "@store/api/settings/settingsApi.ts";
const RunningLine = ({ text, repeat = 8, speed = 20, className = "", }: RunningLineInterface) => {
    const { data, isLoading } = useGetSettingsQuery();
    const items = useRunningLineItems(repeat);
    if (isLoading)
        return null;
    const runningText = text || data?.running_line?.text || "";
    return (<div className={`${styles.line} ${className}`}>
      <RunningLineItem text={runningText} speed={speed} items={items}/>
    </div>);
};
export default RunningLine;

