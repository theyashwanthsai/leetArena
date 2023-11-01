const express = require('express');
const getSubmissions = require('./api/api')



const app = express();
const PORT = process.env.PORT || 4000;


const leaderboard = [];
const users = ["theyashwanthsai", "xzist23", "varunmuthannaka", "yuvftw"];
const problems = [
  { Name: "Poor Pigs", Difficulty: "Hard" },
  { Name: "Minimum Sum of Mountain Triplets II", Difficulty: "Medium"},
  { Name: "Convert Sorted Array to Binary Search Tree", Difficulty: "Easy"}
];

const difficultyPoints = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

const getSub = async (req, res) => {
  // const query = recentSubmissionsQuery;
  // let limit = 3;
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
    res.json(leaderboard);
}

app.get("/start", getSub)



app.listen(PORT, () => {
    console.log(`Server is started at : ${PORT}`);
});
