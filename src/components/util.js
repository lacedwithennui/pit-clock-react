export function compLevelToHumanReadable(compLevel) {
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

export function compLevelToShortHumanReadable(compLevel) {
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

export function teamRankLookup(teamKey, allStatuses) {
    return allStatuses[teamKey]["qual"]["ranking"]["rank"];
}

export function teamScoreLookup(teamKey, allStatuses) {
    return allStatuses[teamKey]["qual"]["ranking"]["sort_orders"][2];
}

export function teamOPRLookup(teamKey, oprs) {
    console.log(oprs)
    return oprs["oprs"][teamKey];
}

export function simpleAvg(numbers) {
    let sum = 0;
    for(let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum / numbers.length;
}

export function getWinChances(ourAlliance, avgRedRank, avgBlueRank, avgRedScore, avgBlueScore, redOPRSum, blueOPRSum, totalTeams) {
    let blueChancesRank = ((((totalTeams - avgBlueRank) / totalTeams) - (totalTeams - avgRedRank) / totalTeams) + 0.5) * 100;
    let redChancesRank = (((totalTeams - avgRedRank) / totalTeams) - ((totalTeams - avgBlueRank) / totalTeams) + 0.5) * 100;
    let blueChancesScore = (avgBlueScore / (avgRedScore + avgBlueScore)) * 100;
    let redChancesScore = (avgRedScore / (avgRedScore + avgBlueScore)) * 100;
    let blueChancesOPR = (blueOPRSum / (redOPRSum + blueOPRSum)) * 100;;
    let redChancesOPR = (redOPRSum / (redOPRSum + blueOPRSum)) * 100;
    let blueChances = (blueChancesRank * 0.1) + (blueChancesScore * 0.2) + (blueChancesOPR * 0.7)
    let redChances = (redChancesRank * 0.1) + (redChancesScore * 0.2) + (redChancesOPR * 0.7)
    console.log("Our Chances Rank: " + (ourAlliance === "Blue" ? blueChancesRank : redChancesRank))
    console.log("Our Chances Score: " + (ourAlliance === "Blue" ? blueChancesScore : redChancesScore))
    return parseFloat(ourAlliance === "Blue" ? blueChances : redChances).toFixed(2);
}