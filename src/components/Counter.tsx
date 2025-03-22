import { useEffect, useState } from "react"
import React from "react";
import { getQueueTimeNexus } from "./tbaAPI.tsx";

export default function Counter({nextMatch, eventKey}) {
    let [nextMatchTime, setNextMatchTime] = useState(0);
    useEffect(() => {
        async function set() {
            let time = getQueueTimeNexus(eventKey, (parseInt(nextMatch["matchNumber"])) + 6)
            // setNextMatchTime(await nextMatch["predictedTime"] - 20 * 60)
            console.log(await time / 1000)
            console.log(await nextMatch["predictedTime"])
            setNextMatchTime(await time);
        }
        set()
        updateTimer(nextMatchTime);
        const counterUpdater = setInterval(() => updateTimer(nextMatchTime), 1000);
        return () => clearInterval(counterUpdater)
    }, [nextMatch, nextMatchTime]);
    return (
        <div id="counterDiv">
            <p id="queuein">Queue in:</p>
            <h1 id="counter">
                0h 0m 0s
            </h1>
        </div>
    )
}

export function TimeClock() {
    useEffect(() => {
        const counterUpdater = setInterval(() => updateClock(), 1000);
        return () => clearInterval(counterUpdater)
    }, [])
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
    let distance = nextMatchTime - (new Date().getTime());
    let hours, minutes, seconds;
    if(distance < 0) {
        // hours = 0;
        // minutes = 0;
        // seconds = 0;
        distance = (new Date().getTime() - nextMatchTime);
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = "-" + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = "-" + Math.floor((distance % (1000 * 60)) / 1000);
    }
    else {
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }

    if(hours == 0) {
        document.getElementById("counter")!.innerHTML = minutes + "m " + seconds + "s ";
    }
    if(minutes == 0) {
        document.getElementById("counter")!.innerHTML = seconds + "s ";
    }

    let timeString = new Date().toLocaleTimeString()
    document.getElementById("currentTime")!.innerHTML = timeString.split(":")[0] + ":" + timeString.split(":")[1] + " " + timeString.split(" ")[1];
}

export function updateClock() {
    let timeString = new Date().toLocaleTimeString()
    document.getElementById("currentTime")!.innerHTML = timeString.split(":")[0] + ":" + timeString.split(":")[1] + " " + timeString.split(" ")[1];
}