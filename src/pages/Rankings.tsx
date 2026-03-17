import { useParams } from "react-router-dom";
import { useRankings } from "../utility/api.ts";
import { useError } from "../components/ErrorContext.tsx";
import AllRankings from "../components/AllRankings.tsx";
import "./Rankings.css";
import Links from "../components/Links.tsx";
import { useEffect } from "react";

export default function Rankings() {
    const errorContext = useError();
    const params = useParams();
    const rankingsQuery = useRankings(params.season!, params.eventCode!);

    useEffect(() => {
        if(rankingsQuery.error) {
            errorContext.showError(rankingsQuery.error.message);
        }
    }, [rankingsQuery.error, errorContext])

    function conditionalRender() {
        if(rankingsQuery.isLoading) {
            return <p className="message">Loading...</p>
        }
        else if(rankingsQuery.error) {
            return <p className="message">Error getting rankings.</p>
        }
        else if(rankingsQuery.data?.Rankings.length === 0) {
            return <p className="message">No ranking data has been posted yet.</p>
        }
        else {
            return <AllRankings rankings={rankingsQuery.data!} detailView />
        }
    }

    return (
        <div className="rankings">
            {conditionalRender()}
            <Links />
        </div>
    );
}
