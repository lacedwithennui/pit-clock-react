# About: #
This is a countdown clock for your competition pit. It will count down to FIRST's predicted time of your next match, using data from The Blue Alliance's APIv3. The latest release can be found deployed at <a href="https://clock.parkerdaletech.com" target="_blank">clock.parkerdaletech.com</a>. Notable features of this clock include:
* a list of all teams' ranks for the event in the sidebar
* your full match schedule with predicted times, both alliances & their ranks, and what alliance color you are
* a countdown timer for your next match
* big "next match" panel that shows your bumper color and alliance position for your next match
* the current/latest match being played
* win predictor based on OPR, the average match score of each alliance, and the average rank of each alliance
* auto refresh every minute to account for scheduling/delay changes, as well as to update the next match after your team has played
* automatic system time zone detection for traveling teams

# How to add credentials: #
Make a new json file called tba-authkey.json in the /src/assets/tokens folder that contains the following:
```
"tba_apiKey"
```
where tba_apiKey is your APIv3 key from The Blue Alliance.

# COMING SOON! How to use the input screen: #
## Disclaimer ##
This functionality has not yet been added to the react version of the app. For now, for public use, you must go into App.json in the
/src folder and change the teamKey and eventKey variables manually.


Put in your team number or team key (eg. 5587 or frc5587), and your event key. Your event key is part of the TBA link for your event (eg. 2023vaale). If the event has already started, you can check "Use Latest Event" and the program will find the event key for you. Note that this checkbox will not work if you have qualified for a future event that does not have a match schedule released yet. For example, if you are GaCo 1629, who qualified for the 2023 FIRST Championship by winning the Chairman's Award last year, you must manually put in an event key because your newest event will be the 2023 FIRST Championship.

# How to set up a local instance: #
Install node.js and run `npm i -g react-scripts` in the terminal. After that, clone this project and navigate to the folder in a code
editor of your choice. Open App.js and change the teamKey and eventKey variables to `frc(yourTeamNumberHere)` and `yourEventKeyHere`
(ex. `frc5587` and `2024vaash`). Then, in the terminal, navigate to the project's root folder and run `npm run start`.