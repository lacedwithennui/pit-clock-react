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
export type UnFilledQueueMatch = {
    label: string;
    status: string;
    times: TimesObject;
};
export type BlueFilledQueueMatch = {
    label: string;
    status: string;
    blueTeams: string[];
    times: TimesObject;
};
export type RedFilledQueueMatch = {
    label: string;
    status: string;
    redTeams: string[];
    times: TimesObject;
};
export type SemiFilledQueueMatch = BlueFilledQueueMatch | RedFilledQueueMatch;
export type FilledQueueMatch = {
    label: string;
    status: string;
    redTeams: string[];
    blueTeams: string[];
    times: TimesObject;
};
export type PartiallyFilledQueueMatch = SemiFilledQueueMatch | FilledQueueMatch;
export type QueueMatchObject = UnFilledQueueMatch | PartiallyFilledQueueMatch;
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

/** Effective only in FRC Rebuilt. */
export type FIRSTScoreMatchHubScore = {
    autoCount: number;
    transitionCount: number;
    shift1Count: number;
    shift2Count: number;
    shift3Count: number;
    shift4Count: number;
    endgameCount: number;
    teleopCount: number;
    totalCount: number;
    uncounted: number;
    autoPoints: number;
    transitionPoints: number;
    shift1Points: number;
    shift2Points: number;
    shift3Points: number;
    shift4Points: number;
    endgamePoints: number;
    teleopPoints: number;
    totalPoints: number;
};
export type FIRSTScoreMatchAlliance = {
    alliance: string;
    autoTowerRobot1: string;
    endGameTowerRobot1: string;
    autoTowerRobot2: string;
    endGameTowerRobot2: string;
    autoTowerRobot3: string;
    endGameTowerRobot3: string;
    autoTowerPoints: number;
    totalAutoPoints: number;
    hubScore: FIRSTScoreMatchHubScore;
    totalTeleopPoints: number;
    endGameTowerPoints: number;
    totalTowerPoints: number;
    energizedAchieved: true;
    superchargedAchieved: false;
    traversalAchieved: false;
    minorFoulCount: number;
    majorFoulCount: number;
    g206Penalty: false;
    adjustPoints: number;
    foulPoints: number;
    rp: number;
    totalPoints: number;
    penalties: string;
};
export type FIRSTScoreMatchObject = {
    matchLevel: string;
    matchNumber: number;
    winningAlliance: number;
    tiebreaker: {
        tiebreakerType: string;
        tiebreakerReason: string;
    };
    energizedThreshold: number;
    superchargedThreshold: number;
    traversalThreshold: number;
    alliances: FIRSTScoreMatchAlliance[];
};
export type FIRSTScoreMatchesObject = {
    MatchScores: FIRSTScoreMatchObject[];
}
