const getSubmissions = require('./api/api')

let leaderboard = [];
const users = ["theyashwanthsai", "xzist23", "varunmuthannaka", "yuvftw"];
const problems = [
  {
    Name: "Find Mode in Binary Search Tree",
    Difficulty: "Easy"
  }
];

const difficultyPoints = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

const getSub = async (req, res) => {
    for (let i = 0; i < users.length; i++) {
      const jdata = await getSubmissions(users[i]);
      const solvedProblems = jdata.data.recentAcSubmissionList.map(submission => submission.title);

      const userScore = solvedProblems.reduce((totalScore, problemTitle) => {
          const problem = problems.find(p => p.Name === problemTitle);
          if (problem) {
          totalScore += difficultyPoints[problem.Difficulty];
        }
          return totalScore;
      }, 0);

      const userTime = jdata.data.recentAcSubmissionList[0].timestamp;

      leaderboard.push({ username: users[i], score: userScore, time: userTime });
    }

      leaderboard.sort((a, b) => {
      if (a.score === b.score) {
          return b.time - a.time;
      }
      return b.score - a.score;
      });
      console.log(leaderboard);

      leaderboard = []
}

const leaderboardUpdateInterval = 30000;

setInterval(getSub, leaderboardUpdateInterval);
