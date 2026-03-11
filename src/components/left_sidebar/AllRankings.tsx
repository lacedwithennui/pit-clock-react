import type { RankingsObject } from "../../utility/dataTypes.ts";

export default function AllRankings({rankings, highlightTeamNumber}: {rankings: RankingsObject, highlightTeamNumber?: number}) {
    return (
        <div className="allRankings">
            {rankings.Rankings.map((ranking, index) => {
                return <p key={ranking.teamNumber} className={highlightTeamNumber === ranking.teamNumber ? (index <= rankings.Rankings.length / 3 ? "blueMatch" : "redMatch") : ""}>Rank {ranking.rank}: {ranking.teamNumber}</p>
            })}
        </div>
    );
}
