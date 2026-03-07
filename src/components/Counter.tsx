import { useEffect, useState } from "react"
import React from "react";
import { getMatchTimeNexus, getNexusTimeCollection, getOnDeckTimeNexus, getQueueTimeNexus } from "./tbaAPI.tsx";
import {useQuery} from "react-query";

export default function Counter({nextMatch, eventKey}) {
    let [queueTime, setQueueTime] = useState(0);
    let [onDeckTime, setOnDeckTime] = useState(0);
    let [nextMatchTime, setNextMatchTime] = useState(0);
    // const {
    //         data: timesCollection,
    //         error: timesCollectionError,
    //         isLoading: timesCollectionLoading
    //     } = useQuery("timesCollection", () => getNexusTimeCollection(eventKey, (parseInt(nextMatch["matchNumber"])) + 6))
    useEffect(() => {
        async function set() {
            let times = (await getNexusTimeCollection(eventKey, nextMatch["compLevel"], nextMatch["matchNumber"], nextMatch["setNumber"]));
            // console.log(timesCollection)
            // let qTime = getQueueTimeNexus(eventKey, (parseInt(nextMatch["matchNumber"])) + 6)
            // let odTime = getOnDeckTimeNexus(eventKey, (parseInt(nextMatch["matchNumber"])) + 6)
            // let nmTime = getMatchTimeNexus(eventKey, (parseInt(nextMatch["matchNumber"])) + 6)
            // if(!timesCollectionLoading) {
            //     let times = timesCollection
                    setQueueTime((times!)["estimatedQueueTime"]);
                    setOnDeckTime((times!)["estimatedOnDeckTime"]);
                    setNextMatchTime((times!)["estimatedOnFieldTime"]);
            // // console.log(times)
            // }

        }

    
        set()
        updateTimer(queueTime ,onDeckTime, nextMatchTime);
        const counterUpdater = setInterval(() => updateTimer(queueTime, onDeckTime, nextMatchTime), 1000);
        return () => clearInterval(counterUpdater)
    }, [nextMatch, queueTime, onDeckTime, nextMatchTime]);
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

export function updateTimer(queueTime: number, onDeckTime: number, matchTime: number) {
    if(isNaN(queueTime)) {
        queueTime = 0
    }
    let distance = queueTime - (new Date().getTime());
    let hours, minutes, seconds;
    if(distance < 0) {
        // hours = 0;
        // minutes = 0;
        // seconds = 0;
        if(onDeckTime - (new Date().getTime()) > 0) {
            document.getElementById("queuein")!.innerHTML = "On deck in:"
            document.getElementById("queuein")!.style.fontSize = "3em";
            distance = onDeckTime - (new Date().getTime());
        }
        else {
            document.getElementById("queuein")!.innerHTML = "On field in:"
            document.getElementById("queuein")!.style.fontSize = "3em";

            distance = matchTime - (new Date().getTime());
        }
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }
    else {
        document.getElementById("queuein")!.innerHTML = "Queue in:"
        document.getElementById("queuein")!.style.fontSize = "2em";
        hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }

    if(hours === 0 && minutes === 0) {
        document.getElementById("counter")!.innerHTML = seconds + "s ";
    }
    else if(hours === 0) {
        document.getElementById("counter")!.innerHTML = minutes + "m " + seconds + "s ";
    }
    else {
        document.getElementById("counter")!.innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
    }

    let timeString = new Date().toLocaleTimeString()
    document.getElementById("currentTime")!.innerHTML = timeString.split(":")[0] + ":" + timeString.split(":")[1] + " " + timeString.split(" ")[1];
}

export function updateClock() {
    let timeString = new Date().toLocaleTimeString()
    document.getElementById("currentTime")!.innerHTML = timeString.split(":")[0] + ":" + timeString.split(":")[1] + " " + timeString.split(" ")[1];
}