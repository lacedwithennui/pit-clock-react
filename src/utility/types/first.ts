export namespace Events {
    /** A single FIRST API Event object. */
    export type Event = {
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
    /** An object containing a list of Events, exactly as it is returned by the FIRST Events API. */
    export type EventsWrapper = {
        Events: Event[];
    };
}

export namespace Rankings {
    /** A single FIRST API Ranking object. */
    export type Ranking = {
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
    /** An object containing a list of Rankings, exactly as it is returned by the FIRST Events API. */
    export type RankingsWrapper = {
        Rankings: Ranking[];
    };
    /** A map of `teamNumber: rank` for all teams at an event. */
    export type RankMap = Map<number, number>;
}

export namespace MatchResults {
    export type AllianceStation = `${"Blue" | "Red"}${1 | 2 | 3}`;
    export type Team = {
        teamNumber: number;
        station: AllianceStation;
        dq: false;
    };
    /** A single FIRST API Match Results object. */
    export type Match = {
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
        teams: Team[];
    };
    /** An object containing a list of Match Results objects, exactly as it is returned by the FIRST Events API. */
    export type MatchesWrapper = {
        Matches: Match[];
    };
}

export namespace MatchScores {
    /** Effective only in FRC Rebuilt. */
    export type HubScore = {
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
    export type Alliance = {
        alliance: string;
        autoTowerRobot1: string;
        endGameTowerRobot1: string;
        autoTowerRobot2: string;
        endGameTowerRobot2: string;
        autoTowerRobot3: string;
        endGameTowerRobot3: string;
        autoTowerPoints: number;
        totalAutoPoints: number;
        hubScore: HubScore;
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
    /** A single FIRST API Match Scores object. */
    export type Match = {
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
        alliances: Alliance[];
    };
    /** An object containing a list of Match Scores objects, exactly as it is returned by the FIRST Events API. */
    export type MatchesWrapper = {
        MatchScores: Match[];
    };
}
