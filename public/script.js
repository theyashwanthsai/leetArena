const socket = io();
    let room = null;
    let userName = "No";

    const roomForm = document.getElementById('room-form');
    const chat = document.getElementById('chat');
    function getName(){
        return prompt("Enter Username")
    }
    document.getElementById('join').addEventListener('click', () => {
        const name = getName();
        room = document.getElementById('room').value;

        socket.emit('join', { room, name });
        roomForm.style.display = 'none';
        chat.style.display = 'block';
    });

    document.getElementById('create').addEventListener('click', () => {
        const name = getName();
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


    document.getElementById('ready').addEventListener('click', () => {
        room = document.getElementById('room').value;
        socket.emit('ready', room)
    })


    document.getElementById('start').addEventListener('click', () => {
        room = document.getElementById('room').value;
        socket.emit('contest', room)
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

        
      // Function to add leaderboard to the UI
        function addLeaderboard(leaderboardData) {

        const leaderboardElement = document.getElementById('leaderboard');
            
        // Clear previous leaderboard data
        leaderboardElement.innerHTML = '';
            
        // Create a table to display the leaderboard
        const table = document.createElement('table');
        table.border = '1';

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