import type { BlueFilledQueueMatch, FilledQueueMatch, FIRSTEventsObject, FIRSTMatchObject, FIRSTScoreMatchObject, PartiallyFilledQueueMatch, QueueEventObject, QueueMatchObject, RankingObject, RankingsObject, RankMap, RedFilledQueueMatch } from "./dataTypes.ts";

export function formatCountdown(currentTime: Date, nextQueueTime: Date, nextOnDeckTime: Date, nextOnFieldTime: Date): {countdownLabel: string, countdownValue: string} {
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

export function sortEvents(events: FIRSTEventsObject): FIRSTEventsObject {
    return {Events: events.Events.sort((a, b) => {
        const now = new Date();
        return (new Date(a.dateStart).getTime() - now.getTime()) - (new Date(b.dateStart).getTime() - now.getTime());
    })}
}

export function isBlueFilled(match: QueueMatchObject) {
    return match.hasOwnProperty("blueTeams") && (match as BlueFilledQueueMatch).blueTeams.length;
}

export function isRedFilled(match: QueueMatchObject) {
    return match.hasOwnProperty("redTeams") && (match as RedFilledQueueMatch).redTeams.length;
}

export function isFilled(match: QueueMatchObject) {
    return isBlueFilled(match) && isRedFilled(match);
}

export function isSemiFilled(match: QueueMatchObject) {
    const blueFilled = isBlueFilled(match);
    const redFilled = isRedFilled(match);
    return (blueFilled || redFilled) && !(blueFilled && redFilled);
}

export function filterTeamMatches(teamNumber: number, event: QueueEventObject): PartiallyFilledQueueMatch[] {
    return event.matches.filter((match) => {
        if(isFilled(match)) {
            return (match as FilledQueueMatch).redTeams.includes(teamNumber.toString()) || (match as FilledQueueMatch).blueTeams.includes(teamNumber.toString())
        }
        else if(isBlueFilled(match)) {
            return (match as BlueFilledQueueMatch).blueTeams.includes(teamNumber.toString());
        }
        else if(isRedFilled(match)) {
            return (match as RedFilledQueueMatch).redTeams.includes(teamNumber.toString());
        }
        return false;
    }) as PartiallyFilledQueueMatch[];
}

export function getNextTeamMatch(matches:PartiallyFilledQueueMatch[]):PartiallyFilledQueueMatch {
    return matches.find((match) => match.status !== "On field") || matches.at(-1)!;
}

export function getTeamAllianceClassName(teamNumber: number, match: PartiallyFilledQueueMatch): "blueMatch" | "redMatch" | "" {
    if(isBlueFilled(match) && (match as BlueFilledQueueMatch).blueTeams.includes(teamNumber.toString())) {
        return "blueMatch";
    }
    else if(isRedFilled(match) && (match as RedFilledQueueMatch).redTeams.includes(teamNumber.toString())) {
        return "redMatch"
    }
    return ""
}

export function getTeamAllianceColor(teamNumber: number, match: FilledQueueMatch): "Blue" | "Red" | "" {
    return match.blueTeams.includes(teamNumber.toString()) ? "Blue" : (match.redTeams.includes(teamNumber.toString()) ? "Red" : "");
}

export function getTeamAllianceStation(teamNumber: number, match: PartiallyFilledQueueMatch): string {
    if(isBlueFilled(match)) {
        match = match as BlueFilledQueueMatch;
        for(let i = 0; i < match.blueTeams.length; i++) {
            if(match.blueTeams[i] === teamNumber.toString()) {
                return `Blue ${i + 1}`;
            }
        }
    }
    if(isRedFilled(match)) {
        match = match as RedFilledQueueMatch;
        for(let i = 0; i < match.redTeams.length; i++) {
            if(match.redTeams[i] === teamNumber.toString()) {
                return `Red ${i + 1}`;
            }
        }
    }
    return "Not found";
}

export function getCurrentEventMatch(matches: QueueMatchObject[]): QueueMatchObject {
    return matches.findLast((match) => match.status === "On field") || matches[0];
}

export function getRankingsMap(rankings: RankingsObject): RankMap {
    const rankingsMap = new Map<number, number>();
    for(let ranking of rankings.Rankings) {
        rankingsMap.set(ranking.teamNumber, ranking.rank);
    }
    return rankingsMap;
}

export function getTeamRankingObject(teamNumber: number, rankings: RankingsObject): RankingObject {
    for(let ranking of rankings.Rankings) {
        if(ranking.teamNumber === teamNumber) {
            return ranking
        }
    }
    throw new Error(`Team "${teamNumber}" not found in rankings data.`);
}

export function getRecordString(ranking: RankingObject): string {
    return `${ranking.wins}-${ranking.losses}-${ranking.ties}`;
}

export function getMatchWinner(match: FIRSTMatchObject): "Blue" | "Red" | "Tie" | undefined {
    return match.scoreBlueFinal && match.scoreRedFinal ? match.scoreBlueFinal === match.scoreRedFinal ? "Tie" : (match.scoreBlueFinal > match.scoreRedFinal ? "Blue" : "Red") : undefined;
}

export function getMatchWinnerFromScore(match: FIRSTScoreMatchObject): "Blue" | "Red" | "Tie" {
    return match.winningAlliance === 1 ? "Red" : (match.winningAlliance === 2 ? "Blue" : "Tie");
}
