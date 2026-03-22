import { useParams } from "react-router-dom";
import { useMatchResults, useMatchScores } from "../../utility/api.ts";
import { getMatchWinner, getMatchWinnerFromScore, getTeamAllianceColor, isBlueFilled, isFilled, isRedFilled, isSemiFilled } from "../../utility/util.ts";
import type { MatchResults, MatchScores, Rankings } from "../../utility/types/first.ts";
import type { BlueOnlyMatch, FullMatch, OneAllianceMatch, OneOrMoreAlliancesMatch, RedOnlyMatch } from "../../utility/types/nexus.ts";

export default function MatchSchedule({matches, rankMap}: {matches: OneOrMoreAlliancesMatch[], rankMap: Rankings.RankMap}) {
    const params = useParams();
    const matchResultsQuery = useMatchResults(params.season!, params.eventCode!, +params.teamNumber!);
    const matchScoresQuery = useMatchScores(params.season!, params.eventCode!, +params.teamNumber!);

    function mapOneMatch(match: OneOrMoreAlliancesMatch, resultsMatch?: MatchResults.Match, scoresMatch?: MatchScores.Match) {
        if(isFilled(match)) {
            return (
                <MatchRow
                    key={match.label}
                    match={match as FullMatch}
                    teamNumber={+params.teamNumber!}
                    rankMap={rankMap}
                    resultsMatch={resultsMatch}
                    scoresMatch={scoresMatch}
                />
            );
        }
        else if(isSemiFilled(match)) {
            return (
                <PartialMatchRow
                    key={match.label}
                    match={match as FullMatch}
                    teamNumber={+params.teamNumber!}
                    rankMap={rankMap}
                />
            );
        }
        return;
    }

    function conditionalRender() {
        if(matchResultsQuery.data && matchResultsQuery.data.Matches.length) {
            return matches.map((match) => {
                const resultsMatch = matchResultsQuery.data.Matches.find(
                    (queryMatch) =>
                        queryMatch.description === match.label ||
                        `${queryMatch.tournamentLevel} ${queryMatch.matchNumber}` === match.label ||
                        (queryMatch.description === "Final Tiebreaker" && match.label === "Final 3")
                );
                return mapOneMatch(match, resultsMatch);
            });
        }
        else if(matchScoresQuery.data && matchScoresQuery.data.MatchScores.length) {
            return matches.map((match) => {
                const scoresMatch = matchScoresQuery.data.MatchScores.find(
                    (queryMatch) => `${queryMatch.matchLevel} ${queryMatch.matchNumber}` === match.label
                );
                return mapOneMatch(match, undefined, scoresMatch);
            });
        }
        else {
            return matches.map((match) => mapOneMatch(match));
        }
    }

    return (
        <div className="matchSchedule">
            <table>
                <thead>
                    <tr>
                        <th>Match</th>
                        <th>Blue 1</th>
                        <th>Blue 2</th>
                        <th>Blue 3</th>
                        <th>Red 1</th>
                        <th>Red 2</th>
                        <th>Red 3</th>
                        <th>Scheduled Time</th>
                    </tr>
                </thead>
                <tbody>
                    {conditionalRender()}
                </tbody>
            </table>
        </div>
    );
}

function PartialMatchRow({match, teamNumber, rankMap}: {match: OneAllianceMatch, teamNumber: number, rankMap: Rankings.RankMap}) {
    if(isBlueFilled(match)) {
        match = match as BlueOnlyMatch;
        return (
            <tr>
                <td>{match.label}</td>
                <td className={+match.blueTeams[0] === teamNumber ? "blueMatch" : ""}>
                    <span className="teamNumber">{match.blueTeams[0]}</span>
                    <span className="teamRank">{rankMap.get(+match.blueTeams[0]) ? "Rank: " + rankMap.get(+match.blueTeams[0]) : ""}</span>
                </td>
                <td className={+match.blueTeams[1] === teamNumber ? "blueMatch" : ""}>
                    <span className="teamNumber">{match.blueTeams[1]}</span>
                    <span className="teamRank">{rankMap.get(+match.blueTeams[1]) ? "Rank: " + rankMap.get(+match.blueTeams[1]) : ""}</span>
                </td>
                <td className={+match.blueTeams[2] === teamNumber ? "blueMatch" : ""}>
                    <span className="teamNumber">{match.blueTeams[2]}</span>
                    <span className="teamRank">{rankMap.get(+match.blueTeams[2]) ? "Rank: " + rankMap.get(+match.blueTeams[2]) : ""}</span>
                </td>
                <td colSpan={3}>
                    No opponents yet...
                </td>
                <td>
                    {new Date(match.times.estimatedStartTime).toLocaleString("en-US", {
                        weekday: "short",
                        hour: "numeric",
                        minute: "2-digit"
                    })}
                </td>
            </tr>
        );
    }
    else if(isRedFilled(match)) {
        match = match as RedOnlyMatch;
        return (
            <tr>
                <td>{match.label}</td>
                <td colSpan={3}>
                    No opponents yet...
                </td>
                <td className={+match.redTeams[0] === teamNumber ? "redMatch" : ""}>
                    <span className="teamNumber">{match.redTeams[0]}</span>
                    <span className="teamRank">{rankMap.get(+match.redTeams[0]) ? "Rank: " + rankMap.get(+match.redTeams[0]) : ""}</span>
                </td>
                <td className={+match.redTeams[1] === teamNumber ? "redMatch" : ""}>
                    <span className="teamNumber">{match.redTeams[1]}</span>
                    <span className="teamRank">{rankMap.get(+match.redTeams[1]) ? "Rank: " + rankMap.get(+match.redTeams[1]) : ""}</span>
                </td>
                <td className={+match.redTeams[2] === teamNumber ? "redMatch" : ""}>
                    <span className="teamNumber">{match.redTeams[2]}</span>
                    <span className="teamRank">{rankMap.get(+match.redTeams[2]) ? "Rank: " + rankMap.get(+match.redTeams[2]) : ""}</span>
                </td>
                <td>
                    {new Date(match.times.estimatedStartTime).toLocaleString("en-US", {
                        weekday: "short",
                        hour: "numeric",
                        minute: "2-digit"
                    })}
                </td>
            </tr>
        );
    }
}

function MatchRow({match, teamNumber, rankMap, resultsMatch, scoresMatch}: {match: FullMatch, teamNumber: number, rankMap: Rankings.RankMap, resultsMatch?: MatchResults.Match, scoresMatch?: MatchScores.Match}) {
    let resultString = "";
    if(resultsMatch) {
        const matchWinner = getMatchWinner(resultsMatch);
        if(matchWinner && matchWinner === "tie") {
            resultString = matchWinner;
        }
        else if(matchWinner) {
            resultString = getTeamAllianceColor(teamNumber!, match) === matchWinner ? "Win" : "Loss";
        }
    }
    else if(scoresMatch) {
        const matchWinner = getMatchWinnerFromScore(scoresMatch);
        if(matchWinner === "tie") {
            resultString = matchWinner;
        }
        else {
            resultString = getTeamAllianceColor(teamNumber!, match) === matchWinner ? "Win" : "Loss";
        }
    }
    return (
        <tr>
            <td>{match.label}</td>
            <td className={+match.blueTeams[0] === teamNumber ? "blueMatch" : ""}>
                <span className="teamNumber">{match.blueTeams[0]}</span>
                <span className="teamRank">{rankMap.get(+match.blueTeams[0]) ? "Rank: " + rankMap.get(+match.blueTeams[0]) : ""}</span>
            </td>
            <td className={+match.blueTeams[1] === teamNumber ? "blueMatch" : ""}>
                <span className="teamNumber">{match.blueTeams[1]}</span>
                <span className="teamRank">{rankMap.get(+match.blueTeams[1]) ? "Rank: " + rankMap.get(+match.blueTeams[1]) : ""}</span>
            </td>
            <td className={+match.blueTeams[2] === teamNumber ? "blueMatch" : ""}>
                <span className="teamNumber">{match.blueTeams[2]}</span>
                <span className="teamRank">{rankMap.get(+match.blueTeams[2]) ? "Rank: " + rankMap.get(+match.blueTeams[2]) : ""}</span>
            </td>
            <td className={+match.redTeams[0] === teamNumber ? "redMatch" : ""}>
                <span className="teamNumber">{match.redTeams[0]}</span>
                <span className="teamRank">{rankMap.get(+match.redTeams[0]) ? "Rank: " + rankMap.get(+match.redTeams[0]) : ""}</span>
            </td>
            <td className={+match.redTeams[1] === teamNumber ? "redMatch" : ""}>
                <span className="teamNumber">{match.redTeams[1]}</span>
                <span className="teamRank">{rankMap.get(+match.redTeams[1]) ? "Rank: " + rankMap.get(+match.redTeams[1]) : ""}</span>
            </td>
            <td className={+match.redTeams[2] === teamNumber ? "redMatch" : ""}>
                <span className="teamNumber">{match.redTeams[2]}</span>
                <span className="teamRank">{rankMap.get(+match.redTeams[2]) ? "Rank: " + rankMap.get(+match.redTeams[2]) : ""}</span>
            </td>
            <td>
                {resultString || new Date(match.times.estimatedStartTime).toLocaleString("en-US", {
                    weekday: "short",
                    hour: "numeric",
                    minute: "2-digit"
                })}
            </td>
        </tr>
    );
}
