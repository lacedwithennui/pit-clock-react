import Center from "../components/center/Center.tsx";
import LeftSidebar from "../components/left_sidebar/LeftSidebar.tsx";
import RightSidebar from "../components/right_sidebar/RightSidebar.tsx";
import "./PitClock.css";

export default function PitClock() {
    return (
        <div className="pitClock">
            <LeftSidebar />
            <Center />
            <RightSidebar />
        </div>
    );
}
