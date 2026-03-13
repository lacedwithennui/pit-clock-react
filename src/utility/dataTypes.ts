export type FIRSTEventObject = {
    address: string;
    website: string;
    webcasts: string[];
    timezone: string;
    code: string;
    divisionCode: string;
    name: string;
    type: string;
    districtCode: string;
    venue: string;
    city: string;
    stateprov: string;
    country: string;
    dateStart: string;
    dateEnd: string;
};
export type FIRSTEventsObject = {
    Events: FIRSTEventObject[];
};

export type TimesObject = {
    estimatedQueueTime: number;
    estimatedOnDeckTime: number;
    estimatedOnFieldTime: number;
    estimatedStartTime: number;
    actualQueueTime: number;
    actualOnDeckTime: number;
    actualOnFieldTime: number;
};
export type QueueMatchObject = {
    label: string;
    status: string;
    redTeams: string[];
    blueTeams: string[];
    times: TimesObject;
};
export type AnnouncementObject = {
    id: string;
    postedTime: number;
    announcement: string;
};
export type PartsRequestObject = {
    id: string;
    postedTime: number;
    parts: string;
    requestedByTeam: string;
};
export type QueueEventObject = {
    eventKey: `${number}${string}`;
    dataAsOfTime: number;
    nowQueuing: string;
    matches: QueueMatchObject[];
    announcements: AnnouncementObject[];
    partsRequests: PartsRequestObject[];
};

export type RankingObject = {
    rank: number;
    teamNumber: number;
    sortOrder1: number;
    sortOrder2: number;
    sortOrder3: number;
    sortOrder4: number;
    sortOrder5: number;
    sortOrder6: number;
    wins: number;
    losses: number;
    ties: number;
    qualAverage: number;
    dq: number;
    matchesPlayed: number;
};
export type RankingsObject = {
    Rankings: RankingObject[];
};
export type RankMap = Map<number, number>;

export type FIRSTMatchTeamObject = {
    teamNumber: number;
    station: `${"Red" | "Blue"}${number}`;
    dq: false;
};
export type FIRSTMatchObject = {
    actualStartTime: string;
    tournamentLevel: string;
    postResultTime: string;
    description: string;
    matchNumber: number;
    scoreRedFinal: number;
    scoreRedFoul: number;
    scoreRedAuto: number;
    scoreBlueFinal: number;
    scoreBlueFoul: number;
    scoreBlueAuto: number;
    teams: FIRSTMatchTeamObject[];
};
export type FIRSTMatchesObject = {
    Matches: FIRSTMatchObject[]
}