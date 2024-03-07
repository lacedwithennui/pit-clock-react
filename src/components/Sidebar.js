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
    let column = [[], []];
    let statusArray = [];
    Object.keys(allStatuses).forEach((key) => {
        allStatuses[key]["teamKey"] = key
        statusArray.push(allStatuses[key])
    });
    statusArray.sort((a, b) => {
        return a["qual"]["ranking"]["rank"] - b["qual"]["ranking"]["rank"];
    })
    for (let i = 0; i < statusArray.length; i++) {
        if(i === 0 || i < statusArray.length / 2) {
            column[0].push(<p class='rankings'>Rank {statusArray[i]["qual"]["ranking"]["rank"]}: {statusArray[i]["teamKey"].replace("frc", "")}</p>);
        }
        else {
            column[1].push(<p class='rankings'>Rank {statusArray[i]["qual"]["ranking"]["rank"]}: {statusArray[i]["teamKey"].replace("frc", "")}</p>);
        }
    }

    return (
        <div id="matches">
            <div className="column">{column[0]}</div>
            <div className="column">{column[1]}</div>
        </div>
    )
}