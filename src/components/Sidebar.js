import { useEffect, useRef, useState } from "react";
import { getTeamEventStatus } from "./tbaAPI";

export default function Sidebar({teamKey, eventKey, status, allStatuses}) {
    return (
        <div id="sidebar">
            <StatusPanel teamKey={teamKey} eventKey={eventKey} status={status} />
            <RankList allStatuses={allStatuses} />
        </div>
    )
}

function StatusPanel({teamKey, eventKey, status}) {
    let [statusInfo, setStatusInfo] = useState({});
    let [rank, setRank] = useState(0);
    let [recordString, setRecordString] = useState("");
    let [avgRP, setAvgRP] = useState(0.0);
    useEffect(() => {
        async function setStatus() {
            let info = (await getTeamEventStatus(teamKey, eventKey));
            setStatusInfo(info);
        }
        async function setDependants(info) {
            setRank((info)["rank"])
            setRecordString((info)["recordString"])
            setAvgRP(info["averageRP"]);
        }
        setStatus();
        setDependants(statusInfo);
    }, [statusInfo["rank"], statusInfo["recordString"]]);
    return (
        <>
            <p>Team {teamKey.replace("frc", "")} Rank: {rank}</p>
            <p>Record: {recordString}</p>
            <p>Average RP: {avgRP}</p>
        </>
    )
}

function RankList({eventKey, allStatuses}) {
    // for (let i = 1; i < allStatuses + 1; i++) {
    //     if($i == 1 || $i == intval(count($ranks_sorted)/2)+2) {
    //         echo "<div class='column'>";
    //     }
    //     echo "<p class='rankings'>" . "Rank " . $ranks_sorted[$i]["qual"]["ranking"]["rank"] . ": " . str_replace("frc", "", $ranks_sorted[$i]["qual"]["ranking"]["team_key"]) . "</p>";
    //     if($i == intval(count($ranks_sorted)/2)+1 || $i == count($ranks_sorted)) {
    //         echo "</div>";
    //     }
    // }

    return (
        <>
            
        </>
    )
}