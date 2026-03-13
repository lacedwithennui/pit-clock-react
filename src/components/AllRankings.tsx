import type { RankingsObject } from "../utility/dataTypes.ts";
import { getRecordString } from "../utility/util.ts";

export default function AllRankings({rankings, detailView = false, highlightTeamNumber}: {rankings: RankingsObject, detailView?: boolean, highlightTeamNumber?: number}) {
    return (
        <div className={detailView ? "allRankings detailView" : "allRankings"}>
            {detailView
                ? rankings.Rankings.map((ranking) => {
                      return (
                        <div key={ranking.teamNumber}>
                            <p>Rank {ranking.rank}: {ranking.teamNumber}</p>
                            <p>RP: {ranking.sortOrder1}</p>
                            <p>W-L-T: {getRecordString(ranking)}</p>
                        </div>
                      );
                  })
                : rankings.Rankings.map((ranking, index) => {
                      return (
                          <p
                              key={ranking.teamNumber}
                              className={
                                  highlightTeamNumber === ranking.teamNumber
                                      ? index <= rankings.Rankings.length / 3
                                          ? "blueMatch"
                                          : "redMatch"
                                      : ""
                              }>
                              Rank {ranking.rank}: {ranking.teamNumber}
                          </p>
                      );
                  })}
        </div>
    );
}
