import { useQuery } from "@tanstack/react-query";
import type {EventObject, RankingsObject} from "./dataTypes.ts";

const NEXUS_AUTH_TOKEN = import.meta.env.VITE_NEXUS_AUTH_TOKEN;
const FIRST_USERNAME = import.meta.env.VITE_FIRST_USERNAME;
const FIRST_AUTH_TOKEN = import.meta.env.VITE_FIRST_AUTH_TOKEN;
const NEXUS_BASE_ADDRESS = "https://frc.nexus/api/v1";
const FIRST_BASE_ADDRESS = "https://frc-api.firstinspires.org/v3.0";

function getEventNexus(season: string, eventCode: string): Promise<EventObject> {
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

function getRankingsFIRST(season: string, eventCode: string): Promise<RankingsObject> {
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
            throw new Error(`A server error occurred when requesting the event schedule from Nexus.`);
        }
    );
}

export function useEvent(season: string, eventCode: string) {
    return useQuery({queryKey: ["getEventNexus"], queryFn: () => getEventNexus(season, eventCode)});
}

export function useRankings(season: string, eventCode: string) {
    return useQuery({queryKey: ["getRankingsFIRST"], queryFn: () => getRankingsFIRST(season, eventCode), refetchOnWindowFocus: false, refetchInterval: 30000});
}
