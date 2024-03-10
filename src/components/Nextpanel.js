import { useEffect, useState } from "react";
import { compLevelToShortHumanReadable, getWinChances, simpleAvg, teamRankLookup, teamScoreLookup, teamOPRLookup } from "./util";

export default function Nextpanel({teamKey, currentMatch, nextMatch, allStatuses, oprs}) {
    let matchNum = currentMatch["match_number"];
    let bumperClass = nextMatch["bumperClass"];
    const [rankRatioJSX, setRankRatioJSX] = useState(<></>);
    const [scoreRatioJSX, setScoreRatioJSX] = useState(<></>);
    const [oprSumJSX, setOPRSumJSX] = useState(<></>);
    const [winChances, setWinChances] = useState(0.);

    useEffect(() => {
        async function set() {
            let blueOPRSum = 0;
            let blueRanks = [];
            let blueScores = [];
            for(let i = 0; i < nextMatch["blueAlliance"]["team_keys"].length; i++) {
                blueOPRSum += teamOPRLookup((await nextMatch)["blueAlliance"]["team_keys"][i], oprs);
                blueRanks.push(teamRankLookup((await nextMatch)["blueAlliance"]["team_keys"][i], allStatuses));
                blueScores.push(teamScoreLookup((await nextMatch)["blueAlliance"]["team_keys"][i], allStatuses));
            }
            let redOPRSum = 0;
            let redRanks = [];
            let redScores = [];
            for(let i = 0; i < nextMatch["redAlliance"]["team_keys"].length; i++) {
                redOPRSum += teamOPRLookup((await nextMatch)["redAlliance"]["team_keys"][i], oprs);
                redRanks.push(teamRankLookup((await nextMatch)["redAlliance"]["team_keys"][i], allStatuses));
                redScores.push(teamScoreLookup((await nextMatch)["redAlliance"]["team_keys"][i], allStatuses));
            }
            setOPRSumJSX(
                <p className="nextMatchHideable">
                    Total OPR Ratio (Blue:Red):{" "}
                    <span className="bluealliance">
                        {parseFloat(blueOPRSum).toFixed(0)}
                    </span>
                    :
                    <span className="redalliance">
                        {parseFloat(redOPRSum).toFixed(0)}
                    </span>
                </p>
            );
            setRankRatioJSX(
                <p className="nextMatchHideable">
                    Avg. Rank Ratio (Blue:Red):{" "}
                    <span className="bluealliance">
                        {parseFloat(simpleAvg(blueRanks)).toFixed(0)}
                    </span>
                    :
                    <span className="redalliance">
                        {parseFloat(simpleAvg(redRanks)).toFixed(0)}
                    </span>
                </p>
            );
            setScoreRatioJSX(
                <p className="nextMatchHideable">
                    Avg. Score Ratio (Blue:Red):{" "}
                    <span className="bluealliance">
                        {parseFloat(simpleAvg(blueScores)).toFixed(0)}
                    </span>
                    :
                    <span className="redalliance">
                        {parseFloat(simpleAvg(redScores)).toFixed(0)}
                    </span>
                </p>
            );
            setWinChances(getWinChances((await nextMatch)["allianceColor"], simpleAvg(redRanks), simpleAvg(blueRanks), simpleAvg(redScores), simpleAvg(blueScores), redOPRSum, blueOPRSum, Object.keys(allStatuses).length))
        }
        set();
    }, [nextMatch, allStatuses, oprs])
    return (
        <>
            <div id="nextpanel">
                <p class='nextpanel'>Current Match In Play: {compLevelToShortHumanReadable(currentMatch["comp_level"])} {matchNum}</p>
                <p class='nextpanel'>Next Match: {compLevelToShortHumanReadable(nextMatch["compLevel"])} {nextMatch["matchNumber"]}</p>
                <p className="nextpanel">Station: {nextMatch["allianceStation"]}</p>
                <p id="bumper" className={bumperClass}>{teamKey.replace("frc", "")}</p>
                {oprSumJSX}
                {rankRatioJSX}
                {scoreRatioJSX}
                <p>Win Chances: {winChances}%</p>
            </div>
        </>
    );
}