# About: #
This is a countdown clock for your competition pit. It will count down to FIRST's predicted time of your next match, using data from the Nexus API. The latest release can be found deployed at <https://clock.hpbelmont.com>. Notable features of this clock include:
* a countdown timer for your next match
* your full match schedule with predicted times, both alliances & their ranks, and what alliance color you are
* big "next match" panel that shows your bumper color and alliance position for your next match
* a list of all teams' ranks for the event in the sidebar
* the current/latest match being played
* auto refresh every 30 seconds to account for schedule changes

# How to use the pit clock: #
On the homepage (<https://clock.hpbelmont.com>), type in your team number and click "Search." This will search for events that your team is registered for this season, and you can navigate to the pit clock or rankings page for any of these events.

# How to set up a local instance: #
Install node.js, clone this project and navigate to the folder in a code editor of your choice. Rename `.env.example` to `.env.local`,
then fill in your Nexus API token, FIRST API username, and FIRST API token. Then you can simply run `npm i`, 
`npm run build`, and `serve -s build -l 3000` to start the local instance. You can open the page in any browser by navigating to 
`http://localhost:3000`.