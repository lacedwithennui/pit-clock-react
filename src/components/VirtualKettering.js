import { useEffect, useState } from "react";
import { getEventRanks, getTeamEventMatches } from "./tbaAPI";
import { compLevelToHumanReadable } from "./util";

export default function VirtualKettering({teamKey, allMatches, allStatuses}) {
    return (
        <>
            <div id="ketteringWrapper">
                <table id="kettering">
                    <thead>
                        <th>Match</th>
                        <th>Blue 1</th>
                        <th>Blue 2</th>
                        <th>Blue 3</th>
                        <th>Red 1</th>
                        <th>Red 2</th>
                        <th>Red 3</th>
                        <th>Predicted Time</th>
                    </thead>
                    <tbody>
                    {
                        allMatches.map((matchGroup) => {
                            return matchGroup.map((match) => (
                                <>
                                    <tr>
                                        <td>{compLevelToHumanReadable(match["comp_level"]) + " " + (match["set_number"] === 1 ? match["match_number"] : match["set_number"])}</td>
                                        {
                                            makeTD(teamKey, match)
                                        }
                                    </tr>
                                    <tr>
                                        <td></td>
                                        {
                                            makeRankTD(match, allStatuses)
                                        }
                                    </tr>
                                </>
                        ))
                        })
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}

function makeTD(ourTeamKey, match) {
    let tds = [];
    for(let i = 0; i < 3; i++) {
        let teamKey = match["alliances"]["blue"]["team_keys"][i];
        tds.push(<td className={"tdBlue " + (teamKey === ourTeamKey ? "bluealliance" : "")}>{teamKey.replace("frc", "")}</td>)
    }
    for(let i = 0; i < 3; i++) {
        let teamKey = match["alliances"]["red"]["team_keys"][i];
        tds.push(<td className={"tdRed " + (teamKey === ourTeamKey ? "redalliance" : "")}>{teamKey.replace("frc", "")}</td>)
    }
    let ogDate = new Date(match["predicted_time"] * 1000);
    console.log(navigator.language)
    let dayString = new Intl.DateTimeFormat(navigator.language, {weekday: "short"}).format(ogDate)
    let timeString = ogDate.toLocaleTimeString(navigator.language);
    timeString = dayString + " " + timeString.split(":")[0] + ":" + timeString.split(":")[1] + " " + timeString.split(" ")[1];
    tds.push(<td>{timeString}</td>);
    return tds;
}

function makeRankTD(match, statuses) {
    let tds = [];
    console.log("STATUSES HERE!!!!!")
    console.log("STATUSES HERE!!!!!")
    console.log("STATUSES HERE!!!!!")
    console.log("STATUSES HERE!!!!!")
    console.log("STATUSES HERE!!!!!")
    console.log("STATUSES HERE!!!!!")
    console.log(statuses)
    for(let i = 0; i < 3; i++) {
        let teamKey = match["alliances"]["blue"]["team_keys"][i];
        console.log(statuses[teamKey])
        tds.push(<td class='rank'>Rank {statuses[teamKey]["qual"]["ranking"]["rank"]}</td>);
    }
    for(let i = 0; i < 3; i++) {
        let teamKey = match["alliances"]["red"]["team_keys"][i];
        tds.push(<td class='rank'>Rank {statuses[teamKey]["qual"]["ranking"]["rank"]}</td>);
    }
    return tds
}