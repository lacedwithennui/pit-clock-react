import { useState, useEffect } from "react";
import { formatCountdown } from "../../utility/util.ts";

export default function Countdown({nextQueueTime, nextOnDeckTime, nextOnFieldTime}: {nextQueueTime: Date, nextOnDeckTime: Date, nextOnFieldTime: Date}) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const updateTime = () => setCurrentTime(new Date());

        const clockInterval = setInterval(updateTime, 1000);

        return () => {
            clearInterval(clockInterval);
        };
    }, []);

    const formatted = formatCountdown(currentTime, nextQueueTime, nextOnDeckTime, nextOnFieldTime);

    return (
        <div className="countdownClock">
            <h2>{formatted.countdownLabel}</h2>
            <h1>{formatted.countdownValue}</h1>
        </div>
    );
}
