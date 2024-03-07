import { useEffect, useState } from "react"

export default function Counter({nextMatch}) {
    let [nextMatchTime, setNextMatchTime] = useState(0);
    useEffect(() => {
        async function set() {
            setNextMatchTime(await nextMatch["predictedTime"])
        }
        set()
        updateTimer(nextMatchTime);
        const counterUpdater = setInterval(() => updateTimer(nextMatchTime), 1000);
        return () => clearInterval(counterUpdater)
    }, [nextMatch["predictedTime"] == nextMatchTime]);
    return (
        <div id="counterDiv">
            <h1 id="counter">
                0h 0m 0s
            </h1>
        </div>
    )
}

export function TimeClock() {
    return (
        <h1 id="currentTime">
            0:00 AM
        </h1>
    )
}

export function updateTimer(nextMatchTime) {
    if(isNaN(nextMatchTime)) {
        nextMatchTime = 0
    }
    let distance = nextMatchTime * 1000 - (new Date().getTime());
    let hours, minutes, seconds;
    if(distance < 0) {
        hours = 0;
        minutes = 0;
        seconds = 0;
    }
    else {
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }

    document.getElementById("counter").innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
    let timeString = new Date().toLocaleTimeString()
    document.getElementById("currentTime").innerHTML = timeString.split(":")[0] + ":" + timeString.split(":")[1] + " " + timeString.split(" ")[1];
}