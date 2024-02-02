const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
// const api = require('leetapi');
const getSubmissions = require('./api/api')

const app = express();
const server = http.createServer(app);

const io = socketIo(server);



app.use(express.static('public'));



const rooms = new Map();
const users ={}
const leaderboard = {};
// const problems = {};



io.on('connection', (socket) => {

  socket.on('join', ({room, name}) => {
    socket.join(room);
    socket.room = room;
    socket.name = name;

    if (!rooms.has(room)) {
      rooms.set(room, []);
    }

    io.to(room).emit('user joined', socket.name);
  });

  socket.on('chat message', ({message}) => {
    const name = socket.name;
    io.to(socket.room).emit('show chat message', {name, message});
  });

  // takein user name for the room and append for that room.
  socket.on('ready', (room) =>{
    socket.room = room;
    if (!users.hasOwnProperty(socket.room)) {
      // If not, create an empty array for that key
      users[socket.room] = [];
    }
    
    // Check if the socket.name is not already in the array before pushing it
    if (!users[socket.room].includes(socket.name)) {
      users[socket.room].push(socket.name);
    }    
    // console.log(users);
  });

  socket.on('contest', (room) => {
    socket.room = room;
    // console.log(users[socket.room]);



    // todo: add a method to retrieve probelms and difficulty points for each problem
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
      // Create an array to store user scores for the current room
      let lb = [];
    
      for (let i = 0; i < users[socket.room].length; i++) {
        const jdata = await getSubmissions(users[socket.room][i]);
        const solvedProblems = jdata.data.recentAcSubmissionList.map(submission => submission.title);
        const userScore = solvedProblems.reduce((totalScore, problemTitle) => {
          const problem = problems.find(p => p.Name === problemTitle);
          if (problem) {
            totalScore += difficultyPoints[problem.Difficulty];
          }
          return totalScore;
        }, 0);
    
        const userTime = jdata.data.recentAcSubmissionList[0].timestamp;
    
        lb.push({ username: users[socket.room][i], score: userScore, time: userTime });
      }
    
      // Sort the leaderboard array
      lb.sort((a, b) => {
        if (a.score === b.score) {
          return b.time - a.time;
        }
        return b.score - a.score;
      });
    
      // Store the leaderboard array in the global leaderboard object
      leaderboard[socket.room] = lb;

      console.log(leaderboard[socket.room]);
      io.to(socket.room).emit('updateLeaderboard', leaderboard[socket.room]);
    };

    // getSub();
    const leaderboardUpdateInterval = 10000;

    setInterval(getSub, leaderboardUpdateInterval);

  });
  socket.on('end', (room) => {
    
  });

  socket.on('disconnect', () => {
    if (socket.room) {
      const users = rooms.get(socket.room);
      if (users) {
        const index = users.indexOf(socket.id);
        if (index !== -1) {
          users.splice(index, 1);
        }
      }
      io.to(socket.room).emit('user left', socket.name);
    }
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});




