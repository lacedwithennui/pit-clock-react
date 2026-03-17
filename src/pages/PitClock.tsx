import { useParams } from "react-router-dom";
import Center from "../components/center/Center.tsx";
import LeftSidebar from "../components/left_sidebar/LeftSidebar.tsx";
import Links from "../components/Links.tsx";
import RightSidebar from "../components/right_sidebar/RightSidebar.tsx";
import "./PitClock.css";
import { useCookies } from "react-cookie";
import { useEffect } from "react";

export default function PitClock() {
    const [cookies, setCookies] = useCookies(["team-number"]);
    const params = useParams();

    useEffect(() => {
        if(cookies["team-number"] && +cookies["team-number"] !== +params.teamNumber!) {
            setCookies("team-number", params.teamNumber!, {path: "/"});
        }
    }, [cookies["team-number"], params.teamNumber])

    return (
        <div className="pitClock">
            <LeftSidebar />
            <Center />
            <RightSidebar />
            <Links />
        </div>
    );
}
