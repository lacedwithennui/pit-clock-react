import type { RankingObject } from "../../utility/dataTypes.ts";
import { getRecordString } from "../../utility/util.ts";

export default function TeamRanking({teamRanking}: {teamRanking: RankingObject}) {
    return (
        <div className="teamRanking">
            <p>Team {teamRanking.teamNumber} rank: {teamRanking.rank}</p>
            <p>Average RP: {teamRanking.sortOrder1}</p>
            <p>W-L-T Record: {getRecordString(teamRanking)}</p>
        </div>
    );
}
