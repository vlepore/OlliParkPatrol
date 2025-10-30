// Detect if mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                 (window.innerWidth <= 768);

// Phaser Game Configuration
const config = {
    type: Phaser.AUTO,
    width: isMobile ? 600 : 800,
    height: isMobile ? 600 : 600,
    parent: 'game',
    backgroundColor: '#87CEEB',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false,
            fps: 60 // Lock physics to 60fps for consistency
        }
    },
    scene: [BootScene, MainMenuScene, GameScene, GameOverScene, LeaderboardScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: isMobile ? Phaser.Scale.CENTER_HORIZONTALLY : Phaser.Scale.CENTER_BOTH,
        parent: 'game'
    },
    pixelArt: true,
    fps: {
        target: 60,
        forceSetTimeOut: false
    }
};

// Initialize Game
const game = new Phaser.Game(config);

