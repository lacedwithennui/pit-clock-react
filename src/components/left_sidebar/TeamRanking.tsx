import type { Rankings } from "../../utility/types/first.ts";
import { getRecordString } from "../../utility/util.ts";

export default function TeamRanking({teamRanking}: {teamRanking: Rankings.Ranking}) {
    return (
        <div className="teamRanking">
            <p>Team {teamRanking.teamNumber} rank: {teamRanking.rank}</p>
            <p>Average RP: {teamRanking.sortOrder1}</p>
            <p>W-L-T Record: {getRecordString(teamRanking)}</p>
        </div>
    );
}
