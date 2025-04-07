// Your Cesium ion access token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJhY2VjYWRlNC00MzhiLTRmYTAtYTI5Mi0zYzE1Zjc2OWM5MjkiLCJpZCI6MjQ0MDU5LCJpYXQiOjE3Mjc4NDk1NTV9.Hq8fKKaTCKFZd0bnVRySAoXh4akmaaM8wyVCC0E8UU0';

// Initialize the Cesium Viewer with World Terrain
const viewer = new Cesium.Viewer('cesiumContainer', {
    terrain: Cesium.Terrain.fromWorldTerrain(),
    timeline: false,
    animation: false,
    sceneModePicker: false,
    baseLayerPicker: false,
    navigationHelpButton: false,
    homeButton: false,
    geocoder: false,
    infoBox: false,
    selectionIndicator: false,
    shouldAnimate: true
});

// Enable lighting effects
viewer.scene.globe.enableLighting = true;

// Check if user is logged in
if (!localStorage.getItem('currentUser')) {
    window.location.href = 'index.html';
}

// Navigation buttons
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

document.getElementById('home-btn').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Home button clicked');
});

document.getElementById('about-btn').addEventListener('click', function(e) {
    e.preventDefault();
    alert('About button clicked');
});

document.getElementById('func1').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Function 1 clicked');
});

document.getElementById('func2').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Function 2 clicked');
});

document.getElementById('func3').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Function 3 clicked');
});

// Initialize point functions
setupPointFunctionsUI();