import React, { useEffect, useState } from "react";
import "./assets/stylesheets/shared.scss";
import "./assets/stylesheets/inputstyles.css";
import Nextpanel from "./components/Nextpanel.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Counter, {TimeClock} from "./components/Counter.tsx";
import VirtualKettering from "./components/VirtualKettering.tsx";
import { getCurrentEventMatch, getEventRanks, getNextTeamMatch, getTeamEventMatches, getTeamEventStatus, getEventOPRs, sortMatchesByTime, getEventRanksAxios, getTeamEventStatusAxios } from "./components/tbaAPI.tsx";
import logo from "./assets/logo.png";
import Cookies from "js-cookie";
import { useQuery } from "react-query";

function App() {
    let cookieTeamKey = Cookies.get("teamKey") !== undefined ? Cookies.get("teamKey")! : "frc5587";
    let cookieEventKey = Cookies.get("eventKey") !== undefined ? Cookies.get("eventKey")! : "2024vafal";
    const [teamKey, setTeamKey] = useState(cookieTeamKey);
    const [eventKey, setEventKey] = useState(cookieEventKey);
    const [refreshIntervalMS, setRefreshInterval] = useState(90000); // TODO: Cookie refresh interval
    const {
        data: nextTeamMatch,
        error: nextTeamMatchError,
        isLoading: nextTeamMatchLoading,
    } = useQuery("nextTeamMatch", () => getNextTeamMatch(teamKey, eventKey));
    const [currentEventMatch, setCurrentEventMatch] = useState({});
    const {
        data: allStatuses,
        error: allStatusesError,
        isLoading: allStatusesLoading,
    } = useQuery("allStatuses", () => getEventRanksAxios(eventKey));

    const {
        data: teamStatus,
        error: teamStatusError,
        isLoading: teamStatusLoading
    } = useQuery("teamStatus", () => getTeamEventStatusAxios(teamKey, eventKey));
    const [allMatches, setAllMatches] = useState([[{}]]);
    const [allOPRs, setAllOPRs] = useState({});
    const [promisesResolved, setPromisesResolved] = useState(0);

    useEffect(() => {
      async function set() {
        let resolved = 0;
        setCurrentEventMatch(await getCurrentEventMatch(eventKey).then((resolution) => {resolved ++; setPromisesResolved(resolved); return resolution}));
        setAllMatches(await getTeamEventMatches(teamKey, eventKey).then((resolution) => {resolved ++; setPromisesResolved(resolved); return resolution}));
        setAllOPRs(await getEventOPRs(eventKey).then((resolution) => {resolved ++; setPromisesResolved(resolved); return resolution}));
      }
      set();
      const refreshInterval = setInterval(() => set(), refreshIntervalMS);
      console.log(promisesResolved)
      return () => clearInterval(refreshInterval);
    }, [teamKey, eventKey, refreshIntervalMS]);

    console.log(promisesResolved)
    return (promisesResolved < 3) ? <div></div> : (
        <>
            <div className="App">
                <Sidebar teamKey={teamKey} status={teamStatus!} allStatuses={allStatuses!} />
                <div id="centercontent">
                    <Counter nextMatch={nextTeamMatch} />
                    <VirtualKettering teamKey={teamKey} allMatches={allMatches} allStatuses={allStatuses!} />
                    <TimeClock />
                </div>
                <Nextpanel teamKey={teamKey} currentMatch={currentEventMatch} nextMatch={nextTeamMatch!} allStatuses={allStatuses!} oprs={allOPRs} setTeamKey={setTeamKey} setEventKey={setEventKey} setRefreshInterval={setRefreshInterval} />
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
