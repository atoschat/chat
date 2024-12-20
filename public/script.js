const socket = io();

// Log connection status
socket.on('connect', () => {
    console.log('Connected to the server');
});

// Update active users count
socket.on('activeUsers', (count) => {
    updateActiveUsersCount(count);
});

// Handle Navbar toggle
const navb = document.querySelector('.nav-b');
function toggle() {
    navb.classList.toggle('trans');
}

// Login form elements
const form = document.querySelector('#login');
const usern = document.querySelector('#user');
const passn = document.querySelector('#pass');
const login = document.querySelector('#submit');
const hide = document.querySelectorAll('.hide');
const userd = document.querySelector('.userd');

// Chat elements
const sendmsg = document.querySelector('#m-send');
const input = document.querySelector('#send-m');
const messages = document.querySelector('.msg-s');

// Set default username (for testing)
usern.value = 'read';
passn.value='999999999999'

// Handle login
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (usern.value.length > 3 && passn.value.length > 8) {
        alert("Logged In successfully");
        hide.forEach((element) => element.classList.remove('hide'));
        form.classList.add('hide');
        userd.textContent = `Welcome ${usern.value}`;
        socket.emit('username', usern.value); // Notify server
    }
});

// Update active users count display
function updateActiveUsersCount(count) {
    const activeUsersDisplay = document.getElementById('active-users');
    activeUsersDisplay.textContent = `Active Users: ${count}`;
}

// Handle chat message submission
sendmsg.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim() !== '') { // Avoid empty or whitespace-only messages
        socket.emit('chat message', input.value, usern.value); // Emit with username
        input.value = ''; // Clear input field
    }
});

// Handle incoming chat messages
socket.on('chat message', (msg, username) => {
    const item = document.createElement('li');
    item.textContent = `${username}: ${msg}`; // Include username with message
    item.className = 'msg';
    messages.prepend(item); // Prepend the message to show latest at the top
});
