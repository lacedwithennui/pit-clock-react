import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEvent, useRankings } from "../../utility/api.ts";
import { filterTeamMatches, getNextTeamMatch, getRankingsMap } from "../../utility/util.ts";
import { useError } from "../ErrorProvider.tsx";
import TimeClock from "../TimeClock.tsx";
import Countdown from "./Countdown.tsx";
import MatchSchedule from "./MatchSchedule.tsx";
import "./Center.css";

export default function Center() {
    const errorContext = useError();
    const params = useParams();
    const teamNumber = +params.teamNumber!;
    const eventQuery = useEvent(params.season!, params.eventCode!);
    const rankingsQuery = useRankings(params.season!, params.eventCode!);

    useEffect(() => {
        if(eventQuery.error) {
            errorContext.showError(eventQuery.error.message);
        }
    }, [eventQuery.error, errorContext]);

    function conditionalRender() {
        if(eventQuery.isLoading || !eventQuery.data) {
            return <p>Loading...</p>;
        }
        else if(eventQuery.error) {
            return (
                <>
                    <p className="message">Error getting match schedule.</p>
                    <TimeClock />
                </>
            );
        }
        else {
            const teamMatches = filterTeamMatches(teamNumber, eventQuery.data!);
            if(eventQuery.data!.matches.length === 0) {
                return (
                    <>
                        <p className="message">No schedule has been posted yet.</p>
                        <TimeClock />
                    </>
                );
            }
            else if(eventQuery.data!.matches.length !== 0 && teamMatches.length === 0) {
                return (
                    <>
                        <p className="message">A match schedule was found, but team {teamNumber} was not scheduled for any matches. Is your team number correct?</p>
                        <TimeClock />
                    </>
                );
            }
            const nextMatch = getNextTeamMatch(teamMatches);
            return (
                <>
                    <Countdown nextQueueTime={new Date(nextMatch.times.estimatedQueueTime)} nextOnDeckTime={new Date(nextMatch.times.estimatedOnDeckTime)} nextOnFieldTime={new Date(nextMatch.times.estimatedOnFieldTime)} />
                    <MatchSchedule matches={teamMatches} rankMap={getRankingsMap(rankingsQuery.data || {Rankings: []})} />
                </>
            );
        }
    }

    return (
        <>
            <div className="center" id="center">
                {conditionalRender()}
                <div id="balloonsAnchor"></div>
            </div>
        </>
    );
}
