import type { EventObject, MatchObject, RankingObject, RankingsObject, RankMap } from "./dataTypes.ts";

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

export function filterTeamMatches(teamNumber: number, event: EventObject): MatchObject[] {
    return event.matches.filter((match) => match.redTeams.includes(teamNumber.toString()) || match.blueTeams.includes(teamNumber.toString()));
}

export function getNextTeamMatch(matches: MatchObject[]): MatchObject {
    return matches.find((match) => match.status !== "On field") || matches.at(-1)!;
}

export function getTeamAllianceClassName(teamNumber: number, match: MatchObject): "blueMatch" | "redMatch" | "" {
    return match.blueTeams.includes(teamNumber.toString()) ? "blueMatch" : (match.redTeams.includes(teamNumber.toString()) ? "redMatch" : "");
}

export function getTeamAllianceStation(teamNumber: number, match: MatchObject): string {
    for(let i = 0; i < match.blueTeams.length; i++) {
        if(match.blueTeams[i] === teamNumber.toString()) {
            return `Blue ${i + 1}`;
        }
    }
    for(let i = 0; i < match.redTeams.length; i++) {
        if(match.redTeams[i] === teamNumber.toString()) {
            return `Red ${i + 1}`;
        }
    }
    return "Not found";
}

export function getCurrentEventMatch(matches: MatchObject[]): MatchObject {
    return matches.findLast((match) => match.status === "On field") || matches[0];
}

export function sortRankings(rankings: RankingsObject): RankingsObject {
    return {Rankings: rankings.Rankings.sort((a, b) => a.rank - b.rank)}
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
