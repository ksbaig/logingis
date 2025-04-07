// Global variables to store points
let pointsCollection = [];
let activePoint = null;
let drawingMode = false;

// Function 1: Draw a point when clicking on the map
function enablePointDrawing() {
    if (drawingMode) {
        disablePointDrawing();
        return;
    }

    drawingMode = true;
    viewer.screenSpaceEventHandler.setInputAction(function(click) {
        const ray = viewer.camera.getPickRay(click.position);
        const position = viewer.scene.globe.pick(ray, viewer.scene);
        
        if (position) {
            // Remove previous active point if exists
            if (activePoint) {
                viewer.entities.remove(activePoint);
            }
            
            // Create new point
            activePoint = viewer.entities.add({
                position: position,
                point: {
                    pixelSize: 15,
                    color: Cesium.Color.RED,
                    outlineColor: Cesium.Color.WHITE,
                    outlineWidth: 2
                },
                label: {
                    text: 'Point ' + (pointsCollection.length + 1),
                    font: '14pt sans-serif',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth: 2,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -15)
                }
            });
            
            // Convert position to lat/lon/height
            const cartographic = Cesium.Cartographic.fromCartesian(position);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            const height = cartographic.height;
            
            // Add to collection
            pointsCollection.push({
                id: pointsCollection.length + 1,
                longitude: longitude,
                latitude: latitude,
                height: height,
                entity: activePoint
            });
            
            alert(`Point added at:\nLongitude: ${longitude.toFixed(6)}\nLatitude: ${latitude.toFixed(6)}\nHeight: ${height.toFixed(2)}m`);
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    
    alert("Click on the map to add a point. Click the button again to disable drawing.");
}

function disablePointDrawing() {
    drawingMode = false;
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    activePoint = null;
}

// Function 2: Save points to a text file
function savePointsToFile() {
    if (pointsCollection.length === 0) {
        alert("No points to save!");
        return;
    }
    
    let fileContent = "ID,Longitude,Latitude,Height\n";
    pointsCollection.forEach(point => {
        fileContent += `${point.id},${point.longitude},${point.latitude},${point.height}\n`;
    });
    
    // Store in localStorage for download
    localStorage.setItem('savedPoints', fileContent);
    alert("Points saved successfully! Use 'Download Points' to get the file.");
}

// Function 3: Download the points as a text file
function downloadPointsFile() {
    const savedPoints = localStorage.getItem('savedPoints');
    if (!savedPoints) {
        alert("No points found to download!");
        return;
    }
    
    const blob = new Blob([savedPoints], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cesium_points_' + new Date().toISOString().slice(0, 10) + '.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function 4: Upload points from a file
function uploadPointsFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        try {
            // Clear existing points
            pointsCollection.forEach(point => viewer.entities.remove(point.entity));
            pointsCollection = [];
            
            // Parse the file content
            const lines = content.split('\n');
            lines.slice(1).forEach((line, index) => { // Skip header
                if (line.trim() === '') return;
                
                const parts = line.split(',');
                if (parts.length >= 3) {
                    const longitude = parseFloat(parts[1]);
                    const latitude = parseFloat(parts[2]);
                    const height = parts.length > 3 ? parseFloat(parts[3]) : 0;
                    
                    const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, height);
                    const point = viewer.entities.add({
                        position: position,
                        point: {
                            pixelSize: 12,
                            color: Cesium.Color.BLUE,
                            outlineColor: Cesium.Color.WHITE,
                            outlineWidth: 2
                        },
                        label: {
                            text: 'Uploaded ' + (index + 1),
                            font: '12pt sans-serif',
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            outlineWidth: 2,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -12)
                        }
                    });
                    
                    pointsCollection.push({
                        id: pointsCollection.length + 1,
                        longitude: longitude,
                        latitude: latitude,
                        height: height,
                        entity: point
                    });
                }
            });
            
            alert(`Successfully uploaded ${pointsCollection.length} points!`);
        } catch (error) {
            console.error("Error parsing points file:", error);
            alert("Error parsing the file. Please check the format.");
        }
    };
    reader.readAsText(file);
}

// Function 5: Clear all points
function clearAllPoints() {
    if (pointsCollection.length === 0) {
        alert("No points to clear!");
        return;
    }
    
    if (confirm("Are you sure you want to clear all points?")) {
        pointsCollection.forEach(point => {
            viewer.entities.remove(point.entity);
        });
        pointsCollection = [];
        localStorage.removeItem('savedPoints');
        alert("All points have been cleared.");
    }
}

// Setup UI elements for these functions
function setupPointFunctionsUI() {
    // Create toolbar div
    let toolbar = document.getElementById('toolbar');
    if (!toolbar) {
        toolbar = document.createElement('div');
        toolbar.id = 'toolbar';
        toolbar.style.position = 'absolute';
        toolbar.style.top = '70px';
        toolbar.style.left = '10px';
        toolbar.style.background = 'rgba(42, 42, 42, 0.8)';
        toolbar.style.padding = '4px';
        toolbar.style.borderRadius = '4px';
        toolbar.style.zIndex = '999';
        document.body.appendChild(toolbar);
    }
    
    // Add buttons to toolbar
    const drawBtn = document.createElement('button');
    drawBtn.textContent = 'Draw Points';
    drawBtn.onclick = enablePointDrawing;
    toolbar.appendChild(drawBtn);
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save Points';
    saveBtn.onclick = savePointsToFile;
    saveBtn.style.marginLeft = '5px';
    toolbar.appendChild(saveBtn);
    
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download Points';
    downloadBtn.onclick = downloadPointsFile;
    downloadBtn.style.marginLeft = '5px';
    toolbar.appendChild(downloadBtn);
    
    const uploadLabel = document.createElement('label');
    uploadLabel.textContent = 'Upload Points';
    uploadLabel.style.marginLeft = '5px';
    uploadLabel.style.color = 'white';
    uploadLabel.style.cursor = 'pointer';
    uploadLabel.style.padding = '5px';
    uploadLabel.style.borderRadius = '3px';
    uploadLabel.style.backgroundColor = '#4CAF50';
    
    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.id = 'upload-points-input';
    uploadInput.accept = '.txt,.csv';
    uploadInput.style.display = 'none';
    uploadInput.addEventListener('change', uploadPointsFromFile);
    
    uploadLabel.appendChild(uploadInput);
    toolbar.appendChild(uploadLabel);
    
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear Points';
    clearBtn.onclick = clearAllPoints;
    clearBtn.style.marginLeft = '5px';
    toolbar.appendChild(clearBtn);
}