

//-----------------------------------------------------------
// Get the canvas element and its context
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

// Load images
var mouseImg = new Image();
mouseImg.src = "./img/person.png";

var catImg = new Image();
catImg.src = "./img/cucaracha.png";

// Define the mouse object
var mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 30,
    image: mouseImg, // Use the loaded mouse image
    speed: 2
};

// Define the cats array
var cats = [];

// Load the cat image
catImg.onload = function() {
    for (var i = 0; i < 5; i++) {
        cats.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: 30,
            image: catImg, // Use the loaded cat image
            speed: 2 + Math.random() * 2, // Random initial speed between 2 and 4
            direction: Math.random() * Math.PI * 2 // Random initial direction
        });
    }

    // Start the game loop after images are loaded
    gameLoop();
};

var score = 0;

// Event listener for mouse movement
canvas.addEventListener("mousemove", function(event) {
    mouse.x = event.clientX - canvas.getBoundingClientRect().left;
    mouse.y = event.clientY - canvas.getBoundingClientRect().top;
});

// Function to calculate distance between two points
function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Function to update game objects
function update() {
    // Increase score
    score += 1;

    // Move each cat
    for (var i = 0; i < cats.length; i++) {
        var cat = cats[i];

        // Move cat in its current direction
        cat.x += Math.cos(cat.direction) * cat.speed;
        cat.y += Math.sin(cat.direction) * cat.speed;

        // Check if the cat is out of bounds, wrap around
        if (cat.x < 0) cat.x = canvas.width;
        if (cat.x > canvas.width) cat.x = 0;
        if (cat.y < 0) cat.y = canvas.height;
        if (cat.y > canvas.height) cat.y = 0;

        // Keep cats separated
        for (var j = 0; j < cats.length; j++) {
            if (i !== j) {
                var otherCat = cats[j];
                var separationDistance = 100;
                var distanceToOtherCat = distanceBetweenPoints(cat.x, cat.y, otherCat.x, otherCat.y);
                if (distanceToOtherCat < separationDistance) {
                    var angle = Math.atan2(cat.y - otherCat.y, cat.x - otherCat.x);
                    cat.x += Math.cos(angle) * (separationDistance - distanceToOtherCat) * 0.05;
                    cat.y += Math.sin(angle) * (separationDistance - distanceToOtherCat) * 0.05;
                }
            }
        }

        // Update direction randomly to add some variation
        if (Math.random() < 0.01) {
            cat.direction += Math.random() * 0.5 - 0.25; // Change direction by up to ±0.25 radians
        }

        // Check for collision between mouse and cat
        var distance = distanceBetweenPoints(mouse.x, mouse.y, cat.x, cat.y);
        if (distance < mouse.radius + cat.radius) {
            // Game over
            alert("Excelente, lograste un puntaje de: " + score);
            // Reset the game
            reset();
        }
    }
}

// Function to reset the game
function reset() {
    score = 0;
    mouse.x = canvas.width / 2;
    mouse.y = canvas.height / 2;
    // Reset cat positions
    for (var i = 0; i < cats.length; i++) {
        cats[i].x = Math.random() * canvas.width;
        cats[i].y = Math.random() * canvas.height;
    }
}

// Function to draw game objects
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the mouse
    ctx.drawImage(mouse.image, mouse.x - mouse.radius, mouse.y - mouse.radius, mouse.radius * 2, mouse.radius * 2);

    // Draw the cats
    for (var i = 0; i < cats.length; i++) {
        var cat = cats[i];
        ctx.drawImage(cat.image, cat.x - cat.radius, cat.y - cat.radius, cat.radius * 2, cat.radius * 2);
    }

    // Display score
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

