# Design Document - Flying Dboss Game

## Overview

Flying Dboss is a browser-based 2D arcade game built using HTML5 Canvas and vanilla JavaScript. The game follows a simple game loop architecture where the player controls a character that must avoid falling obstacles. The design emphasizes responsive gameplay, smooth animations, and an engaging user experience across desktop and mobile devices.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│           HTML Document                 │
│  ┌───────────────────────────────────┐  │
│  │      Canvas Element               │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │    Game Rendering Layer     │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │    UI Overlay Screens             │  │
│  │  - Start Screen                   │  │
│  │  - End Screen                     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│        JavaScript Game Engine           │
│  ┌───────────────────────────────────┐  │
│  │      Game Loop Controller         │  │
│  │  - Update State                   │  │
│  │  - Render Graphics                │  │
│  │  - Handle Input                   │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Game State Manager           │  │
│  │  - Player State                   │  │
│  │  - Obstacles Array                │  │
│  │  - Score Tracking                 │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Physics Engine               │  │
│  │  - Gravity Simulation             │  │
│  │  - Collision Detection            │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │      Audio Manager                │  │
│  │  - Background Music               │  │
│  │  - Sound Effects                  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### File Structure

```
project-folder/
├── index.html          # Main HTML document with canvas and UI overlays
├── game.js             # Game logic, physics, and rendering
├── character.png       # Player character sprite
├── pillar.jpg          # Obstacle sprite
├── Collision Image.jpg # End screen image
├── dbackground.mp3     # Background music loop
├── middle.mp3          # Collision sound effect
└── ending.mp3          # Jump sound effect
```

## Components and Interfaces

### 1. HTML Structure

**Canvas Element:**
- Full viewport dimensions (100vw × 100vh)
- 2D rendering context
- Background styling via CSS

**Start Screen Overlay:**
- Fixed positioning with z-index 100
- Semi-transparent dark background (rgba(0, 0, 0, 0.8))
- Contains: title, instructions, start button
- Hidden when game starts

**End Screen Overlay:**
- Fixed positioning with z-index 200
- Opaque dark background (rgba(0, 0, 0, 0.9))
- Contains: circular end image, "Game Over" text, score display, restart button
- Initially hidden, shown on collision

### 2. Game State Manager

**Global State Variables:**
```javascript
{
  gameRunning: boolean,    // Whether game loop is active
  gameOver: boolean,       // Whether game has ended
  score: number           // Current score
}
```

**Player Object:**
```javascript
{
  x: number,              // Horizontal position
  y: number,              // Vertical position
  width: number,          // Sprite width (50px)
  height: number,         // Sprite height (50px)
  velocityY: number,      // Vertical velocity
  jumping: boolean,       // Jump state flag
  image: Image           // Loaded sprite
}
```

**Obstacle Object:**
```javascript
{
  x: number,              // Random horizontal position
  y: number,              // Vertical position (starts at -50)
  width: number,          // Sprite width (60px)
  height: number,         // Sprite height (60px)
  velocityY: number      // Fall speed (5 + score/100)
}
```

### 3. Physics Engine

**Gravity System:**
- Constant acceleration: 0.6 pixels/frame²
- Applied to player.velocityY each frame
- Results in realistic parabolic jump arc

**Jump Mechanics:**
- Initial jump velocity: -15 pixels/frame
- Single jump only (no double jump)
- Jump disabled until player touches ground

**Boundary Constraints:**
- Bottom boundary: canvas.height - player.height
- Top boundary: 0
- Left boundary: 0
- Right boundary: canvas.width - player.width

**Collision Detection:**
- Axis-Aligned Bounding Box (AABB) algorithm
- Checks overlap on both X and Y axes
- Formula:
  ```
  rect1.x < rect2.x + rect2.width &&
  rect1.x + rect1.width > rect2.x &&
  rect1.y < rect2.y + rect2.height &&
  rect1.y + rect1.height > rect2.y
  ```

### 4. Game Loop Controller

**Main Loop Flow:**
```
gameLoop() {
  if (gameRunning) {
    update()      // Update game state
    draw()        // Render to canvas
    requestAnimationFrame(gameLoop)  // Schedule next frame
  }
}
```

**Update Phase:**
1. Apply gravity to player
2. Update player position
3. Check player boundary collisions
4. Update all obstacle positions
5. Check player-obstacle collisions
6. Remove off-screen obstacles
7. Increment score for avoided obstacles
8. Spawn new obstacles (2% chance per frame)

**Draw Phase:**
1. Clear canvas
2. Draw background
3. Draw player sprite
4. Draw all obstacle sprites
5. Draw score text

### 5. Input Handler

**Keyboard Input:**
- Event: `keydown`
- Key: Space bar
- Action: Set player.velocityY = -15, play jump sound
- Condition: gameRunning && !player.jumping

**Touch Input:**
- Event: `touchstart` on canvas
- Action: Set player.velocityY = -15, play jump sound
- Condition: gameRunning && !player.jumping

**Click Input (Start/Restart):**
- Start button click: Calls startGame()
- Restart button click: Calls restartGame()

### 6. Audio Manager

**Audio Assets:**
- Background music: Looping, starts on game start, stops on game end
- Jump sound: One-shot, plays on each jump
- Collision sound: One-shot, plays on collision

**Audio Objects:**
```javascript
jumpSound: Audio('ending.mp3')
collisionSound: Audio('middle.mp3')
bgMusic: Audio('dbackground.mp3') with loop=true
```

### 7. Obstacle Spawner

**Spawn Logic:**
- Probability: 2% per frame (~1.2 obstacles/second at 60fps)
- Position: Random X within canvas bounds, Y = -50
- Velocity: Base speed 5 + (score / 100) for progressive difficulty
- Size: 60×60 pixels

**Lifecycle:**
1. Created above screen (y = -50)
2. Falls downward each frame
3. Checked for collision with player
4. Removed when y > canvas.height
5. Score incremented on removal

## Data Models

### Game State
```javascript
{
  gameRunning: boolean,
  gameOver: boolean,
  score: number,
  obstacles: Array<Obstacle>
}
```

### Player
```javascript
{
  x: number,
  y: number,
  width: 50,
  height: 50,
  velocityY: number,
  jumping: boolean,
  image: HTMLImageElement
}
```

### Obstacle
```javascript
{
  x: number,
  y: number,
  width: 60,
  height: 60,
  velocityY: number
}
```

## Error Handling

### Image Loading
- Images loaded via `new Image()` with `.src` assignment
- No explicit error handling (images fail silently)
- Recommendation: Add `onerror` handlers for production

### Audio Loading
- Audio loaded via `new Audio()` constructor
- No explicit error handling
- Recommendation: Add error handlers and fallback for browsers without audio support

### Canvas Context
- Assumes 2D context is available
- No fallback for unsupported browsers
- Recommendation: Add feature detection

### Window Resize
- Canvas dimensions update on resize event
- Game state preserved during resize
- Player/obstacle positions may need adjustment for extreme size changes

## Testing Strategy

### Manual Testing Checklist

**Start Screen:**
- [ ] Verify start screen displays on load
- [ ] Verify instructions are readable
- [ ] Verify start button is clickable
- [ ] Verify game starts when button clicked

**Player Controls:**
- [ ] Test spacebar jump on desktop
- [ ] Test touch jump on mobile
- [ ] Verify player cannot double jump
- [ ] Verify player stays within boundaries
- [ ] Verify gravity feels natural

**Obstacles:**
- [ ] Verify obstacles spawn randomly
- [ ] Verify obstacles fall at correct speed
- [ ] Verify difficulty increases with score
- [ ] Verify obstacles are removed off-screen

**Collision Detection:**
- [ ] Test collision from top
- [ ] Test collision from sides
- [ ] Test collision from bottom
- [ ] Verify collision triggers game end

**Score System:**
- [ ] Verify score starts at 0
- [ ] Verify score increments correctly
- [ ] Verify score displays during gameplay
- [ ] Verify final score shows on end screen

**Audio:**
- [ ] Verify background music loops
- [ ] Verify jump sound plays
- [ ] Verify collision sound plays
- [ ] Verify music stops on game end

**End Screen:**
- [ ] Verify end screen appears on collision
- [ ] Verify end image displays
- [ ] Verify score displays correctly
- [ ] Verify restart button works

**Responsive Design:**
- [ ] Test on desktop (1920×1080)
- [ ] Test on tablet (768×1024)
- [ ] Test on mobile (375×667)
- [ ] Test window resize during gameplay

### Performance Considerations

**Target Performance:**
- 60 FPS on modern devices
- Smooth animations without stuttering
- Minimal memory usage

**Optimization Strategies:**
- Use `requestAnimationFrame` for smooth rendering
- Remove off-screen obstacles to prevent memory leaks
- Limit obstacle spawn rate to prevent performance degradation
- Use simple AABB collision detection for speed

## Implementation Notes

### Asset Mapping
The provided media files need to be referenced correctly:
- `character.png` → player sprite
- `pillar.jpg` → obstacle sprite
- `Collision Image.jpg` → end screen image
- `dbackground.mp3` → background music
- `middle.mp3` → collision sound
- `ending.mp3` → jump sound

### Browser Compatibility
- Target: Modern browsers with HTML5 Canvas support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers: iOS Safari, Chrome Mobile

### Responsive Behavior
- Canvas fills entire viewport
- UI elements scale with viewport
- Touch events for mobile devices
- Keyboard events for desktop
