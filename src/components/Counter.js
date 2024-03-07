import { useEffect, useState } from "react"

export default function Counter({nextMatch}) {
    let [nextMatchTime, setNextMatchTime] = useState(0);
    useEffect(() => {
        async function set() {
            setNextMatchTime(await nextMatch["predictedTime"])
        }
        set()
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

export function updateTimer(nextMatchTime) {
    if(isNaN(nextMatchTime)) {
        nextMatchTime = 0
    }
    let distance = nextMatchTime * 1000 - (new Date().getTime());
    console.log(distance)
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
    // document.getElementById("currentTime").innerHTML = "Time: " + new Date().toLocaleTimeString();
}