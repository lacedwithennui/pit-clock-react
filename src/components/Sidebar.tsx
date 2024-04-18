import React, { useEffect, useState } from "react";
import { teamObjectRankLookup, teamRankLookup } from "./util.tsx";

export default function Sidebar({teamKey, status, allStatuses, statusLoading, allStatusesLoading}: {teamKey: string, status: object, allStatuses: object, statusLoading: boolean, allStatusesLoading: boolean}) {
    return (
        <div id="sidebar">
            {statusLoading ? <></> : <StatusPanel teamKey={teamKey} status={status} />}
            {allStatusesLoading ? <></> : <RankList allStatuses={allStatuses} />}
        </div>
    )
}

function StatusPanel({teamKey, status}: {teamKey: string, status: object}) {
    let [rank, setRank] = useState(0);
    let [recordString, setRecordString] = useState("");
    let [avgRP, setAvgRP] = useState(0.0);
    useEffect(() => {
        async function setDependants(info: object) {
            let hasResolved: boolean = (info === null || info === undefined || Object.keys(info).length !== 0);
            setRank(hasResolved ? (info)["rank"] : 0)
            setRecordString(hasResolved ? (info)["recordString"] : "");
            setAvgRP(hasResolved ? info["averageRP"] : 0);
        }
        setDependants(status);
    }, []);//[rank["rank"], status["recordString"]]);
    teamKey.replace("frc", "")
    return (
        <>
            <p>Team {teamKey.replace("frc", "")} Rank: {rank}</p>
            <p>Record: {recordString}</p>
            <p>Average RP: {avgRP}</p>
        </>
    )
}

function RankList({allStatuses}: {allStatuses: object}) {
    let column: JSX.Element[][] = [[], [], []];
    let statusArray: object[] = [];
    Object.keys(allStatuses).forEach((key) => {
        allStatuses[key]["teamKey"] = key
        statusArray.push(allStatuses[key])
    });
    statusArray.sort((a, b) => {
        return teamObjectRankLookup(a) - teamObjectRankLookup(b);
    })
    for (let i = 0; i < statusArray.length; i++) {
        if(i === 0 || i < statusArray.length / 3) {
            column[0].push(<p className='rankings'>Rank {teamObjectRankLookup(statusArray[i])}: {(statusArray[i]["teamKey"] as string).replace("frc", "")}</p>);
        }
        else if(i >= statusArray.length / 3 && i < (2 * statusArray.length) / 3){
            column[1].push(<p className='rankings'>Rank {teamObjectRankLookup(statusArray[i])}: {(statusArray[i]["teamKey"] as string).replace("frc", "")}</p>);
        }
        else {
            column[2].push(<p className='rankings'>Rank {teamObjectRankLookup(statusArray[i])}: {(statusArray[i]["teamKey"] as string).replace("frc", "")}</p>);
        }
    }

    return (
        <div id="matches">
            <div className="column">{column[0]}</div>
            <div className="column">{column[1]}</div>
            <div className="column">{column[2]}</div>
        </div>
    )
}