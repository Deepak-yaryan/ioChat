// I created a Realtime Chat Application Using NodeJs and SocketIO
const socket = io('https://iochat.onrender.com',{transports: ['websocket']});

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

// Audio that will play on receiving messages
let audio = new Audio("https://iochatt.netlify.app/frontend/js/ting.mp3")

// Function which will append event info to the container
const append = (message, position)=>{
    const messageElement = document.createElement('textarea');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement)
    if(position == 'left'){
        audio.play();
    }
}


    // Ask new user for his/her name and let the server know
    const names = prompt("Enter your name to join the chat");
    socket.emit('new-user-joined', names);

    // If a new user joins, receive his/her name from the server
    socket.on('user-joined', names => {
        append(`${names} joined the chat`, 'right');
    })

    // If server sends a message, receive it
    socket.on('receive', data => {
        append(`${data.names}: ${data.message}`, 'left')
    })

    // If a user leaves the chat, append the info to the container
    socket.on('left', names => {
        append(`${names} left the chat`, 'right')
    })

    // If the form gets submitted, send server the message
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const message = messageInput.value;
        append(`you: ${message}`,'right');
        socket.emit('send', message);
        messageInput.value = '';
    })