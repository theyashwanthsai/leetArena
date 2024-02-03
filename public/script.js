
function setupBeforeUnloadListener() {
    window.addEventListener('beforeunload', (event) => {
        const confirmationMessage = 'Are you sure you want to leave? Your progress may be lost.';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
        
    });
}

setupBeforeUnloadListener();





document.getElementById('create').addEventListener('click', function () {
    document.getElementById('roomname').innerHTML = document.getElementById('room').value;
    const roomValue = document.getElementById('room').value.trim();
    const nameValue = document.getElementById('name').value.trim();

    // Check if room name and LeetCode username are provided
    if (roomValue === '' || nameValue === '') {
        alert('Please enter both room name and LeetCode username');
        location.reload();
        // flag = true
    }
});


const socket = io();
let room = null;
let userName = "No";

const roomForm = document.getElementById('room-form');
const chat = document.getElementById('chat');


document.getElementById('create').addEventListener('click', () => {
    const name = document.getElementById('name').value;
    console.log(name)
    room = document.getElementById('room').value;

    socket.emit('join', { room, name });

    roomForm.style.display = 'none';
    chat.style.display = 'block';
    userName = name;
    // console.log(userName);
    
});




document.getElementById('send').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    // console.log(userName);
    socket.emit('chat message', {message});
    document.getElementById('message').value = '';
});


const problemsArray = [];

function setDifficulty(value) {
    document.getElementById('difficultyDropdown').innerText = value;
}

document.getElementById('addP').addEventListener('click', () => {
    const problemName = document.getElementById('problem').value
    const difficulty = document.getElementById('difficultyDropdown').innerText.trim();
    console.log(problemName)
    console.log(difficulty)
    if (problemName !== '' && difficulty !== '') {
        const newProblem = { Name: problemName, Difficulty: difficulty };
        problemsArray.push(newProblem);

        console.log('Updated Problems Array:', problemsArray);

        document.getElementById('message').value = '';
        document.getElementById('difficultyDropdown').innerText = 'Difficulty';
    }
    else {
        alert('Please enter a problem name and select a difficulty.');
    } 
}
)

document.getElementById('ready').addEventListener('click', () => {
    room = document.getElementById('room').value;
    socket.emit('ready', room)
})

document.getElementById('start').addEventListener('click', () => {
    room = document.getElementById('room').value;
    socket.emit('contest', {room, problems: problemsArray})
})

document.getElementById('end').addEventListener('click', () => {
    room = document.getElementById('room').value;
    socket.emit('end', room)
})

socket.on('user joined', (name) => {

    addMessage(`User ${name} joined the room.`);
});

socket.on('user left', (name) => {
    addMessage(`User ${name} left the room.`);
});

socket.on('show chat message', ({name, message}) => {
    addMessage(`${name}: ${message}`);
});



function addMessage(text) {
    const li = document.createElement('li');
    li.textContent = text;
    document.getElementById('messages').appendChild(li);
}

socket.on('updateLeaderboard', (updatedLeaderboard) => {

    console.log('Updated Leaderboard:', updatedLeaderboard);

    addLeaderboard(updatedLeaderboard);
    });

    
    function addLeaderboard(leaderboardData) {

    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';
        
    // Create a table to display the leaderboard
    const table = document.createElement('table');
    table.border = '1';
    table.classList.add("table");
    // class="table table-bordered border-primary"
    const headerRow = table.insertRow();
    const usernameHeader = headerRow.insertCell(0);
    const scoreHeader = headerRow.insertCell(1);
    // const timeHeader = headerRow.insertCell(2);
    usernameHeader.innerHTML = '<b>Username</b>';
    scoreHeader.innerHTML = '<b>Score</b>';
    // timeHeader.innerHTML = '<b>Time</b>';
        

    leaderboardData.forEach((entry, index) => {
        const row = table.insertRow();
        const usernameCell = row.insertCell(0);
        const scoreCell = row.insertCell(1);
        // const timeCell = row.insertCell(2);
        
        usernameCell.innerHTML = entry.username;
        scoreCell.innerHTML = entry.score;
        // timeCell.innerHTML = entry.time;
    });
    
    // Append the table to the leaderboard element
    leaderboardElement.appendChild(table);
    }