import tbaAuth from "../assets/tokens/tba-authtoken.json";

/**
 * Gets all matches from an event from The Blue Alliance API.
 * @param {String} eventKey the TBA event key for the request URL
 * @returns JSON data from The Blue Alliance containing 
 * every match and its data for a given event.
 */
function getEventMatches(eventKey) {
    try {
        // let response = fetch("https://www.thebluealliance.com/api/v3/event/"
        //         +eventKey+"/matches/simple?X-TBA-Auth-Key="+tbaAuth);
        let response = fetch("../assets/cheesy_data/tba.json").then(response => response.json());
        console.log(response);
        var sorted = sortMatchesByTime(response);
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
async function getTeamEventMatches(teamKey, eventKey) {
    try {
        let response = await fetch("https://www.thebluealliance.com/api/v3/team/"+teamKey+"/event/"
                +eventKey+"/matches/simple?X-TBA-Auth-Key="+tbaAuth);
        let responseJSON = await response.json();
        return responseJSON;
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
        return responseJSON;
    } catch(error) {
        console.error("Error while getting TBA data from getTeamEventStatus: " + error);
    }
}

/**
 * Sorts an input array of TBA matches by the inner `predicted_time` key within the matches.
 * @param {Dictionary} input the dictionary to sort
 * @returns the sorted dictionary
 */
function sortMatchesByTime(input) {
    let receivedInput = input;
    console.log("awaited input: " + input);
    console.log("recvd input from sorter " + receivedInput);
    var qm, ef, qf, sf, f;
    var all = [qm, ef, qf, sf, f];
    for(var i = 0; i < all.length; i++) {
        all[i] = [];
    }
    console.log("all empty from sorter: " + all);
    for(let i = 0; i < receivedInput.length; i++) {
        switch(receivedInput[i]["comp_level"]) {
            case "qm":
                all[0].push(receivedInput[i]);
                break;
            case "ef":
                all[1].push(receivedInput[i]);
                break;
            case "qf":
                all[2].push(receivedInput[i]);
                break;
            case "sf":
                all[3].push(receivedInput[i]);
                break;
            case "f":
                all[4].push(receivedInput[i]);
                break;
            default:
                qf.push(receivedInput[i]);
                console.log("match type not found for " + receivedInput[i]);
                break;
        }
    }
    console.log("all unsorted from sorter: " + all);
    // for(var matchType in all) {
        Object.keys(all)
            .map(value => value)
            .sort((a, b) => a["predicted_time"] - b["predicted_time"]);
    // }
    console.log("all sorted from sorter: " + all);
    return all;
}

/**
 * Gets the current match being played of a given event
 * @param {String} eventKey the TBA event key for the request URL
 * @returns the TBA match JSON array of the current match
 */
export function getCurrentEventMatch(eventKey) {
    try {
        let allEventMatches = getEventMatches(eventKey);
        console.log(allEventMatches);
        var currentMatch;
        for(let i = 0; i < allEventMatches.length; i++) {
            if(allEventMatches[i].length !== 0) {
                for(let ii = 0; ii < allEventMatches[i].length; ii++) {
                    if(allEventMatches[i][ii]["winning_alliance"] != ""
                            || ii == allEventMatches[i].length+1) {
                        currentMatch = allEventMatches[i][ii];
                    }
                }
            }
        }
        console.log("getEM match: " + currentMatch);
        return currentMatch;
    } catch(error) {
        console.log("Error getting current event match: " + error);
    }
}

/**
 * @param {String} teamKey the TBA team key for the request URL
 * @param {String} eventKey the TBA event key for the request URL
 * @returns the next match that a team will play for a given event
 */
export function getNextTeamMatch(teamKey, eventKey) {
    var allTeamMatches = getTeamEventMatches(teamKey, eventKey);
    var nextMatch;
    for(var matches in allTeamMatches) {
        for(var match in matches.reverse()) {
            if(match[5] > new Date().getUTCMinutes()) {
                nextMatch = match;
            }
        }
    }
    if(nextMatch.length === 0) {
        for(matches in allTeamMatches) {
            if(matches.length !== 0) {
                nextMatch = matches.at(-1);
            }
        }
    }
    return nextMatch;
}