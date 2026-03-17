import { useParams } from "react-router-dom";
import { useMatchResults } from "../../utility/api.ts";
import { type FIRSTMatchObject, type QueueMatchObject, type RankMap } from "../../utility/dataTypes.ts";
import { getMatchWinner, getTeamAllianceColor } from "../../utility/util.ts";

export default function MatchSchedule({matches, rankMap}: {matches: QueueMatchObject[], rankMap: RankMap}) {
    const params = useParams();
    const matchResultsQuery = useMatchResults(params.season!, params.eventCode!, +params.teamNumber!);

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
                    {matchResultsQuery.isLoading || !matchResultsQuery.data
                        ? matches.map((match) => {console.log(matchResultsQuery.isLoading); return (
                            
                            <MatchRow key={match.label} match={match} teamNumber={+params.teamNumber!} rankMap={rankMap} />
                        )})
                        : matches.map((match) => (
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
                        ))
                    }
                </tbody>
            </table>
            {/* <button onClick={() => queryClient.invalidateQueries({queryKey: ["getEventNexus"]})}>Refresh</button> */}
        </div>
    );
}

function MatchRow({match, teamNumber, rankMap, resultsMatch}: {match: QueueMatchObject, teamNumber: number, rankMap: RankMap, resultsMatch?: FIRSTMatchObject}) {
    let resultString = "";
    if(resultsMatch) {
        const matchWinner = getMatchWinner(resultsMatch);
        if(matchWinner === "Tie") {
            resultString = matchWinner;
        }
        else {
            resultString = getTeamAllianceColor(teamNumber!, match) === getMatchWinner(resultsMatch) ? "Win" : "Loss";
        }
    }
    return (
        <tr>
            <td>{match.label}</td>
            <td className={+match.blueTeams[0] === teamNumber ? "blueMatch" : ""}>
                <span className="teamNumber">{match.blueTeams[0]}</span>
                <span className="teamRank">{"Rank: " + (rankMap.get(+match.blueTeams[0]) || "?")}</span>
            </td>
            <td className={+match.blueTeams[1] === teamNumber ? "blueMatch" : ""}>
                <span className="teamNumber">{match.blueTeams[1]}</span>
                <span className="teamRank">{"Rank: " + (rankMap.get(+match.blueTeams[1]) || "?")}</span>
            </td>
            <td className={+match.blueTeams[2] === teamNumber ? "blueMatch" : ""}>
                <span className="teamNumber">{match.blueTeams[2]}</span>
                <span className="teamRank">{"Rank: " + (rankMap.get(+match.blueTeams[2]) || "?")}</span>
            </td>
            <td className={+match.redTeams[0] === teamNumber ? "redMatch" : ""}>
                <span className="teamNumber">{match.redTeams[0]}</span>
                <span className="teamRank">{"Rank: " + (rankMap.get(+match.redTeams[0]) || "?")}</span>
            </td>
            <td className={+match.redTeams[1] === teamNumber ? "redMatch" : ""}>
                <span className="teamNumber">{match.redTeams[1]}</span>
                <span className="teamRank">{"Rank: " + (rankMap.get(+match.redTeams[1]) || "?")}</span>
            </td>
            <td className={+match.redTeams[2] === teamNumber ? "redMatch" : ""}>
                <span className="teamNumber">{match.redTeams[2]}</span>
                <span className="teamRank">{"Rank: " + (rankMap.get(+match.redTeams[2]) || "?")}</span>
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
