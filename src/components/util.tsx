/**
 * @param {string} compLevel The one- or two-character comp level from TBA
 * @returns {string} A long, human readable representation of the comp level
 */
export function compLevelToHumanReadable(compLevel: string): string {
    switch(compLevel) {
        case "qm":
            return "Qualifiers";
        case "ef":
            return "Eighths Finals";
        case "qf":
            return "Quarterfinals";
        case "sf":
            return "Semifinals";
        case "f":
            return "Finals";
        default:
            return "Not Specified";
    }
}

/**
 * 
 * @param {string} compLevel The one- or two-character comp level from TBA
 * @returns {string} A short, human readable representation of the comp level
 */
export function compLevelToShortHumanReadable(compLevel: string): string {
    switch(compLevel) {
        case "qm":
            return "Qual";
        case "ef":
            return "Eighths";
        case "qf":
            return "Quarters";
        case "sf":
            return "Semis";
        case "f":
            return "Finals";
        default:
            return "Not Specified";
    }
}

/**
 * @param {string} teamKey 
 * @param {object} allStatuses 
 * @returns {number} The rank of the requested team.
 */
export function teamRankLookup(teamKey: string, allStatuses: object): number {
    return (allStatuses[teamKey]["qual"]["ranking"]["rank"] === null || allStatuses[teamKey]["qual"]["ranking"]["rank"] === undefined) ? 0 : allStatuses[teamKey]["qual"]["ranking"]["rank"];
}

export function teamObjectRankLookup(teamStatus: object): number {
    return (teamStatus["qual"]["ranking"]["rank"] === null || teamStatus["qual"]["ranking"]["rank"] === undefined) ? 0 : teamStatus["qual"]["ranking"]["rank"];
}

/**
 * @param {string} teamKey 
 * @param {object} allStatuses 
 * @returns {number} The average score of the requested team.
 */
export function teamScoreLookup(teamKey: string, allStatuses: object): number {
    return allStatuses[teamKey]["qual"]["ranking"]["sort_orders"][2];
}

/**
 * @param {string} teamKey 
 * @param {object[]} oprs The entire OPRs response from TBA. Note: this is NOT simply the
 *                        array of OPRs within the OPRs response object.
 * @returns {number} The OPR of the requested team.
 */
export function teamOPRLookup(teamKey: string, oprs: object): number {
    return oprs["oprs"][teamKey];
}

/**
 * @param {number[]} numbers 
 * @returns {number} The mean of the numbers in the array.
 */
export function simpleAvg(numbers: number[]): number {
    let sum = 0;
    for(let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum / numbers.length;
}

/**
 * Returns the chances that our alliance will win the next match. This metric is calculated
 * on the average rank of all teams on each alliance, the average of the average match score 
 * for each team on each alliance, and the sum of OPRs from each team on the alliance.
 * @param {string} ourAlliance The alliance that we are on this match, capitalized, i.e. "Red" or "Blue"
 * @param {number} avgRedRank The average rank of all teams on the red alliance.
 * @param {number} avgBlueRank The average rank of all teams on the blue alliance.
 * @param {number} avgRedScore The average of the average match scores of all teams on the red alliance.
 * @param {number} avgBlueScore The average of the average match scores of all teams on the blue alliance.
 * @param {number} redOPRSum The sum of OPRs from all teams on the red alliance.
 * @param {number} blueOPRSum The sum of OPRs from all teams on the blue alliance.
 * @param {number} totalTeams The total number of teams at this event (i.e. the last possible rank).
 * @returns {number} A percent chance (0.0 to 100.0) that our alliance will win the next match where 50% represents
 *          an equal probability that the red alliance and blue alliance could win the match. Weighting - 
 *          Average rank: 10%. Average alliance score: 20%. OPR: 70%.
 */
export function getWinChances(ourAlliance: string, avgRedRank: number, avgBlueRank: number, avgRedScore: number, avgBlueScore: number, redOPRSum: number, blueOPRSum: number, totalTeams: number): number {
    let blueChancesRank = ((((((totalTeams - avgBlueRank) / totalTeams) - (totalTeams - avgRedRank) / totalTeams)) * 0.5) + 0.5) * 100;
    let redChancesRank = (((((totalTeams - avgRedRank) / totalTeams) - ((totalTeams - avgBlueRank) / totalTeams)) * 0.5) + 0.5) * 100;
    let blueChancesScore = (avgBlueScore / (avgRedScore + avgBlueScore)) * 100;
    let redChancesScore = (avgRedScore / (avgRedScore + avgBlueScore)) * 100;
    let blueChancesOPR = (blueOPRSum / (redOPRSum + blueOPRSum)) * 100;;
    let redChancesOPR = (redOPRSum / (redOPRSum + blueOPRSum)) * 100;
    let blueChances = (blueChancesRank * 0.1) + (blueChancesScore * 0.2) + (blueChancesOPR * 0.7)
    let redChances = (redChancesRank * 0.1) + (redChancesScore * 0.2) + (redChancesOPR * 0.7)
    return parseFloat((ourAlliance === "Blue" ? blueChances : redChances).toFixed(2));
}