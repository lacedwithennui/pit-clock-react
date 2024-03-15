import React, { useEffect, useState } from "react";

export default function Sidebar({teamKey, status, allStatuses}: {teamKey: string, status: object, allStatuses: object}) {
    return (
        <div id="sidebar">
            <StatusPanel teamKey={teamKey} status={status} />
            <RankList allStatuses={allStatuses} />
        </div>
    )
}

function StatusPanel({teamKey, status}: {teamKey: string, status: object}) {
    let [rank, setRank] = useState(0);
    let [recordString, setRecordString] = useState("");
    let [avgRP, setAvgRP] = useState(0.0);
    useEffect(() => {
        async function setDependants(info: object) {
            setRank((info)["rank"])
            setRecordString((info)["recordString"])
            setAvgRP(info["averageRP"]);
        }
        setDependants(status);
    }, [status["rank"], status["recordString"]]);
    return (
        <>
            <p>Team {teamKey.replace("frc", "")} Rank: {rank}</p>
            <p>Record: {recordString}</p>
            <p>Average RP: {avgRP}</p>
        </>
    )
}

function RankList({allStatuses}: {allStatuses: object}) {
    let column: JSX.Element[][] = [[], []];
    let statusArray: object[] = [];
    Object.keys(allStatuses).forEach((key) => {
        allStatuses[key]["teamKey"] = key
        statusArray.push(allStatuses[key])
    });
    statusArray.sort((a, b) => {
        return a["qual"]["ranking"]["rank"] - b["qual"]["ranking"]["rank"];
    })
    for (let i = 0; i < statusArray.length; i++) {
        if(i === 0 || i < statusArray.length / 2) {
            column[0].push(<p className='rankings'>Rank {statusArray[i]["qual"]["ranking"]["rank"]}: {(statusArray[i]["teamKey"] as string).replace("frc", "")}</p>);
        }
        else {
            column[1].push(<p className='rankings'>Rank {statusArray[i]["qual"]["ranking"]["rank"]}: {(statusArray[i]["teamKey"] as string).replace("frc", "")}</p>);
        }
    }

    return (
        <div id="matches">
            <div className="column">{column[0]}</div>
            <div className="column">{column[1]}</div>
        </div>
    )
}