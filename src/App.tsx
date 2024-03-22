import React, { useEffect, useState } from "react";
import "./assets/stylesheets/shared.scss";
import "./assets/stylesheets/inputstyles.css";
import Nextpanel from "./components/Nextpanel.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Counter, {TimeClock} from "./components/Counter.tsx";
import VirtualKettering from "./components/VirtualKettering.tsx";
import { getCurrentEventMatch, getEventRanks, getNextTeamMatch, getTeamEventMatches, getTeamEventStatus, getEventOPRs } from "./components/tbaAPI.tsx";
import logo from "./assets/logo.png";

function App() {
    const [teamKey, setTeamKey] = useState("frc5587");
    const [eventKey, setEventKey] = useState("2024vaash");
    const [refreshIntervalMS, setRefreshInterval] = useState(15000)
    const [nextTeamMatch, setNextTeamMatch] = useState({});
    const [currentEventMatch, setCurrentEventMatch] = useState({});
    const [allStatuses, setAllStatuses] = useState({});
    const [teamStatus, setTeamStatus] = useState({});
    const [allMatches, setAllMatches] = useState([[{}]]);
    const [allOPRs, setAllOPRs] = useState({});
    const [promisesResolved, setPromisesResolved] = useState(0);
    const [hasFinishedFirstReload, setFinishedFirstReload] = useState(false);
    useEffect(() => {
      async function set() {
        let resolved = 0;
        setNextTeamMatch(await getNextTeamMatch(teamKey, eventKey).then((resolution) => {resolved ++; setPromisesResolved(resolved); return resolution}));
        setCurrentEventMatch(await getCurrentEventMatch(eventKey).then((resolution) => {resolved ++; setPromisesResolved(resolved); return resolution}));
        setAllStatuses(await getEventRanks(eventKey).then((resolution) => {resolved ++; setPromisesResolved(resolved); return resolution}));
        setTeamStatus(await getTeamEventStatus(teamKey, eventKey).then((resolution) => {resolved ++; setPromisesResolved(resolved); return resolution}));
        setAllMatches(await getTeamEventMatches(teamKey, eventKey).then((resolution) => {resolved ++; setPromisesResolved(resolved); return resolution}));
        setAllOPRs(await getEventOPRs(eventKey).then((resolution) => {resolved ++; setPromisesResolved(resolved); return resolution}));
        setFinishedFirstReload(true);
        console.log("has re-rendered");
      }
      set();
      const refreshInterval = setInterval(() => set(), refreshIntervalMS);
      console.log(promisesResolved)
      return () => clearInterval(refreshInterval);
    }, [teamKey, eventKey, refreshIntervalMS]);

    console.log(promisesResolved)
    return (promisesResolved < 6) ? <div></div> : (
        <>
            <div className="App">
                <Sidebar teamKey={teamKey} status={teamStatus} allStatuses={allStatuses} />
                <div id="centercontent">
                    <Counter nextMatch={nextTeamMatch} />
                    <VirtualKettering teamKey={teamKey} allMatches={allMatches} allStatuses={allStatuses} />
                    <TimeClock />
                </div>
                <Nextpanel teamKey={teamKey} currentMatch={currentEventMatch} nextMatch={nextTeamMatch} allStatuses={allStatuses} oprs={allOPRs} setTeamKey={setTeamKey} setEventKey={setEventKey} setRefreshInterval={setRefreshInterval} />
                <div id='copy'>
                    <p className='copy'>Event Key: {eventKey}</p>
                    <p className='copy'><a href='http://clock.hpbelmont.com' target="_blank" rel="noreferrer">clock.hpbelmont.com</a></p>
                    <p className='copy'><a href='https://github.com/lacedwithennui/pit-clock-react' target="_blank" rel="noreferrer">github.com/lacedwithennui/pit-clock-react</a></p>
                    <p className='copy'>Copyright Hazel Belmont, FRC 5587 Titan Robotics.</p>
                </div>
                <img src={logo} alt="FRC 5587 Titan Robotics Logo" />
            </div>
        </>
      );
}

export default App;
