import { useParams } from "react-router-dom";
import { useEvent } from "../../utility/api.ts";
import { filterTeamMatches, getCurrentEventMatch, getNextTeamMatch, getTeamAllianceClassName, getTeamAllianceStation } from "../../utility/util.ts";
import { useError } from "../ErrorContext.tsx";
import "./RightSidebar.css";
import TimeClock from "./TimeClock.tsx";

export default function RightSidebar() {
    const errorContext = useError();
    const params = useParams();
    const teamNumber = +params.teamNumber!;
    const eventQuery = useEvent(params.season!, params.eventCode!);
    
    function conditionalRender() {
        if(eventQuery.isLoading) {
            return <p className="message">Loading...</p>
        }
        else if(eventQuery.error) {
            errorContext.showError(eventQuery.error.message);
            return <p className="message">Error getting queueing information.</p>
        }
        else {
            const teamMatches = filterTeamMatches(teamNumber, eventQuery.data!);
            if(eventQuery.data!.matches.length === 0) {
                return (
                    <p className="message">No queueing information has been posted yet.</p>
                )
            }
            else if(eventQuery.data!.matches.length !== 0 && teamMatches.length === 0) {
                return (
                    <p className="message">A match schedule was found, but team {teamNumber} was not in the queueing information. Is your team number correct?</p>
                )
            }
            const nextMatch = getNextTeamMatch(teamMatches);
            return (
                <>
                    <p>Current Match in Play:<br />{getCurrentEventMatch(eventQuery.data!.matches!).label}</p>
                    <p>Your Next Match:<br />{nextMatch.label}</p>
                    <p>Alliance Station:<br />{getTeamAllianceStation(teamNumber, nextMatch)}</p>
                    <h1 className={`bumperPreview ${getTeamAllianceClassName(teamNumber, nextMatch)}`}>{teamNumber}</h1>
                    <TimeClock />
                </>
            )
        }
    }

    return (
        <div className="rightSidebar">
            {conditionalRender()}
        </div>
    );
}
