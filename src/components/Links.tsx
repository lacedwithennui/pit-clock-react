import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";

export default function Links() {
    const params = useParams();
    const [cookies] = useCookies(["team-number"]);

    return (
        <div className="links">
            <div className="buttons">
                <a href="/">
                    <img src="/search-icon.svg" alt="search-icon" title="Back to event search" />
                </a>
                {params.teamNumber ? (
                    <a href={`/season/${params.season!}/event/${params.eventCode!}/rankings`}>
                        <img src="/graph-icon.svg" alt="graph-icon" title="See event rankings" />
                    </a>
                ) : cookies["team-number"] ? (
                    <a href={`/season/${params.season!}/event/${params.eventCode!}/team/${cookies["team-number"]}`}>
                        <img src="/clock-icon.svg" alt="clock-icon" title="See pit clock" />
                    </a>
                ) : ""}
            </div>
            <div className="info">
                <a href="https://clock.hpbelmont.com" target="_blank" rel="noreferrer">clock.hpbelmont.com</a>
                <a href="https://github.com/lacedwithennui/pit-clock-react" target="_blank" rel="noreferrer">github.com/lacedwithennui/pit-clock-react</a>

                {/* Per the license packaged with this repository, you may not remove or change the copyright notice. */}
                <p>Copyright Hazel Belmont, FRC 5587</p>
                {/* Per the license packaged with this repository, you may not remove or change the copyright notice. */}
            </div>
        </div>
    );
}
