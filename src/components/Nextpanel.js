export default function Nextpanel({teamKey, currentMatch, nextMatch}) {
    console.log("SB Current Match " + currentMatch);
    let matchNum = currentMatch["match_number"];
    let bumperClass = nextMatch["bumperClass"]
    console.log(matchNum);
    console.log(nextMatch)
    return (
        <>
            <div id="nextpanel">
                <p class='nextpanel'>Next Match: {nextMatch["matchNumber"]}</p>
                <p className="nextpanel">{nextMatch["allianceStation"]}</p>
                <p id="bumper" className={bumperClass}>{teamKey.replace("frc", "")}</p>
                <p class='nextpanel'>Current Match In Play: {matchNum}</p>
            </div>
        </>
    );
}