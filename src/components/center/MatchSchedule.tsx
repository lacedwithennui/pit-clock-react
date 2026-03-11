import { useParams } from "react-router-dom";
import type { MatchObject, RankMap } from "../../utility/dataTypes.ts";

export default function MatchSchedule({matches, rankMap}: {matches: MatchObject[], rankMap: RankMap}) {
    const params = useParams();

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
                    {matches.map((match) => (
                        <tr key={match.label}>
                            <td>{match.label}</td>
                            <td className={match.blueTeams[0] === params.teamNumber ? "blueMatch" : ""}>
                                <span className="teamNumber">{match.blueTeams[0]}</span>
                                <span className="teamRank">{"Rank: " + (rankMap.get(+match.blueTeams[0]) || "?")}</span>
                            </td>
                            <td className={match.blueTeams[1] === params.teamNumber ? "blueMatch" : ""}>
                                <span className="teamNumber">{match.blueTeams[1]}</span>
                                <span className="teamRank">{"Rank: " + (rankMap.get(+match.blueTeams[1]) || "?")}</span>
                            </td>
                            <td className={match.blueTeams[2] === params.teamNumber ? "blueMatch" : ""}>
                                <span className="teamNumber">{match.blueTeams[2]}</span>
                                <span className="teamRank">{"Rank: " + (rankMap.get(+match.blueTeams[2]) || "?")}</span>
                            </td>
                            <td className={match.redTeams[0] === params.teamNumber ? "redMatch" : ""}>
                                <span className="teamNumber">{match.redTeams[0]}</span>
                                <span className="teamRank">{"Rank: " + (rankMap.get(+match.redTeams[0]) || "?")}</span>
                            </td>
                            <td className={match.redTeams[1] === params.teamNumber ? "redMatch" : ""}>
                                <span className="teamNumber">{match.redTeams[1]}</span>
                                <span className="teamRank">{"Rank: " + (rankMap.get(+match.redTeams[1]) || "?")}</span>
                            </td>
                            <td className={match.redTeams[2] === params.teamNumber ? "redMatch" : ""}>
                                <span className="teamNumber">{match.redTeams[2]}</span>
                                <span className="teamRank">{"Rank: " + (rankMap.get(+match.redTeams[2]) || "?")}</span>
                            </td>
                            <td>
                                {new Date(match.times.estimatedStartTime).toLocaleString("en-US", {
                                    weekday: "short",
                                    hour: "numeric",
                                    minute: "2-digit"
                                })}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <button onClick={() => queryClient.invalidateQueries({queryKey: ["getEventNexus"]})}>Refresh</button> */}
        </div>
    );
}
