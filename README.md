# 🐾 Olli's Park Patrol

**One doodle, one park, endless adventures.**

A 2D side-scrolling retro platformer inspired by 16-bit classics, featuring Olli the Goldendoodle on a mission to keep the neighborhood park safe!

## 🎮 How to Play

### Running the Game

1. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, or Edge recommended)
2. Or use a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js http-server
   npx http-server
   ```
3. Navigate to `http://localhost:8000` in your browser

### Controls

**Desktop:**
- **Arrow Keys / WASD** - Move left/right
- **Space / Up Arrow** - Jump
- **X Key** - Bark Attack (stuns enemies)
- **ESC** - Pause game

**Mobile:**
- **On-screen D-Pad** - Move left/right and jump
- **Bark Button** - Tap to bark at enemies
- **Jump Button** - Tap to jump
- Touch controls automatically appear on mobile devices!

### Game Objectives

1. **Explore** the park levels
2. **Collect** items scattered throughout:
   - 🎾 Tennis Balls (+25 points)
   - 🦴 Bones (+10 points)
   - 💗 Treats (restore health)
3. **Rescue** lost dogs (+150 points each)
4. **Chase off** enemies by barking at them (+50 points)
5. Reach the end of each level to progress

### Special Mechanics

#### 🌟 Zoomies Mode
Collect 3 tennis balls in a row (without collecting bones) to activate **Zoomies Mode**:
- +100 bonus points
- Increased speed for 5 seconds
- Cool visual effects!

#### 🔍 Super Sniffer
Olli's nose will glow when you're near a hidden lost dog. Follow the glow to find them!

#### ⚔️ Bark Attack
Press **X** to bark and stun enemies. Bark at stunned enemies again to defeat them!

#### 🦘 Double Jump
Press jump again while in the air for a second jump! This helps reach higher platforms and escape danger.

## 📊 Scoring System

### Point Values
- 🦴 Bone: **+10 points**
- 🎾 Tennis Ball: **+25 points**
- 🐕 Lost Dog Rescued: **+150 points**
- 🦝 Enemy Defeated: **+50 points**
- 💨 Zoomies Streak: **+100 bonus points**
- 💔 Taking Damage: **-25 points**

### End-of-Level Bonuses
- 🎖️ **Perfect Rescue Bonus** (+500): Find all lost dogs
- ⚡ **Speed Pup Bonus** (+250): Finish under time goal
- ✨ **Clean Paws Bonus** (+200): Take no damage

## 🗺️ Levels

### Level 1: Sunny Start (Tutorial)
- Bright, sunny day in the park
- 2 lost dogs to rescue
- 10 tennis balls, 15 bones
- 3 squirrel enemies
- Time goal: 2 minutes

### Level 2: Rainy Day Chase
- Rainy weather with slippery platforms
- 3 lost dogs hidden under benches
- 12 tennis balls, 15 bones
- 4 raccoon enemies (faster!)
- Time goal: 2.5 minutes

## 🏆 Leaderboard

- Your scores are saved locally in your browser
- Top 10 scores are displayed
- Enter a 3-letter name (arcade style!)
- Compete for the best score!

## 🎨 Features

- **Retro 16-bit aesthetic** with pixel art style
- **Procedurally generated sound effects** using Web Audio API
- **Smooth platforming physics** with Phaser.js
- **Particle effects** for all actions
- **Local leaderboard** with persistent storage
- **Mobile-friendly** with on-screen touch controls
- **Responsive design** - works on different screen sizes
- **Background music** integration
- **Olli has adorable white belly fur!**

## 🛠️ Technical Details

### Built With
- **Phaser.js 3** - Game framework
- **Web Audio API** - Procedural sound generation
- **HTML5 Canvas** - Rendering
- **LocalStorage** - Score persistence
- **Press Start 2P** - Retro font

### Project Structure
```
OlliPatrol/
├── index.html              # Entry point
├── css/
│   └── style.css          # Styling with mobile-responsive design
├── js/
│   ├── main.js            # Phaser configuration
│   ├── GameManager.js     # Score & state management
│   ├── AudioManager.js    # Sound effect generation
│   ├── MobileControls.js  # Touch controls for mobile
│   ├── Player.js          # Olli character class
│   ├── Enemy.js           # Enemy classes
│   ├── Collectible.js     # Item pickups
│   ├── LostDog.js         # Rescue targets
│   └── scenes/
│       ├── BootScene.js       # Asset loading
│       ├── MainMenuScene.js   # Main menu
│       ├── GameScene.js       # Gameplay
│       ├── GameOverScene.js   # Results screen
│       └── LeaderboardScene.js # High scores
└── theme.mp3              # Background music
```

### Browser Requirements
- Modern browser with ES6 support
- Web Audio API support
- Canvas support
- LocalStorage enabled

## 🎵 Audio

The game includes:
- **Background Music**: Your custom `theme.mp3`
- **Procedural Sound Effects**:
  - Jump, collect, bark sounds
  - Hurt and death sounds
  - Enemy defeat sounds
  - Dog rescue celebration sounds

All sound effects are generated programmatically using the Web Audio API, so no external sound files are needed (except the theme music).

## 🐕 About Olli

**Full Name**: Oliver "Olli" the Goldendoodle  
**Breed**: Golden Retriever x Poodle  
**Age**: 4 years  
**Personality**: Playful, heroic, curious, and a little goofy

Special traits:
- Can't resist a good tennis ball
- Master of the "Super Sniffer" ability
- Enters "Zoomies Mode" when excited
- Always ready to help fellow dogs in need

## 🎯 Tips & Tricks

1. **Collect tennis balls in succession** for Zoomies Mode bonus
2. **Use bark strategically** - it has a cooldown!
3. **Watch for the nose glow** to find hidden dogs
4. **Slippery platforms** in Level 2 require careful movement
5. **Don't rush** - bonus points for time, but rescue all dogs for Perfect Rescue
6. **Jump on platforms** to avoid enemies before you can bark at them

## 🚀 Future Enhancements (MVP Complete)

This is the MVP version. Potential additions:
- More levels (Autumn Trails, Winter Woofs, Night Patrol)
- More enemy types
- Power-ups and special items
- Unlockable collars and accessories for Olli
- Mobile touch controls
- Multiplayer racing mode
- Achievement system
- Better sprite artwork (replace placeholders)

## 📝 License

This is a personal project. Feel free to use and modify as you wish!

## 🙏 Credits

- **Game Design**: Original concept
- **Development**: Built with Phaser.js
- **Font**: Press Start 2P by CodeMan38
- **Framework**: Phaser.js by Photon Storm

---

**Have fun playing Olli's Park Patrol! 🐾**

*Remember: You're not just playing a game, you're keeping the park safe!*

