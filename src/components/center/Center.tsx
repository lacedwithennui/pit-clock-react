import { useParams } from "react-router-dom";
import { useEvent, useRankings } from "../../utility/api.ts";
import { filterTeamMatches, getNextTeamMatch, getRankingsMap } from "../../utility/util.ts";
import { useError } from "../ErrorContext.tsx";
import TimeClock from "../TimeClock.tsx";
import "./Center.css";
import Countdown from "./Countdown.tsx";
import MatchSchedule from "./MatchSchedule.tsx";

export default function Center() {
    const errorContext = useError();
    const params = useParams();
    const teamNumber = +params.teamNumber!;
    const eventQuery = useEvent(params.season!, params.eventCode!);
    const rankingsQuery = useRankings(params.season!, params.eventCode!);

    function conditionalRender() {
        if(eventQuery.isLoading || !eventQuery.data) {
            return <p>Loading...</p>
        }
        else if(eventQuery.error) {
            errorContext.showError(eventQuery.error.message);
            return (
                <>
                    <p className="message">Error getting match schedule.</p>
                    <TimeClock />
                </>
            )
        }
        else {
            const teamMatches = filterTeamMatches(teamNumber, eventQuery.data!);
            if(eventQuery.data!.matches.length === 0) {
                return (
                    <>
                        <p className="message">No schedule has been posted yet.</p>
                        <TimeClock />
                    </>
                )
            }
            else if(eventQuery.data!.matches.length !== 0 && teamMatches.length === 0) {
                return (
                    <>
                        <p className="message">A match schedule was found, but team {teamNumber} was not scheduled for any matches. Is your team number correct?</p>
                        <TimeClock />
                    </>
                )
            }
            const nextMatch = getNextTeamMatch(teamMatches);
            return (
                <>
                    <Countdown nextQueueTime={new Date(nextMatch.times.estimatedQueueTime)} nextOnDeckTime={new Date(nextMatch.times.estimatedOnDeckTime)} nextOnFieldTime={new Date(nextMatch.times.estimatedOnFieldTime)} />
                    <MatchSchedule matches={teamMatches} rankMap={getRankingsMap(rankingsQuery.data || {Rankings: []})} />
                </>
            )
        }
    }

    return (
        <div className="center">
            {conditionalRender()}
        </div>
    );
}
