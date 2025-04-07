// Initialize users in localStorage if not exists
if (!localStorage.getItem('users')) {
    const defaultUsers = [
        { username: 'admin', password: 'password123' },
        { username: 'user1', password: 'mypassword' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// DOM Elements
const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const contentArea = document.getElementById('content-area');
const loggedInUserSpan = document.getElementById('logged-in-user');
const loginMessage = document.getElementById('login-message');
const logoutBtn = document.getElementById('logout-btn');
const loginBtn = document.getElementById('login-btn');

// Check if user is already logged in
if (localStorage.getItem('currentUser')) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    showContentArea(currentUser.username);
}

// Login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showContentArea(user.username);
        loginMessage.textContent = '';
    } else {
        loginMessage.textContent = 'Invalid username or password';
    }
});

// Logout button
logoutBtn.addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    showLoginForm();
});

// Login button in nav
loginBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (!localStorage.getItem('currentUser')) {
        showLoginForm();
    }
});

// Helper functions
function showContentArea(username) {
    loginContainer.classList.add('hidden');
    contentArea.classList.remove('hidden');
    loggedInUserSpan.textContent = username;
    window.location.href = 'map.html';
}

function showLoginForm() {
    contentArea.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    loginForm.reset();
}

// Points dropdown functionality (only for index.html)
document.getElementById('draw-points')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Please login first to access map features');
});

document.getElementById('save-points')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Please login first to access map features');
});

document.getElementById('download-points')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Please login first to access map features');
});

document.getElementById('upload-points')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Please login first to access map features');
});

document.getElementById('clear-points')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Please login first to access map features');
});

// Demo functions for the dropdown
document.getElementById('func1')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Function 1 clicked');
});

document.getElementById('func2')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Function 2 clicked');
});

document.getElementById('func3')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Function 3 clicked');
});

// Home and About buttons
document.getElementById('home-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('Home button clicked');
});

document.getElementById('about-btn')?.addEventListener('click', function(e) {
    e.preventDefault();
    alert('About button clicked');
});