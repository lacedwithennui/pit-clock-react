import { useState } from "react";
import { useEvents } from "../utility/api.ts";
import { useError } from "../components/ErrorContext.tsx";
import "./Landing.css";

export default function Landing() {
    const [inputValue, setInputValue] = useState("");
    const [submittedTeam, setSubmittedTeam] = useState("");

    const currentYear = new Date().getFullYear().toString();
    const errorContext = useError();
    const eventsQuery = useEvents(currentYear, +submittedTeam);

    function conditionalRender() {
        if(eventsQuery.isLoading) {
            return <p className="message">Loading...</p>
        }
        else if(eventsQuery.error) {
            errorContext.showError(eventsQuery.error.message);
            return <p className="message">Error getting events.</p>
        }
        else if(!eventsQuery.data) {
            return <p className="message">Enter a team number to search for events.</p>
        }
        else if(eventsQuery.data!.Events.length === 0) {
            return <p className="message">No events were found for team {submittedTeam}.</p>
        }
        else {
            return (eventsQuery.data!.Events.map((firstEvent) => {
                return (
                    <div className="firstEvent" key={firstEvent.code}>
                        <div>
                            <h3>{firstEvent.name}</h3>
                            <p>{new Date(firstEvent.dateStart).toLocaleDateString("en-US")}-{new Date(firstEvent.dateEnd).toLocaleDateString("en-US")}</p>
                        </div>
                        <div>
                            <a href={`/season/${currentYear}/event/${firstEvent.code}/team/${submittedTeam}`}>Pit Clock</a>
                            <a href={`/season/${currentYear}/event/${firstEvent.code}/rankings`}>Rankings</a>
                        </div>
                    </div>
                )
            }))
        }
    }

    return (
        <div className="landing">
            <div className="searchBox">
                <h2>Search for events with your team number:</h2>
                <input 
                    type="text" 
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="5587" 
                />
                <button onClick={() => setSubmittedTeam(inputValue)}>Search</button>
            </div>

            <div className="results">
                {conditionalRender()}
            </div>
        </div>
    );
}