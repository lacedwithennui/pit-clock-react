import type { Events, MatchResults, MatchScores, Rankings } from "./types/first.ts";
import type { AllianceStationHumanReadable, CountdownObject, WLTRecordHumanReadable } from "./types/local.ts";
import type { BlueOnlyMatch, Match, OneOrMoreAlliancesMatch, RedOnlyMatch, Event, FullMatch } from "./types/nexus.ts";

/**
 * Creates a CountdownObject from the given match times, which come from the Nexus API.
 * @param currentTime The current system time (i.e. `new Date()`).
 * @param nextQueueTime The queue time of the next match.
 * @param nextOnDeckTime The on deck time of the next match.
 * @param nextOnFieldTime The on field time of the next match.
 * @returns A description and formatted time string for the match whose times are given.
 */
export function formatCountdown(currentTime: Date, nextQueueTime: Date, nextOnDeckTime: Date, nextOnFieldTime: Date): CountdownObject {
    const queueDifference = nextQueueTime.getTime() - currentTime.getTime();
    const onDeckDifference = nextOnDeckTime.getTime() - currentTime.getTime();
    const onFieldDifference = nextOnFieldTime.getTime() - currentTime.getTime();
    let difference = 0;
    let label = "On Field In:";
    let value = "0s";
    if(queueDifference > 0) {
        difference = queueDifference;
        label = "Queue In:";
    }
    else if(onDeckDifference > 0) {
        difference = onDeckDifference;
        label = "On Deck In:";
    }
    else if(onFieldDifference > 0) {
        difference = onFieldDifference;
        label = "On Field In:";
    }

    let seconds = Math.floor(difference / 1000);

    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;

    const minutes = Math.floor(seconds / 60);
    seconds %= 60;

    if(hours === 0 && minutes === 0) {
        value = `${seconds}s`;
    }
    else if(hours === 0) {
        value = `${minutes}m ${seconds}s`;
    }
    else {
        value = `${hours}h ${minutes}m ${seconds}s`;
    }

    return {
        countdownLabel: label,
        countdownValue: value
    };
}

/**
 * Sorts events by their start date's proximity to today.
 * @param events The EventsWrapper containing the list of events to sort.
 * @returns A new EventsWrapper with the sorted events inside.
 */
export function sortEvents(events: Events.EventsWrapper): Events.EventsWrapper {
    const now = new Date().getTime();
    return {
        Events: events.Events.toSorted((a, b) => {
            const distanceA = Math.abs(new Date(a.dateStart).getTime() - now);
            const distanceB = Math.abs(new Date(b.dateStart).getTime() - now);
            
            return distanceA - distanceB;
        })
    };
}

/**
 * @param match
 * @returns True if there is an array of blue teams in the match object.
 */
export function isBlueFilled(match: Match) {
    return match.hasOwnProperty("blueTeams") && (match as BlueOnlyMatch).blueTeams.length;
}

/**
 * @param match
 * @returns True if there is an array of red teams in the match object.
 */
export function isRedFilled(match: Match) {
    return match.hasOwnProperty("redTeams") && (match as RedOnlyMatch).redTeams.length;
}

/**
 * @param match
 * @returns True if there is both an array of blue teams and an array of red teams in the match object.
 */
export function isFilled(match: Match) {
    return isBlueFilled(match) && isRedFilled(match);
}

/**
 * @param match
 * @returns True if there is one and only one array of teams in the match object (i.e. `isBlueFilled XOR isRedFilled`).
 */
export function isSemiFilled(match: Match) {
    const blueFilled = isBlueFilled(match);
    const redFilled = isRedFilled(match);
    return (blueFilled || redFilled) && !(blueFilled && redFilled);
}

/**
 * Filters matches by whether the given team number is present in either list of teams participating in a given match.
 * @param teamNumber The team to filter by.
 * @param event The Nexus Event containing all matches.
 * @returns An array of OneOrMoreAlliancesMatches, all of which contain the team given in teamNumber.
 */
export function filterTeamMatches(teamNumber: number, event: Event): OneOrMoreAlliancesMatch[] {
    return event.matches.filter((match) => {
        if(isFilled(match)) {
            return (
                (match as FullMatch).redTeams.includes(teamNumber.toString()) ||
                (match as FullMatch).blueTeams.includes(teamNumber.toString())
            );
        }
        else if(isBlueFilled(match)) {
            return (match as BlueOnlyMatch).blueTeams.includes(teamNumber.toString());
        }
        else if(isRedFilled(match)) {
            return (match as RedOnlyMatch).redTeams.includes(teamNumber.toString());
        }
        return false;
    }) as OneOrMoreAlliancesMatch[];
}

/**
 * Gets the next match in the given list of matches where the status is not "On field",
 * or the last match in the given list if all matches are "On field".
 * @param matches The filtered list of matches that the team is participating in. Call
 *                {@link filterTeamMatches} to get an appropriate list.
 * @returns The next match that the team needs to queue for.
 */
export function getNextTeamMatch(matches: OneOrMoreAlliancesMatch[]): OneOrMoreAlliancesMatch {
    return matches.find((match) => match.status !== "On field") || matches.at(-1)!;
}

/**
 * Searches for the given team number in the lists of blue and red teams and returns a CSS className
 * containing the alliance the team is on.
 * @param teamNumber The team number to search for.
 * @param match The match to search in.
 * @returns "blueMatch", "redMatch", or an empty string depending on which alliance the teamNumber was found in.
 */
export function getTeamAllianceClassName(teamNumber: number, match: OneOrMoreAlliancesMatch): "blueMatch" | "redMatch" | "" {
    const allianceColor = getTeamAllianceColor(teamNumber, match);
    return allianceColor ? `${allianceColor}Match` : "";
}

/**
 * Searches for the given team number in the lists of blue and red teams and returns the alliance the team is on.
 * @param teamNumber The team number to search for.
 * @param match The match to search in.
 * @returns "blue", "red", or an empty string depending on which alliance the teamNumber was found in.
 */
export function getTeamAllianceColor(teamNumber: number, match: OneOrMoreAlliancesMatch): "blue" | "red" | "" {
    if(isBlueFilled(match) && (match as BlueOnlyMatch).blueTeams.includes(teamNumber.toString())) {
        return "blue";
    }
    else if(isRedFilled(match) && (match as RedOnlyMatch).redTeams.includes(teamNumber.toString())) {
        return "red";
    }
    return "";
}

/**
 * Gets a human-readable representation of the alliance station the given team is assigned to.
 * @param teamNumber The team number to search for.
 * @param match The match to search in.
 * @returns The human-readable representation of the team's alliance station (i.e. Blue 3), or "Not found".
 */
export function getTeamAllianceStation(teamNumber: number, match: OneOrMoreAlliancesMatch): AllianceStationHumanReadable | "Not found" {
    if(isBlueFilled(match)) {
        match = match as BlueOnlyMatch;
        for(let i = 0; i < match.blueTeams.length; i++) {
            if(match.blueTeams[i] === teamNumber.toString()) {
                return `Blue ${i + 1}` as AllianceStationHumanReadable;
            }
        }
    }
    if(isRedFilled(match)) {
        match = match as RedOnlyMatch;
        for(let i = 0; i < match.redTeams.length; i++) {
            if(match.redTeams[i] === teamNumber.toString()) {
                return `Red ${i + 1}` as AllianceStationHumanReadable;
            }
        }
    }
    return "Not found";
}

/**
 * Gets the last match in the given list of matches where the status is "On field",
 * or the first match in the given list if no matches are "On field".
 * @param matches The list of all matches at a given event, from the Nexus API.
 * @returns The current match being played at the event. This is the last match marked "On field".
 */
export function getCurrentEventMatch(matches: Match[]): Match {
    return matches.findLast((match) => match.status === "On field") || matches[0];
}

/**
 * Maps each team number to the team's rank for faster lookups.
 * @param rankings The full rankings object from the FIRST Events API.
 * @returns A map where keys are team numbers and values are ranks.
 */
export function getRankingsMap(rankings: Rankings.RankingsWrapper): Rankings.RankMap {
    const rankingsMap = new Map<number, number>();
    for(let ranking of rankings.Rankings) {
        rankingsMap.set(ranking.teamNumber, ranking.rank);
    }
    return rankingsMap;
}

/**
 * Gets the full ranking object for a given team.
 * @param teamNumber The team number to search for.
 * @param rankings The full rankings object from the FIRST Events API.
 * @returns One Ranking object from the FIRST Events API.
 */
export function getTeamRankingObject(teamNumber: number, rankings: Rankings.RankingsWrapper): Rankings.Ranking {
    for(let ranking of rankings.Rankings) {
        if(ranking.teamNumber === teamNumber) {
            return ranking;
        }
    }
    throw new Error(`Team "${teamNumber}" not found in rankings data.`);
}

/**
 * Formats the wins, losses, and ties from the ranking object as a human-readable string.
 * @param ranking One team's ranking object from the FIRST Events API.
 * @returns A string of wins, losses, and ties formatted as W-L-T (i.e. 9-2-0).
 */
export function getRecordString(ranking: Rankings.Ranking): WLTRecordHumanReadable {
    return `${ranking.wins}-${ranking.losses}-${ranking.ties}`;
}

/**
 * Returns the winning alliance of the given match from the match results endpoint of the FIRST Events API.
 * @param match A match from the match results endpoint of the FIRST Events API.
 * @returns "blue", "red", "tie", or undefined depending on which alliance scored higher in the match.
 */
export function getMatchWinner(match: MatchResults.Match): "blue" | "red" | "tie" | undefined {
    if(match.scoreBlueFinal && match.scoreRedFinal) {
        if(match.scoreBlueFinal === match.scoreRedFinal) {
            return "tie";
        }
        return match.scoreBlueFinal > match.scoreRedFinal ? "blue" : "red";
    }
    return;
}

/**
 * Returns the winning alliance of the given match from the match scores endpoint of the FIRST Events API.
 * @param match A match from the match scores endpoint of the FIRST Events API.
 * @returns "blue", "red", or "tie" depending on which alliance was marked as the winning alliance in the match.
 */
export function getMatchWinnerFromScore(match: MatchScores.Match): "blue" | "red" | "tie" {
    switch(match.winningAlliance) {
        case 1:
            return "red";
        case 2:
            return "blue";
        default:
            return "tie";
    }
}
