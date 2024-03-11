export default function EventForm({setTeamKey, setEventKey, setRefreshInterval}) {
    window.onload = () => toggleSettings();
    return (
        <>
            <button id="settingsToggle" onClick={() => toggleSettings()}><p>Open Settings</p></button>
            <form action="success.php" style={{display: "none"}} onSubmit={(event) => {
                    event.preventDefault();
                    toggleSettings()
                    setTeamKey(event.target.querySelector("#team").value.includes("frc") ? event.target.querySelector("#team").value : "frc" + event.target.querySelector("#team").value);
                    setEventKey(event.target.querySelector("#event").value);
                    setRefreshInterval(parseFloat(event.target.querySelector("#refresh").value) * 60000)
                }
            }>
                <fieldset id="field">
                    <legend>Input your event information.</legend>
                    <p>Team Key: <input id="team" type="text" name="team_key" /></p>
                    <p>Event Key: <input id="event" type="text" name="event_key" /></p>
                    <p><input className="inputButtons" id="advanced" type="button" name="advanced" value="Advanced Options" onClick={() => toggleOptions()} /></p>
                    <div id="options" style={{display: "none"}}>
                        <p>Refresh Interval (minutes): <input id="refresh" type="text" name="refresh" value="2" /></p>
                    </div>
                    <input className="inputButtons" type="submit" value="Enter" />
                </fieldset>
            </form>
        </>
    );
}

export function toggleSettings() {
    document.getElementsByTagName("form")[0].style.display = document.getElementsByTagName("form")[0].style.display === "none" ? "flex" : "none";
    document.getElementById("centercontent").style.display = document.getElementById("centercontent").style.display === "none" ? "flex" : "none";
    document.getElementById("sidebar").style.display = document.getElementById("sidebar").style.display === "none" ? "block" : "none";
    document.getElementById("nextpanel").style.display = document.getElementById("nextpanel").style.display === "none" ? "flex" : "none";
    document.getElementById("settingsToggle").style.display = document.getElementById("settingsToggle").style.display === "none" ? "flex" : "none";
}

function toggleOptions() {
    document.getElementById("options").style.display = document.getElementById("options").style.display === "none" ? "block" : "none";
}