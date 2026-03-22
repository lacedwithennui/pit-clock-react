import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useError } from "../components/ErrorProvider.tsx";
import { useEvents } from "../utility/api.ts";
import { sortEvents } from "../utility/util.ts";
import "./Landing.css";

export default function Landing() {
    const [inputValue, setInputValue] = useState("");
    const [submittedTeam, setSubmittedTeam] = useState("");
    const [luckyMode, setLuckyMode] = useState(false);

    const currentYear = new Date().getFullYear().toString();
    const errorContext = useError();
    const eventsQuery = useEvents(currentYear, +submittedTeam);
    const [cookies, setCookies] = useCookies(["team-number"]);
    const navigate = useNavigate();

    useEffect(() => {
        if (luckyMode && eventsQuery.data && eventsQuery.data.Events.length > 0) {
            const today = new Date();

            const targetEvent = eventsQuery.data.Events.find(event => {
                const start = new Date(event.dateStart);
                const end = new Date(event.dateEnd);
                return today >= start && today <= end;
            });

            if(targetEvent) {
                navigate(`/season/${currentYear}/event/${targetEvent.code}/team/${submittedTeam}`);
                setLuckyMode(false);
            }
        }
    }, [luckyMode, eventsQuery.data, submittedTeam]);

    useEffect(() => {
        if(cookies["team-number"] && +inputValue !== +cookies["team-number"]) {
            setInputValue(cookies["team-number"]);
        }
    }, [cookies]);

    useEffect(() => {
        if(eventsQuery.error) {
            errorContext.showError(eventsQuery.error.message);
        }
    }, [eventsQuery.error, errorContext]);

    function handleSearch() {
        setLuckyMode(false);
        setSubmittedTeam(inputValue);
        setCookies("team-number", inputValue, {path: "/"});
    }

    function handleLucky() {
        setLuckyMode(true);
        setSubmittedTeam(inputValue);
        setCookies("team-number", inputValue, {path: "/"});
    }

    function conditionalRender() {
        if(eventsQuery.isLoading) {
            return <p className="message">Loading...</p>;
        }
        else if(eventsQuery.error) {
            return <p className="message">Error getting events.</p>;
        }
        else if(!eventsQuery.isFetched || !eventsQuery.data) {
            return <p className="message">Enter a team number to see results.</p>;
        }
        else if(eventsQuery.data!.Events.length === 0) {
            return <p className="message">No events were found for team {submittedTeam}.</p>;
        }
        else {
            return (
                <>
                    {luckyMode ? <p className="message">No events are scheduled for your team today.</p> : ""}
                    {sortEvents(eventsQuery.data!).Events.map((firstEvent) => {
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
                        );
                    })}
                </>
            );
        }
    }

    return (
        <div className="landing">
            <div className="search">
                <h2>Search for events with your team number:</h2>
                <div>
                    <div className="searchBox">
                        <input
                            name="team-number"
                            type="text" 
                            value={inputValue}
                            onKeyUp={(event) => {if(event.key === "Enter") {handleSearch()}}}
                            onChange={(event) => setInputValue(event.target.value)}
                            placeholder="5587" 
                        />
                        <button className="searchButton" onClick={handleSearch}><img src="/search-icon.svg" alt="search icon" /></button>
                    </div>
                    <button className="luckyButton" onClick={handleLucky}>I'm Feeling Lucky</button>
                </div>
            </div>

            <div className="results">
                {conditionalRender()}
            </div>
        </div>
    );
}