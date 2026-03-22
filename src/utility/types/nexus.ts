export type Times = {
    estimatedQueueTime: number;
    estimatedOnDeckTime: number;
    estimatedOnFieldTime: number;
    estimatedStartTime: number;
    actualQueueTime: number;
    actualOnDeckTime: number;
    actualOnFieldTime: number;
};
/** A match which has been scheduled but which has no teams assigned to it. */
export type NoAlliancesMatch = {
    label: string;
    status: string;
    times: Times;
};
/** A match which has been scheduled but which only has teams assigned to the blue alliance. */
export type BlueOnlyMatch = {
    label: string;
    status: string;
    blueTeams: string[];
    times: Times;
};
/** A match which has been scheduled but which only has teams assigned to the red alliance. */
export type RedOnlyMatch = {
    label: string;
    status: string;
    redTeams: string[];
    times: Times;
};
/** A match which has been scheduled but which only has teams assigned to either the blue or the red alliance. */
export type OneAllianceMatch = BlueOnlyMatch | RedOnlyMatch;
/** A match which has been scheduled and has teams assigned to both alliances. */
export type FullMatch = {
    label: string;
    status: string;
    redTeams: string[];
    blueTeams: string[];
    times: Times;
};
/** A match which has teams assigned to either the blue alliance, or the red alliance, or both. */
export type OneOrMoreAlliancesMatch = OneAllianceMatch | FullMatch;
/** A match which may contain no teams, or which contains teams on only one alliance, or which contains teams on both alliances. */
export type Match = NoAlliancesMatch | OneAllianceMatch | FullMatch;
export type Announcement = {
    id: string;
    postedTime: number;
    announcement: string;
};
export type PartsRequest = {
    id: string;
    postedTime: number;
    parts: string;
    requestedByTeam: string;
};
/** An object containing information about an event and all of its matches, exactly as returned by the Nexus API. */
export type Event = {
    eventKey: `${number}${string}`;
    dataAsOfTime: number;
    nowQueuing: string;
    matches: Match[];
    announcements: Announcement[];
    partsRequests: PartsRequest[];
};
