# Requirements Document

## Introduction

Flying Dboss is a browser-based arcade game where the player controls a character that must avoid falling obstacles. The player can jump to dodge obstacles, and the game tracks their score based on how many obstacles they successfully avoid. The game features a start screen, gameplay with increasing difficulty, and an end screen displaying the final score.

## Glossary

- **Game Canvas**: The HTML5 canvas element where all game graphics are rendered
- **Player Character**: The controllable character sprite that the user navigates
- **Obstacle**: Falling objects that the Player Character must avoid
- **Game Loop**: The continuous cycle of updating game state and rendering graphics
- **Collision Detection**: The system that determines when the Player Character intersects with an Obstacle

## Requirements

### Requirement 1

**User Story:** As a player, I want to see a start screen with game instructions, so that I understand how to play before starting

#### Acceptance Criteria

1. WHEN the game loads, THE Game Canvas SHALL display a start screen overlay with the game title "Flying Dboss"
2. THE start screen SHALL display instructions "Tap or press space to jump" and "Help Boss reach his loved one ❤️"
3. THE start screen SHALL provide a "Start Game" button that initiates gameplay
4. WHEN the start button is clicked, THE Game Canvas SHALL hide the start screen and begin the game loop

### Requirement 2

**User Story:** As a player, I want to control my character using keyboard or touch input, so that I can navigate and avoid obstacles

#### Acceptance Criteria

1. WHEN the spacebar key is pressed during gameplay, THE Player Character SHALL jump upward with an initial velocity of -15 pixels per frame
2. WHEN the canvas is touched on a mobile device during gameplay, THE Player Character SHALL jump upward with an initial velocity of -15 pixels per frame
3. THE Player Character SHALL apply gravity at 0.6 pixels per frame squared to simulate realistic falling motion
4. WHEN the Player Character reaches the bottom boundary, THE Player Character SHALL stop at the ground level and reset jumping state
5. THE Player Character SHALL remain within the horizontal canvas boundaries at all times

### Requirement 3

**User Story:** As a player, I want obstacles to appear and fall from the top of the screen, so that I have challenges to overcome

#### Acceptance Criteria

1. THE Game Canvas SHALL spawn new Obstacles at random horizontal positions at the top of the screen
2. THE Game Canvas SHALL spawn Obstacles with a 2% probability per game frame
3. WHEN an Obstacle is spawned, THE Obstacle SHALL fall downward at a velocity of 5 pixels per frame plus score divided by 100
4. WHEN an Obstacle moves below the bottom of the canvas, THE Game Canvas SHALL remove the Obstacle from memory
5. WHEN an Obstacle is successfully avoided, THE Game Canvas SHALL increment the score by 1 point

### Requirement 4

**User Story:** As a player, I want the game to detect when I collide with an obstacle, so that the game ends appropriately

#### Acceptance Criteria

1. THE Game Canvas SHALL continuously check for collisions between the Player Character and all active Obstacles
2. WHEN the Player Character bounding box intersects with an Obstacle bounding box, THE Game Canvas SHALL trigger the end game sequence
3. WHEN a collision is detected, THE Game Canvas SHALL play the collision sound effect
4. WHEN a collision is detected, THE Game Canvas SHALL stop the background music
5. WHEN a collision is detected, THE Game Canvas SHALL display the end screen with the final score

### Requirement 5

**User Story:** As a player, I want to see my current score during gameplay, so that I can track my progress

#### Acceptance Criteria

1. THE Game Canvas SHALL display the current score in the top-left corner at coordinates (20, 40)
2. THE score display SHALL use white text with a 24-pixel Arial font
3. THE score display SHALL update in real-time as obstacles are avoided
4. THE score SHALL start at 0 when the game begins

### Requirement 6

**User Story:** As a player, I want to hear audio feedback during gameplay, so that the game feels more engaging

#### Acceptance Criteria

1. WHEN the game starts, THE Game Canvas SHALL play background music on a continuous loop
2. WHEN the Player Character jumps, THE Game Canvas SHALL play a jump sound effect
3. WHEN a collision occurs, THE Game Canvas SHALL play a collision sound effect
4. WHEN the game ends, THE Game Canvas SHALL stop the background music

### Requirement 7

**User Story:** As a player, I want to see an end screen with my final score and an image, so that I have closure when the game ends

#### Acceptance Criteria

1. WHEN the game ends, THE Game Canvas SHALL display an end screen overlay with a circular image
2. THE end screen SHALL display the text "Game Over!" as a heading
3. THE end screen SHALL display the final score with the format "Score: [number]"
4. THE end screen SHALL provide a "Tap to Restart" button
5. WHEN the restart button is clicked, THE Game Canvas SHALL reset the game state and return to the start screen

### Requirement 8

**User Story:** As a player, I want the game to be responsive to different screen sizes, so that I can play on various devices

#### Acceptance Criteria

1. THE Game Canvas SHALL set its width to match the browser window width
2. THE Game Canvas SHALL set its height to match the browser window height
3. WHEN the browser window is resized, THE Game Canvas SHALL update its dimensions to match the new window size
4. THE Game Canvas SHALL maintain proper aspect ratios for all game elements across different screen sizes
