import type { Rankings } from "../utility/types/first.ts";
import { getRecordString } from "../utility/util.ts";

export default function AllRankings({rankings, detailView = false, highlightTeamNumber}: {rankings: Rankings.RankingsWrapper, detailView?: boolean, highlightTeamNumber?: number}) {
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
                                      ? (index + 1) <= 16 // 8 alliance seeds + 8 first picks = highlight in blue if the rank is in the top 16
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
