import React, { useEffect, useState } from "react";
import "./assets/stylesheets/shared.scss";
import Nextpanel from "./components/Nextpanel";
import Sidebar from "./components/Sidebar";
import Counter, {TimeClock} from "./components/Counter";
import VirtualKettering from "./components/VirtualKettering";
import { getCurrentEventMatch, getEventRanks, getNextTeamMatch, getTeamEventMatches, getTeamEventStatus } from "./components/tbaAPI";

function App() {
    // const [teamKey, setTeamKey] = useState("frc5587");
    // const [eventKey, setEventKey] = useState("2023hop");
    // useEffect(() => {
    //     setTeamKey("frc5587");
    //     setEventKey("2023hop")
    // }, []);
    const [nextTeamMatch, setNextTeamMatch] = useState({});
    const [currentEventMatch, setCurrentEventMatch] = useState([]);
    const [allStatuses, setAllStatuses] = useState([]);
    const [teamStatus, setTeamStatus] = useState({});
    const [allMatches, setAllMatches] = useState([]);
    useEffect(() => {
      async function set() {
        setNextTeamMatch(await getNextTeamMatch(teamKey, eventKey))
        setCurrentEventMatch(await getCurrentEventMatch(eventKey));
        setAllStatuses(await getEventRanks(eventKey));
        setTeamStatus(await getTeamEventStatus(teamKey, eventKey));
        setAllMatches(await getTeamEventMatches(teamKey, eventKey));
      }
      set();
      const refreshInterval = setInterval(() => set(), 60000);
      return () => clearInterval(refreshInterval);
    }, []);
    

    let teamKey = "frc5587";
    let eventKey = "2024vaash"
  return (
    <div className="App">
        <Sidebar teamKey={teamKey} eventKey={eventKey} status={teamStatus} allStatuses={allStatuses} />
      <div id="centercontent">
        <Counter teamKey={teamKey} eventKey={eventKey} nextMatch={nextTeamMatch} />
        <VirtualKettering teamKey={teamKey} eventKey={eventKey} allMatches={allMatches} allStatuses={allStatuses} />
        <TimeClock />
      </div>
      <Nextpanel teamKey={teamKey} eventKey={eventKey} currentMatch={currentEventMatch} nextMatch={nextTeamMatch} />
    </div>
  );
}

export default App;
