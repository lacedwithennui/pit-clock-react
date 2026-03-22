import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRankings } from "../../utility/api.ts";
import { getTeamRankingObject } from "../../utility/util.ts";
import AllRankings from "../AllRankings.tsx";
import { useError } from "../ErrorProvider.tsx";
import TeamRanking from "./TeamRanking.tsx";
import "./LeftSidebar.css";

export default function LeftSidebar() {
    const errorContext = useError();
    const params = useParams();
    const teamNumber = +params.teamNumber!;
    const rankingsQuery = useRankings(params.season!, params.eventCode!);
    const [error, setError] = useState("");

    useEffect(() => {
        if(rankingsQuery.error || error) {
            errorContext.showError(rankingsQuery.error? rankingsQuery.error.message : error);
        }
    }, [rankingsQuery.error, error, errorContext]);
    
    function conditionalRender() {
        if(rankingsQuery.isLoading) {
            return <p className="message">Loading...</p>;
        }
        else if(rankingsQuery.error) {
            return <p className="message">Error getting rankings.</p>;
        }
        else if(rankingsQuery.data?.Rankings.length === 0) {
            return <p className="message">No ranking data has been posted yet.</p>;
        }
        else {
            try {
                const teamRankingObject = getTeamRankingObject(teamNumber, rankingsQuery.data!);

                return (
                    <>
                        <TeamRanking teamRanking={teamRankingObject}></TeamRanking>
                        <AllRankings rankings={rankingsQuery.data!} highlightTeamNumber={teamNumber}/>
                    </>
                );
            }
            catch(error) {
                if(!error) {
                    setError(`Could not find ranking info for team ${teamNumber}`);
                }
                return <p className="message">Error getting ranking info for team {teamNumber}</p>;
            }
        }
    }

    return (
        <div className="leftSidebar">
            {conditionalRender()}
        </div>
    );
}
