import tbaAuth from "../assets/tokens/tba-authtoken.json";

/**
 * Gets all matches from an event from The Blue Alliance API.
 * @param {String} eventKey the TBA event key for the request URL
 * @returns JSON data from The Blue Alliance containing 
 * every match and its data for a given event.
 */
export async function getEventMatches(eventKey) {
    try {
        let response = await fetch("https://www.thebluealliance.com/api/v3/event/"
                +eventKey+"/matches/simple?X-TBA-Auth-Key="+tbaAuth);
        let json = await response.json(); //testData
        let sorted = sortMatchesByTime(json);
        return sorted;
    } catch(error) {
        console.error("Error while getting TBA data from getEventMatches: " + error);
    }
}

/**
 * Gets all matches scheduled for a team at a given event from The Blue Alliance API.
 * @param {String} teamKey the TBA team key for the request URL
 * @param {String} eventKey the TBA event key for the request URL
 * @returns JSON data from The Blue Alliance containing 
 * every match and its data for a given team within an event.
 */
export async function getTeamEventMatches(teamKey, eventKey) {
    try {
        let response = await fetch("https://www.thebluealliance.com/api/v3/team/"+teamKey+"/event/"
                +eventKey+"/matches/simple?X-TBA-Auth-Key="+tbaAuth);
        // let response = await fetch("../assets/cheesy_data/tba2.json");
        // let response = await fetch("../assets/cheesy_data/tba3.json");
        let responseJSON = await response.json(); //testData2
        var sorted = sortMatchesByTime(responseJSON);
        return sorted;
    } catch(error) {
        console.error("Error while getting TBA data from getTeamEventMatches: " + error);
    }
}

/**
 * Gets "status" data from The Blue Alliance API including 
 * a team's record, rank, and average ranking points for a specified event
 * @param {String} teamKey the TBA team key for the request URL
 * @param {String} eventKey the TBA event key for the request URL
 * @returns TBA status data for a given team within a speficied event
 */
export async function getTeamEventStatus(teamKey, eventKey) {
    try {
        let response = await fetch("https://www.thebluealliance.com/api/v3/team/"+teamKey+"/event/"
                +eventKey+"/status?X-TBA-Auth-Key="+tbaAuth);
        let responseJSON = await response.json();
        
        return ({
            "rank": (await responseJSON)["qual"]["ranking"]["rank"],
            "recordString": (await responseJSON)["qual"]["ranking"]["record"]["wins"] + "-" + (await responseJSON)["qual"]["ranking"]["record"]["losses"] + "-" + (await responseJSON)["qual"]["ranking"]["record"]["ties"],
            "averageRP": (await responseJSON)["qual"]["ranking"]["sort_orders"][0]
        });
    } catch(error) {
        console.error("Error while getting TBA data from getTeamEventStatus: " + error);
    }
}

/**
 * Sorts an input array of TBA matches by the inner `predicted_time` key within the matches.
 * @param {Dictionary} input the dictionary to sort
 * @returns the sorted dictionary
 */
export async function sortMatchesByTime(input) {
    let receivedInput = input;
    let qm, ef, qf, sf, f;
    qm = []; ef = []; qf = []; sf = []; f = [];
    let all = [qm, ef, qf, sf, f];
    for(let i = 0; i < receivedInput.length; i++) {
        switch(receivedInput[i]["comp_level"]) {
            case "qm":
                qm.push(receivedInput[i]);
                break;
            case "ef":
                ef.push(receivedInput[i]);
                break;
            case "qf":
                qf.push(receivedInput[i]);
                break;
            case "sf":
                sf.push(receivedInput[i]);
                break;
            case "f":
                f.push(receivedInput[i]);
                break;
            default:
                qf.push(receivedInput[i]);
                console.warn("Match type not found for " + receivedInput[i]);
                break;
        }
    }
    for(let i = 0; i < all.length; i++) {
        all[i].sort((a, b) => a["predicted_time"] - b["predicted_time"]);
    }
    return all;
}

/**
 * Gets the current match being played of a given event
 * @param {String} eventKey the TBA event key for the request URL
 * @returns the TBA match JSON array of the current match
 */
export async function getCurrentEventMatch(eventKey) {
    try {
        let allEventMatches = await getEventMatches(eventKey);
        var currentMatch;
        for(let i = 0; i < allEventMatches.length; i++) {
            if(allEventMatches[i].length !== 0) {
                for(let ii = 0; ii < allEventMatches[i].length; ii++) {
                    if(allEventMatches[i][ii]["winning_alliance"] !== ""
                            || ii === allEventMatches[i].length+1) {
                        currentMatch = allEventMatches[i][ii];
                    }
                }
            }
        }
        return currentMatch;
    } catch(error) {
        console.warn("Error getting current event match: " + error);
    }
}

/**
 * @param {String} teamKey the TBA team key for the request URL
 * @param {String} eventKey the TBA event key for the request URL
 * @returns the next match that a team will play for a given event
 */
export async function getNextTeamMatch(teamKey, eventKey) {
    let allTeamMatches = await getTeamEventMatches(teamKey, eventKey);
    let nextMatch;
    for(let i = 0; i < allTeamMatches.length; i++) {
        let matchGroup = allTeamMatches[i].reverse()
        for(let j = 0; j < matchGroup.length; j++) {
            let match = matchGroup[j]
            if(match["predicted_time"] >= new Date().getTime() / 1000) {
                nextMatch = match;
            }
        }
    }
    if(typeof nextMatch === "undefined" || nextMatch === null) {
        if(allTeamMatches.length !== 0) {
            nextMatch = allTeamMatches[0][0];
        }
    }

    let custom = {
        "matchNumber": nextMatch["match_number"],
        "allianceColor": nextMatch["alliances"]["red"]["team_keys"].includes(teamKey) ? "Red" : "Blue",
        "allianceStation": (nextMatch["alliances"]["red"]["team_keys"].includes(teamKey) ? "Red " : "Blue ") + (nextMatch["alliances"]["red"]["team_keys"].indexOf(teamKey) !== null ? nextMatch["alliances"]["red"]["team_keys"].indexOf(teamKey) + 1 : nextMatch["alliances"]["blue"]["team_keys"].indexOf(teamKey) + 1), // which station??
        "bumperClass": nextMatch["alliances"]["red"]["team_keys"].includes(teamKey) ? "redbg" : "bluebg",
        "predictedTime": nextMatch["predicted_time"]
    }
    return custom;
}

export async function getEventRanks(eventKey) {
    let response = await fetch("https://www.thebluealliance.com/api/v3/event/" + eventKey + "/teams/statuses?X-TBA-Auth-Key=" + tbaAuth)
    let json = await response.json();
    return (await json);
}