import '../assets/stylesheets/shared.css';
import { getCurrentEventMatch } from './tbaAPI';

function Statusbar() {
    var currentMatch;
    (async () => {currentMatch = await getCurrentEventMatch("2022new")})();
    console.log("SB Current Match " + currentMatch);
    var matchNum = currentMatch["match_number"];
    console.log(matchNum);
    return (
        <div id="statusbar">
            {matchNum}
        </div>
    );
}
export default Statusbar;