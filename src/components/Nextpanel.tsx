import React, { useEffect, useState } from "react";
import EventForm from "./EventForm";
import { compLevelToShortHumanReadable, getWinChances, simpleAvg, teamOPRLookup, teamRankLookup, teamScoreLookup } from "./util";

interface NextpanelProps {
    teamKey: string,
    currentMatch: object,
    nextMatch: object,
    allStatuses: object,
    oprs: object,
    setTeamKey: Function,
    setEventKey: Function,
    setRefreshInterval: Function
}
export default function Nextpanel({teamKey, currentMatch, nextMatch, allStatuses, oprs, setTeamKey, setEventKey, setRefreshInterval}: NextpanelProps) {
    let matchNum = (currentMatch["set_number"] === 1 ? currentMatch["match_number"] : currentMatch["set_number"]);
    let bumperClass = nextMatch["bumperClass"];
    const [rankRatioJSX, setRankRatioJSX] = useState(<></>);
    const [scoreRatioJSX, setScoreRatioJSX] = useState(<></>);
    const [oprSumJSX, setOPRSumJSX] = useState(<></>);
    const [winChances, setWinChances] = useState(0.);

    useEffect(() => {
        async function set() {
            let blueOPRSum: number = 0;
            let blueRanks: number[] = [];
            let blueScores: number[] = [];
            for(let i = 0; i < nextMatch["blueAlliance"]["team_keys"].length; i++) {
                blueOPRSum += teamOPRLookup((await nextMatch)["blueAlliance"]["team_keys"][i], oprs);
                blueRanks.push(teamRankLookup((await nextMatch)["blueAlliance"]["team_keys"][i], allStatuses));
                blueScores.push(teamScoreLookup((await nextMatch)["blueAlliance"]["team_keys"][i], allStatuses));
            }
            let redOPRSum: number = 0;
            let redRanks: number[] = [];
            let redScores: number[] = [];
            for(let i = 0; i < nextMatch["redAlliance"]["team_keys"].length; i++) {
                redOPRSum += teamOPRLookup((await nextMatch)["redAlliance"]["team_keys"][i], oprs);
                redRanks.push(teamRankLookup((await nextMatch)["redAlliance"]["team_keys"][i], allStatuses));
                redScores.push(teamScoreLookup((await nextMatch)["redAlliance"]["team_keys"][i], allStatuses));
            }
            setOPRSumJSX(
                <p className="nextMatchHideable">
                    Total OPR Ratio (Blue:Red):{" "}
                    <span className="bluealliance">
                        {Math.trunc(blueOPRSum)}
                    </span>
                    :
                    <span className="redalliance">
                        {Math.trunc(redOPRSum)}
                    </span>
                </p>
            );
            setRankRatioJSX(
                <p className="nextMatchHideable">
                    Avg. Rank Ratio (Blue:Red):{" "}
                    <span className="bluealliance">
                        {Math.trunc(simpleAvg(blueRanks))}
                    </span>
                    :
                    <span className="redalliance">
                        {Math.trunc(simpleAvg(redRanks))}
                    </span>
                </p>
            );
            setScoreRatioJSX(
                <p className="nextMatchHideable">
                    Avg. Score Ratio (Blue:Red):{" "}
                    <span className="bluealliance">
                        {Math.trunc(simpleAvg(blueScores))}
                    </span>
                    :
                    <span className="redalliance">
                        {Math.trunc(simpleAvg(redScores))}
                    </span>
                </p>
            );
            setWinChances(getWinChances((await nextMatch)["allianceColor"], simpleAvg(redRanks), simpleAvg(blueRanks), simpleAvg(redScores), simpleAvg(blueScores), redOPRSum, blueOPRSum, Object.keys(allStatuses).length))
        }
        set();
    }, [nextMatch, allStatuses, oprs])
    return (
        <>
            <div>
                <div id="nextpanel">
                    <p className='nextpanel'>Current Match In Play: {compLevelToShortHumanReadable(currentMatch["comp_level"])} {matchNum}</p>
                    <p className='nextpanel'>Next Match: {compLevelToShortHumanReadable(nextMatch["compLevel"])} {(nextMatch["setNumber"] === 1 ? nextMatch["matchNumber"] : nextMatch["setNumber"])}</p>
                    <p className="nextpanel">Station: {nextMatch["allianceStation"]}</p>
                    <p id="bumper" className={bumperClass}>{teamKey.replace("frc", "")}</p>
                    {oprSumJSX}
                    {rankRatioJSX}
                    {scoreRatioJSX}
                    <p>Win Chances: {winChances}%</p>
                </div>
                <EventForm setTeamKey={setTeamKey} setEventKey={setEventKey} setRefreshInterval={setRefreshInterval} />
            </div>
        </>
    );
}