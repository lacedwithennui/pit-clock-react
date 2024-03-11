import React, { useEffect, useState } from "react";
import "./assets/stylesheets/shared.scss";
import "./assets/stylesheets/inputstyles.css";
import Nextpanel from "./components/Nextpanel";
import Sidebar from "./components/Sidebar";
import Counter, {TimeClock} from "./components/Counter";
import VirtualKettering from "./components/VirtualKettering";
import { getCurrentEventMatch, getEventRanks, getNextTeamMatch, getTeamEventMatches, getTeamEventStatus, getEventOPRs } from "./components/tbaAPI";
import logo from "./assets/logo.png";

function App() {
    const [teamKey, setTeamKey] = useState("frc5587");
    const [eventKey, setEventKey] = useState("2024vaash");
    const [refreshIntervalMS, setRefreshInterval] = useState(120000)
    const [nextTeamMatch, setNextTeamMatch] = useState({});
    const [currentEventMatch, setCurrentEventMatch] = useState([]);
    const [allStatuses, setAllStatuses] = useState([]);
    const [teamStatus, setTeamStatus] = useState({});
    const [allMatches, setAllMatches] = useState([]);
    const [allOPRs, setAllOPRs] = useState({});
    useEffect(() => {
      async function set() {
        setNextTeamMatch(await getNextTeamMatch(teamKey, eventKey))
        setCurrentEventMatch(await getCurrentEventMatch(eventKey));
        setAllStatuses(await getEventRanks(eventKey));
        setTeamStatus(await getTeamEventStatus(teamKey, eventKey));
        setAllMatches(await getTeamEventMatches(teamKey, eventKey));
        setAllOPRs(await getEventOPRs(eventKey));
      }
      set();
      const refreshInterval = setInterval(() => set(), refreshIntervalMS);
      return () => clearInterval(refreshInterval);
    }, [teamKey, eventKey, refreshIntervalMS]);

  return (
    <>
        <div className="App">
            <Sidebar teamKey={teamKey} eventKey={eventKey} status={teamStatus} allStatuses={allStatuses} />
            <div id="centercontent">
                <Counter teamKey={teamKey} eventKey={eventKey} nextMatch={nextTeamMatch} />
                <VirtualKettering teamKey={teamKey} eventKey={eventKey} allMatches={allMatches} allStatuses={allStatuses} />
                <TimeClock />
            </div>
            <Nextpanel teamKey={teamKey} eventKey={eventKey} currentMatch={currentEventMatch} nextMatch={nextTeamMatch} allStatuses={allStatuses} oprs={allOPRs} setTeamKey={setTeamKey} setEventKey={setEventKey} setRefreshInterval={setRefreshInterval} />
            <div id='copy'>
                <p class='copy'>Event Key: {eventKey}</p>
                <p class='copy'><a href='http://clock.parkerdaletech.com' target="_blank" rel="noreferrer">clock.parkerdaletech.com</a></p>
                <p class='copy'><a href='https://github.com/lacedwithennui/pit-clock-react' target="_blank" rel="noreferrer">github.com/lacedwithennui/pit-clock-react</a></p>
                <p class='copy'>Copyright Hazel Belmont, FRC 5587 Titan Robotics.</p>
            </div>
            <img src={logo} alt="FRC 5587 Titan Robotics Logo" />
        </div>
    </>
  );
}

export default App;
