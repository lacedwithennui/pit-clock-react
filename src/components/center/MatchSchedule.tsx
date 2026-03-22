import { useParams } from "react-router-dom";
import { useMatchResults, useMatchScores } from "../../utility/api.ts";
import { type FilledQueueMatch, type FIRSTMatchObject, type FIRSTScoreMatchObject, type QueueMatchObject, type RankMap } from "../../utility/dataTypes.ts";
import { getMatchWinner, getMatchWinnerFromScore, getTeamAllianceColor } from "../../utility/util.ts";

export default function MatchSchedule({matches, rankMap}: {matches: FilledQueueMatch[], rankMap: RankMap}) {
    const params = useParams();
    const matchResultsQuery = useMatchResults(params.season!, params.eventCode!, +params.teamNumber!);
    const matchScoresQuery = useMatchScores(params.season!, params.eventCode!, +params.teamNumber!);

    function conditionalRender() {
        if(matchResultsQuery.data && matchResultsQuery.data.Matches.length) {
            console.log("Rendering wins and losses from results query");
            return matches.map((match) => (
                <MatchRow
                    key={match.label}
                    match={match}
                    teamNumber={+params.teamNumber!}
                    rankMap={rankMap}
                    resultsMatch={matchResultsQuery.data.Matches.find(
                        (queryMatch) =>
                            queryMatch.description === match.label ||
                            `${queryMatch.tournamentLevel} ${queryMatch.matchNumber}` === match.label ||
                            (queryMatch.description === "Final Tiebreaker" && match.label === "Final 3")
                    )}
                />
            ));
        }
        else if(matchScoresQuery.data && matchScoresQuery.data.MatchScores.length) {
            console.log("Rendering wins and losses from scores query");
            return matches.map((match) => (
                <MatchRow
                    key={match.label}
                    match={match}
                    teamNumber={+params.teamNumber!}
                    rankMap={rankMap}
                    scoresMatch={matchScoresQuery.data.MatchScores.find(
                        (queryMatch) => `${queryMatch.matchLevel} ${queryMatch.matchNumber}` === match.label
                    )}
                />
            ));
        }
        else {
            return matches.map((match) => <MatchRow key={match.label} match={match} teamNumber={+params.teamNumber!} rankMap={rankMap} />);
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

function MatchRow({match, teamNumber, rankMap, resultsMatch, scoresMatch}: {match: FilledQueueMatch, teamNumber: number, rankMap: RankMap, resultsMatch?: FIRSTMatchObject, scoresMatch?: FIRSTScoreMatchObject}) {
    let resultString = "";
    if(resultsMatch) {
        const matchWinner = getMatchWinner(resultsMatch);
        if(matchWinner === "Tie") {
            resultString = matchWinner;
        }
        else {
            resultString = getTeamAllianceColor(teamNumber!, match) === matchWinner ? "Win" : "Loss";
        }
    }
    else if(scoresMatch) {
        const matchWinner = getMatchWinnerFromScore(scoresMatch);
        if(matchWinner === "Tie") {
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
    )
}
