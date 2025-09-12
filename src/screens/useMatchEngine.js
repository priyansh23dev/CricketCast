import { useState, useEffect, useRef } from "react";

const TEAMS = {
  INDIA: {
    name: "India",
    players: {
      batsmen: ["R. Sharma", "V. Kohli", "S. Iyer", "R. Pant"],
      allrounder: ["H. Pandya"],
      bowlers: ["R. Jadeja", "J. Bumrah"]
    }
  },
  PAKISTAN: {
    name: "Pakistan",
    players: {
      batsmen: ["B. Azam", "M. Rizwan", "F. Zaman", "I. Ahmed"],
      allrounder: ["S. Khan"],
      bowlers: ["M. Nawaz", "A. Ali"]
    }
  }
};

const OVERS_PER_INNINGS = 3;
const BALLS_PER_OVER = 6;
const INNINGS_BREAK = 60;

const getRandomOutcome = () => {
  const outcomes = ["0", "1", "2", "3", "4", "6", "W"];
  return outcomes[Math.floor(Math.random() * outcomes.length)];
};

export default function useMatchEngine() {
  const [matchState, setMatchState] = useState(initMatch());
  const timerRef = useRef(null);

  useEffect(() => {
    if (matchState.finished) return;

    if (matchState.inBreak) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setMatchState(prev => {
            if (prev.breakTimeLeft <= 1) {
              clearInterval(timerRef.current);
              timerRef.current = null;
              return { ...prev, inBreak: false, innings: 2 };
            }
            return { ...prev, breakTimeLeft: prev.breakTimeLeft - 1 };
          });
        }, 1000);
      }
      return;
    }

    const interval = setInterval(() => {
      setMatchState(prev => generateNextBall(prev));
    }, 1600);

    return () => clearInterval(interval);
  }, [matchState.innings, matchState.inBreak, matchState.finished]);

  return matchState;
}

function initMatch() {
  return {
    innings: 1,
    inBreak: false,
    breakTimeLeft: INNINGS_BREAK,
    finished: false,
    result: null,
    events: [],
    teams: {
      India: initTeam(TEAMS.INDIA),
      Pakistan: initTeam(TEAMS.PAKISTAN)
    }
  };
}

function initTeam(def) {
  const battingOrder = [...def.players.batsmen, ...def.players.allrounder, ...def.players.bowlers];
  return {
    runs: 0,
    wickets: 0,
    balls: 0,
    battingOrder,
    striker: battingOrder[0],
    nonStriker: battingOrder[1],
    nextBatter: 2,
    bowlerIndex: 0,
    bowlers: def.players.bowlers,
    currentBowler: def.players.bowlers[0]
  };
}

// Helper to get cricket-style over.ball (0.1–0.6, 1.1–1.6)
function formatOverBall(totalBalls) {
  const over = Math.floor(totalBalls / BALLS_PER_OVER);
  let ball = totalBalls % BALLS_PER_OVER;
  ball = ball === 0 && totalBalls !== 0 ? BALLS_PER_OVER : ball; // show 6th ball as .6
  return { over, ball };
}

// Commentary pools for variety
const COMMENTARY = {
    dot: [
      "Dot ball! Tight line from {bowler}. The pressure keeps mounting on the batter.",
      "No run, pressure builds from {bowler}. Excellent control, keeping it simple yet effective.",
      "Defended well, good ball by {bowler}. The fielders applaud the discipline.",
      "Beaten! Excellent delivery from {bowler}. The bowler is asking serious questions here."
    ],
    single: [
      "Easy single taken by {striker}. Smart cricket, rotating the strike.",
      "Quick run! Good call from {striker}. Keeps the scoreboard ticking.",
      "Just a push for one by {striker}. Keeps the bowler thinking.",
      "Rotates the strike, single for {striker}. Partnerships are built this way."
    ],
    double: [
      "They come back for two! Nice running by {striker}. Good understanding between the batters.",
      "Good placement, two runs for {striker}. The fielders chase but can’t cut it down to one.",
      "Strong running between the wickets from {striker}. Fitness making a difference here.",
      "They steal a couple, well run by {striker}. The bowler looks a little frustrated."
    ],
    three: [
      "Excellent running, they pick up three! {striker} showing great awareness of the field.",
      "Good shot, fielded at the deep, three runs for {striker}. Brilliant effort to turn two into three.",
      "Hard running, they manage three. The crowd appreciates the hustle from {striker}.",
      "Brilliant fitness! Three runs taken by {striker}. Those legs will be burning now."
    ],
    four: [
      "FOUR! Cracked to the boundary by {striker}. Pure timing, no chance for the fielder.",
      "Lovely shot! Finds the gap, four runs for {striker}. That will relieve some pressure.",
      "Classy stroke, races away for four by {striker}. Picture-perfect execution.",
      "That’s timed beautifully! Boundary for {striker}. The crowd roars in approval!"
    ],
    six: [
      "SIX! What a strike from {striker}! The ball sails deep into the stands.",
      "Huge hit! That’s out of the park by {striker}. {bowler} under pressure now.",
      "Maximum! Clean strike over the ropes from {striker}. That’s pure power.",
      "Monster hit! Six runs for {striker}. The bowler can only watch in despair."
    ]
  };
  
  function getCommentary(runs, striker, bowler) {
    let line = "";
    if (runs === 0) {
      line = COMMENTARY.dot[Math.floor(Math.random() * COMMENTARY.dot.length)];
    } else if (runs === 1) {
      line = COMMENTARY.single[Math.floor(Math.random() * COMMENTARY.single.length)];
    } else if (runs === 2) {
      line = COMMENTARY.double[Math.floor(Math.random() * COMMENTARY.double.length)];
    } else if (runs === 3) {
      line = COMMENTARY.three[Math.floor(Math.random() * COMMENTARY.three.length)];
    } else if (runs === 4) {
      line = COMMENTARY.four[Math.floor(Math.random() * COMMENTARY.four.length)];
    } else if (runs === 6) {
      line = COMMENTARY.six[Math.floor(Math.random() * COMMENTARY.six.length)];
    }
  
    // Replace placeholders
    return line.replace("{striker}", striker).replace("{bowler}", bowler);
  }

  const WICKET_COMMENTARY = [
    "WICKET! {striker} is gone! Brilliant delivery by {bowler}.",
    "OUT! {striker} departs, {bowler} breaks the partnership!",
    "That’s a huge wicket! {striker} has to walk back, courtesy of {bowler}.",
  ];
  
  function getWicketCommentary(striker, bowler) {
    const line = WICKET_COMMENTARY[Math.floor(Math.random() * WICKET_COMMENTARY.length)];
    return line.replace("{striker}", striker).replace("{bowler}", bowler);
  }
  

  
function generateNextBall(state) {
  const battingTeamName = state.innings === 1 ? "India" : "Pakistan";
  const bowlingTeamName = state.innings === 1 ? "Pakistan" : "India";

  const battingTeam = { ...state.teams[battingTeamName] };
  const bowlingTeam = { ...state.teams[bowlingTeamName] };

  // Check if innings is over
  if (
    battingTeam.balls >= OVERS_PER_INNINGS * BALLS_PER_OVER ||
    battingTeam.wickets >= battingTeam.battingOrder.length - 1
  ) {
    if (state.innings === 1) return { ...state, inBreak: true, breakTimeLeft: INNINGS_BREAK };
    return finishMatch(state);
  }

  // Current bowler
  const currentBowler = bowlingTeam.bowlers[bowlingTeam.bowlerIndex];

  // Ball outcome
  const outcome = getRandomOutcome();
  battingTeam.balls += 1;

  const { over, ball } = formatOverBall(battingTeam.balls);

  // Commentary object
  let commentaryObj = {
    type: "BALL",
    payload: {
      over,
      ball,
      runs: 0,
      striker: battingTeam.striker,
      bowler: currentBowler,
      commentary: ""
    }
  };

  if (outcome === "W") {
    battingTeam.wickets += 1;
    commentaryObj.type = "WICKET";
    commentaryObj.payload.commentary = getWicketCommentary(battingTeam.striker, currentBowler);

    commentaryObj.payload.playerOut = battingTeam.striker;
    commentaryObj.payload.dismissal = "Out";

    if (battingTeam.nextBatter < battingTeam.battingOrder.length) {
      battingTeam.striker = battingTeam.battingOrder[battingTeam.nextBatter];
      battingTeam.nextBatter++;
    }
  } else {
    const runs = parseInt(outcome);
    battingTeam.runs += runs;
    commentaryObj.payload.runs = runs;

    if (runs === 4 || runs === 6) commentaryObj.type = "BOUNDARY";

    commentaryObj.payload.commentary = getCommentary(runs, battingTeam.striker, currentBowler);

    // Swap striker on odd runs
    if (runs % 2 !== 0) [battingTeam.striker, battingTeam.nonStriker] = [battingTeam.nonStriker, battingTeam.striker];
  }

  // Over completed
  if (battingTeam.balls % BALLS_PER_OVER === 0) {
    [battingTeam.striker, battingTeam.nonStriker] = [battingTeam.nonStriker, battingTeam.striker];
    bowlingTeam.bowlerIndex = (bowlingTeam.bowlerIndex + 1) % bowlingTeam.bowlers.length;
  }

  return {
    ...state,
    teams: {
      ...state.teams,
      [battingTeamName]: battingTeam,
      [bowlingTeamName]: bowlingTeam
    },
    events: [commentaryObj, ...state.events].slice(0, 25) // keep last 25
  };
}

function finishMatch(state) {
  const india = state.teams.India;
  const pak = state.teams.Pakistan;
  let result = "";

  if (india.runs > pak.runs) result = "🇮🇳 India Wins!";
  else if (pak.runs > india.runs) result = "🇵🇰 Pakistan Wins!";
  else result = "🤝 Match Tied!";

  return { ...state, finished: true, result };
}
