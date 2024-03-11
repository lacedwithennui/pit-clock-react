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

# How to use the input screen: #
Put in your team number or team key (eg. 5587 or frc5587), and your event key. Your event key is part of the TBA link for your event (eg. 2024vaash). You can always come back to the input screen if you need to by clicking the link on the right-hand side of the main 
pit clock screen.

# How to set up a local instance: #
Install node.js, clone this project and navigate to the folder in a code editor of your choice. Then you can simply run `npm i`, 
`npm run build`, and `serve -s build -l 3000` to start the local instance. You can open the page in any browser by navigating to 
`http://localhost:3000`. I strongly advise against using a dev server with `npm run start` because of the error overlay that will 
show up when states are unset (before rendering finishes) unless you feel like going through the trouble to turn it off.