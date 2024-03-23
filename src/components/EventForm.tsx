import React from "react";
import Cookies from "js-cookie";

export default function EventForm({setTeamKey, setEventKey, setRefreshInterval} : {setTeamKey: Function, setEventKey: Function, setRefreshInterval: Function}) {
    window.onload = () => {
        console.log(Cookies.get("teamKey"))
        if(document.getElementsByTagName("form")[0].style.display === "none" && Cookies.get("teamKey") === undefined) {
            toggleSettings();
        }
    };
    return (
        <>
            <button id="settingsToggle" onClick={() => toggleSettings()}><p>Open Settings</p></button>
            <form action="success.php" style={{display: "none"}} onSubmit={(event) => {
                    event.preventDefault();
                    toggleSettings();
                    let teamKey = ((event.target as HTMLElement).querySelector("#team") as HTMLInputElement)!.value.includes("frc") ? ((event.target as HTMLElement).querySelector("#team") as HTMLInputElement)!.value : "frc" + ((event.target as HTMLElement).querySelector("#team") as HTMLInputElement)!.value;
                    let eventKey = ((event.target as HTMLElement).querySelector("#event") as HTMLInputElement)!.value;
                    let refresh = parseFloat(((event.target as HTMLElement).querySelector("#refresh") as HTMLInputElement)!.value) * 60000;
                    setTeamKey(teamKey);
                    setEventKey(eventKey);
                    setRefreshInterval(refresh);
                    Cookies.set("teamKey", teamKey, {expires: 6});
                    Cookies.set("eventKey", eventKey, {expires: 6});
                    Cookies.set("refresh", refresh.toString(), {expires: 6});
                }
            }>
                <fieldset id="field">
                    <legend>Input your event information.</legend>
                    <p>Team Key: <input id="team" type="text" name="team_key" /></p>
                    <p>Event Key: <input id="event" type="text" name="event_key" /></p>
                    <p><input className="inputButtons" id="advanced" type="button" name="advanced" value="Advanced Options" onClick={() => toggleOptions()} /></p>
                    <div id="options" style={{display: "none"}}>
                        <p>Refresh Interval (minutes): <input id="refresh" type="number" name="refresh" step="any" defaultValue={2} /></p>
                    </div>
                    <input className="inputButtons" type="submit" value="Enter" />
                </fieldset>
            </form>
        </>
    );
}

export function toggleSettings() {
    document.getElementsByTagName("form")[0].style.display = document.getElementsByTagName("form")[0].style.display === "none" ? "flex" : "none";
    document.getElementById("centercontent")!.style.display = document.getElementById("centercontent")!.style.display === "none" ? "flex" : "none";
    document.getElementById("sidebar")!.style.display = document.getElementById("sidebar")!.style.display === "none" ? "block" : "none";
    document.getElementById("nextpanel")!.style.display = document.getElementById("nextpanel")!.style.display === "none" ? "flex" : "none";
    document.getElementById("settingsToggle")!.style.display = document.getElementById("settingsToggle")!.style.display === "none" ? "flex" : "none";
}

function toggleOptions() {
    document.getElementById("options")!.style.display = document.getElementById("options")!.style.display === "none" ? "block" : "none";
}