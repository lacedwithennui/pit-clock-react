import { useQuery } from "@tanstack/react-query";
import type { Events, MatchResults, MatchScores, Rankings } from "./types/first.ts";
import type { Event } from "./types/nexus.ts";

const NEXUS_AUTH_TOKEN = import.meta.env.VITE_NEXUS_AUTH_TOKEN;
const FIRST_USERNAME = import.meta.env.VITE_FIRST_USERNAME;
const FIRST_AUTH_TOKEN = import.meta.env.VITE_FIRST_AUTH_TOKEN;
const NEXUS_BASE_ADDRESS = "https://frc.nexus/api/v1";
const FIRST_BASE_ADDRESS = "https://frc-api.firstinspires.org/v3.0";

/**
 * @param season The competition season to request events from (i.e. 2026).
 * @param teamNumber The team number to get events for (i.e. 5587).
 * @returns An object containing an array of FRC competition events from the FIRST Events API.
 */
function getEventsFIRST(season: string, teamNumber: number): Promise<Events.EventsWrapper> {
    return fetch(`${FIRST_BASE_ADDRESS}/${season}/events?teamNumber=${teamNumber}`, {
        headers: {
            "Authorization": `Basic ${btoa(`${FIRST_USERNAME}:${FIRST_AUTH_TOKEN}`)}`
        }
    }).then(
        (response) => {
            if(response.ok) {
                return response.json()
            }
            else if(response.status === 400) {
                throw new Error(`Malformed request when requesting events from FIRST. Make sure the season "${season}" is correct.`);
            }
            else if(response.status === 401) {
                throw new Error(`Authentication error returned when requesting event rankings from FIRST.`);
            }
            throw new Error(`A server error occurred when requesting event rankings from FIRST.`);
        }
    );
}

/**
 * The season and eventCode will be concatenated (i.e. 2026vaale) to create an eventKey to request the event from Nexus.
 * @param season The competition season to request (i.e. 2026).
 * @param eventCode The event code to request (i.e. vaale), from the FRC Events API or The Blue Alliance. Case insensitive.
 * @returns An Event object containing all queueing matches from the Nexus API.
 */
function getEventNexus(season: string, eventCode: string): Promise<Event> {
    return fetch(`${NEXUS_BASE_ADDRESS}/event/${season}${eventCode}`, {
        headers: {
            "Nexus-Api-Key": NEXUS_AUTH_TOKEN
        }
    }).then(
        (response) => {
            if(response.ok) {
                return response.json();
            }
            else if(response.status === 404) {
                throw new Error(`Event key "${season}${eventCode}" not found when requesting the event schedule from Nexus.`);
            }
            else if(response.status === 401 || response.status === 403) {
                throw new Error(`Authentication error returned when requesting the event schedule from Nexus.`);
            }
            throw new Error(`A server error occurred when requesting the event schedule from Nexus.`);
        }
    );
}

/**
 * @param season The competition season to request (i.e. 2026).
 * @param eventCode The event code to request (i.e. vaale), from the FRC Events API or The Blue Alliance. Case insensitive.
 * @returns An object containing an array of all ranking information for teams at an event (not just ranks themselves) from the FIRST Events API.
 */
function getRankingsFIRST(season: string, eventCode: string): Promise<Rankings.RankingsWrapper> {
    return fetch(`${FIRST_BASE_ADDRESS}/${season}/rankings/${eventCode}`, {
        headers: {
            "Authorization": `Basic ${btoa(`${FIRST_USERNAME}:${FIRST_AUTH_TOKEN}`)}`
        }
    }).then(
        (response) => {
            if(response.ok) {
                return response.json();
            }
            else if(response.status === 400) {
                throw new Error(`Malformed request when requesting event rankings from FIRST. Make sure the season "${season}" is correct.`);
            }
            else if(response.status === 404) {
                throw new Error(`Event code "${eventCode}" not found when requesting event rankings from FIRST.`);
            }
            else if(response.status === 401) {
                throw new Error(`Authentication error returned when requesting event rankings from FIRST.`);
            }
            throw new Error(`A server error occurred when requesting event rankings from FIRST.`);
        }
    );
}

/**
 * @param season The competition season to request (i.e. 2026).
 * @param eventCode The event code to request (i.e. vaale), from the FRC Events API or The Blue Alliance. Case insensitive.
 * @param teamNumber The team number to filter by (i.e. 5587).
 * @returns An object containing an array of match results from the FIRST Events API.
 */
function getMatchResultsFIRST(season: string, eventCode: string, teamNumber: number): Promise<MatchResults.MatchesWrapper> {
    return fetch(`${FIRST_BASE_ADDRESS}/${season}/matches/${eventCode}?teamNumber=${teamNumber}`, {
        headers: {
            "Authorization": `Basic ${btoa(`${FIRST_USERNAME}:${FIRST_AUTH_TOKEN}`)}`
        }
    }).then(
        (response) => {
            if(response.ok) {
                return response.json();
            }
            else if(response.status === 400) {
                throw new Error(`Malformed request when requesting match results from FIRST. Make sure the season "${season}" is correct.`);
            }
            else if(response.status === 404) {
                throw new Error(`Event code "${eventCode}" not found when requesting match results from FIRST.`);
            }
            else if(response.status === 401) {
                throw new Error(`Authentication error returned when requesting match results from FIRST.`);
            }
            throw new Error(`A server error occurred when requesting match results from FIRST.`);
        }
    );
}

/**
 * @param season The competition season to request (i.e. 2026).
 * @param eventCode The event code to request (i.e. vaale), from the FRC Events API or The Blue Alliance. Case insensitive.
 * @param teamNumber The team number to filter by (i.e. 5587).
 * @returns An object containing an array of match scores from the FIRST Events API.
 */
function getMatchScoresFIRST(season: string, eventCode: string, teamNumber: number): Promise<MatchScores.MatchesWrapper> {
    return fetch(`${FIRST_BASE_ADDRESS}/${season}/scores/${eventCode}/qualification?teamNumber=${teamNumber}`, {
        headers: {
            "Authorization": `Basic ${btoa(`${FIRST_USERNAME}:${FIRST_AUTH_TOKEN}`)}`
        }
    }).then(
        (response) => {
            if(response.ok) {
                return response.json();
            }
            else if(response.status === 400) {
                throw new Error(`Malformed request when requesting match scores from FIRST. Make sure the season "${season}" is correct.`);
            }
            else if(response.status === 404) {
                throw new Error(`Event code "${eventCode}" not found when requesting match scores from FIRST.`);
            }
            else if(response.status === 401) {
                throw new Error(`Authentication error returned when requesting match scores from FIRST.`);
            }
            throw new Error(`A server error occurred when requesting match scores from FIRST.`);
        }
    );
}

/**
 * @param season The competition season to request events from (i.e. 2026).
 * @param teamNumber The team number to get events for (i.e. 5587).
 * @returns A react-query object whose data is an object containing an array of FRC competition events from the FIRST Events API.
 */
export function useEvents(season: string, teamNumber: number) {
    return useQuery({queryKey: ["getEventsFIRST", season, teamNumber], queryFn: () => getEventsFIRST(season, teamNumber), refetchOnWindowFocus: false, enabled: !!teamNumber});
}

/**
 * @param season The competition season to request (i.e. 2026).
 * @param eventCode The event code to request (i.e. vaale), from the FRC Events API or The Blue Alliance. Case insensitive.
 * @returns A react-query object whose data is an object containing all queueing matches from the Nexus API.
 */
export function useEvent(season: string, eventCode: string) {
    return useQuery({queryKey: ["getEventNexus"], queryFn: () => getEventNexus(season, eventCode), refetchOnWindowFocus: false, refetchInterval: 30000});
}

/**
 * @param season The competition season to request (i.e. 2026).
 * @param eventCode The event code to request (i.e. vaale), from the FRC Events API or The Blue Alliance. Case insensitive.
 * @returns A react-query object whose data is an object containing an array of all ranking information for teams at an event (not just ranks themselves) from the FIRST Events API.
 */
export function useRankings(season: string, eventCode: string) {
    return useQuery({queryKey: ["getRankingsFIRST"], queryFn: () => getRankingsFIRST(season, eventCode), refetchOnWindowFocus: false, refetchInterval: 30000});
}

/**
 * @param season The competition season to request (i.e. 2026).
 * @param eventCode The event code to request (i.e. vaale), from the FRC Events API or The Blue Alliance. Case insensitive.
 * @param teamNumber The team number to filter by (i.e. 5587).
 * @returns A react-query object whose data is an object containing an array of match results from the FIRST Events API.
 */
export function useMatchResults(season: string, eventCode: string, teamNumber: number) {
    return useQuery({queryKey: ["getMatchResultsFIRST"], queryFn: () => getMatchResultsFIRST(season, eventCode, teamNumber), refetchOnWindowFocus: false, refetchInterval: 30000});
}

/**
 * @param season The competition season to request (i.e. 2026).
 * @param eventCode The event code to request (i.e. vaale), from the FRC Events API or The Blue Alliance. Case insensitive.
 * @param teamNumber The team number to filter by (i.e. 5587).
 * @returns A react-query object whose data is an object containing an array of match scores from the FIRST Events API.
 */
export function useMatchScores(season: string, eventCode: string, teamNumber: number) {
    return useQuery({queryKey: ["getMatchScoresFIRST"], queryFn: () => getMatchScoresFIRST(season, eventCode, teamNumber), refetchOnWindowFocus: false, refetchInterval: 30000});
}
