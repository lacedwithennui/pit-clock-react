import { useState, useEffect } from "react";

export default function TimeClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const updateTime = () => setTime(new Date());

        const timeClockInterval = setInterval(updateTime, 1000);

        return () => {
            clearInterval(timeClockInterval);
        };
    }, []);

    return (
        <div className="timeClock">
            <h2>Current Time:</h2>
            <h1>{time.toLocaleTimeString("en-US", {hour: "numeric", minute: "2-digit"})}</h1>
        </div>
    );
}
