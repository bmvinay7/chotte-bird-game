# Implementation Plan - Flying Dboss Game

- [x] 1. Create HTML structure with canvas and UI overlays
  - Create index.html with proper DOCTYPE and meta tags
  - Add canvas element with id "gameCanvas"
  - Create start screen overlay with title, instructions, and start button
  - Create end screen overlay with image, game over text, score display, and restart button
  - Add CSS styling for responsive layout, overlays, and buttons
  - _Requirements: 1.1, 1.2, 1.3, 7.2, 7.3, 7.4, 7.5_

- [x] 2. Initialize game canvas and core variables
  - Create game.js file and get canvas 2D context
  - Set canvas dimensions to match window size
  - Initialize game state variables (gameRunning, gameOver, score)
  - Define player object with position, dimensions, velocity, and image properties
  - Initialize empty obstacles array
  - Load player sprite image (character.png)
  - Load obstacle sprite image (pillar.jpg)
  - _Requirements: 8.1, 8.2, 5.3_

- [x] 3. Implement audio system
  - Create Audio objects for jump sound (ending.mp3)
  - Create Audio object for collision sound (middle.mp3)
  - Create Audio object for background music (dbackground.mp3) with loop enabled
  - _Requirements: 6.1, 6.2, 6.3_

- [x] 4. Implement input event handlers
  - Add keydown event listener for spacebar to trigger jump
  - Add touchstart event listener on canvas for mobile jump
  - Add click event listener on start button to call startGame()
  - Add click event listener on restart button to call restartGame()
  - Ensure jump only works when gameRunning is true and player is not already jumping
  - Play jump sound when jump is triggered
  - _Requirements: 2.1, 2.2, 1.4, 7.5_

- [x] 5. Implement player physics and movement
  - Apply gravity (0.6 pixels/frame²) to player velocityY each frame
  - Update player Y position based on velocityY
  - Implement ground collision detection at canvas bottom
  - Reset jumping state when player touches ground
  - Implement boundary constraints for top, left, and right edges
  - _Requirements: 2.3, 2.4, 2.5_

- [x] 6. Implement obstacle spawning and movement
  - Create createObstacle() function that generates obstacles at random X positions
  - Set initial obstacle Y position to -50 (above screen)
  - Calculate obstacle velocity as 5 + score/100 for progressive difficulty
  - Add 2% spawn probability per frame in update loop
  - Update obstacle Y positions each frame
  - Remove obstacles that move below canvas height
  - Increment score when obstacle is removed
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 7. Implement collision detection system
  - Create isColliding() function using AABB algorithm
  - Check for collisions between player and all obstacles in update loop
  - Trigger endGame() when collision is detected
  - Play collision sound on collision
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 8. Implement game state management functions
  - Create startGame() function that hides start screen, resets game state, starts background music, and initiates game loop
  - Create restartGame() function that hides end screen and calls startGame()
  - Create endGame() function that stops game loop, pauses music, updates score display, and shows end screen
  - _Requirements: 1.4, 4.4, 4.5, 6.4, 7.1, 7.5_

- [x] 9. Implement rendering system
  - Create draw() function that clears canvas each frame
  - Draw player sprite at current position
  - Draw all obstacle sprites at their positions
  - Draw score text in top-left corner with white 24px Arial font
  - _Requirements: 5.1, 5.2_

- [x] 10. Implement main game loop
  - Create gameLoop() function using requestAnimationFrame
  - Call update() to process game state changes
  - Call draw() to render graphics
  - Continue loop only while gameRunning is true
  - _Requirements: All requirements integrated_

- [x] 11. Implement responsive window resize handling
  - Add window resize event listener
  - Update canvas width and height to match new window dimensions
  - _Requirements: 8.3, 8.4_

- [x] 12. Update asset references to match provided files
  - Change player.image.src from 'player.png' to 'character.png'
  - Change obstacleImage.src from 'obstacle.png' to 'pillar.jpg'
  - Change end screen image src from 'end-image.jpg' to 'Collision Image.jpg'
  - Change jumpSound from 'jump.mp3' to 'ending.mp3'
  - Change collisionSound from 'collision.mp3' to 'middle.mp3'
  - Change bgMusic from 'background.mp3' to 'dbackground.mp3'
  - _Requirements: All audio and visual requirements_
