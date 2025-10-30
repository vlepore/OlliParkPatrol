// Main Menu Scene
class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenuScene' });
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background with gradient effect using multiple rectangles
        for (let i = 0; i < 10; i++) {
            const shade = 135 + i * 12;
            const rect = this.add.rectangle(
                width / 2,
                i * (height / 10),
                width,
                height / 10,
                Phaser.Display.Color.GetColor(shade, 206, 235)
            ).setOrigin(0.5, 0);
        }
        
        // Decorative elements - clouds
        this.createCloud(100, 80, 1.2);
        this.createCloud(600, 120, 0.8);
        this.createCloud(350, 60, 1);
        
        // Detect mobile for text sizing
        const isMobile = width <= 600;
        
        // Title - larger on mobile
        const title = this.add.text(width / 2, isMobile ? 80 : 100, "OLLI'S\nPARK PATROL", {
            fontSize: isMobile ? '40px' : '48px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700',
            stroke: '#000',
            strokeThickness: isMobile ? 6 : 8,
            align: 'center',
            lineSpacing: isMobile ? 8 : 10
        }).setOrigin(0.5);
        
        // Tagline - larger on mobile
        const tagline = this.add.text(width / 2, isMobile ? 180 : 200, 'One doodle, one park,\nendless adventures.', {
            fontSize: isMobile ? '16px' : '14px',
            fontFamily: 'Press Start 2P',
            color: '#FFFFFF',
            stroke: '#000',
            strokeThickness: isMobile ? 5 : 4,
            align: 'center',
            lineSpacing: isMobile ? 8 : 5
        }).setOrigin(0.5);
        
        // Olli character preview
        const olliSprite = this.add.sprite(width / 2, 280, 'player').setScale(3);
        this.tweens.add({
            targets: olliSprite,
            y: 280 + 10,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Buttons - adjusted positions for mobile
        const startButton = this.createButton(width / 2, isMobile ? 340 : 360, 'START GAME', () => {
            this.sound.play('collect', { volume: 0.5 });
            this.cameras.main.fade(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                gameManager.reset();
                this.scene.start('GameScene', { level: 1 });
            });
        });
        
        const leaderboardButton = this.createButton(width / 2, isMobile ? 410 : 430, 'LEADERBOARD', () => {
            this.sound.play('collect', { volume: 0.5 });
            this.scene.start('LeaderboardScene', { returnTo: 'MainMenuScene' });
        });
        
        const howToPlayButton = this.createButton(width / 2, isMobile ? 480 : 500, 'HOW TO PLAY', () => {
            this.sound.play('collect', { volume: 0.5 });
            this.showHowToPlay();
        });
        
        // Start background music
        if (!this.sound.get('theme')) {
            const music = this.sound.add('theme', { volume: 0.3, loop: true });
            music.play();
        }
        
        // Animated title effect
        this.tweens.add({
            targets: title,
            y: title.y - 5,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 300, 50, 0x4CAF50);
        bg.setStrokeStyle(4, 0x2E7D32);
        
        const label = this.add.text(0, 0, text, {
            fontSize: '16px',
            fontFamily: 'Press Start 2P',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        button.add([bg, label]);
        button.setSize(300, 50);
        button.setInteractive({ useHandCursor: true });
        
        button.on('pointerover', () => {
            bg.setFillStyle(0x66BB6A);
            button.setScale(1.05);
        });
        
        button.on('pointerout', () => {
            bg.setFillStyle(0x4CAF50);
            button.setScale(1);
        });
        
        button.on('pointerdown', () => {
            button.setScale(0.95);
        });
        
        button.on('pointerup', () => {
            button.setScale(1.05);
            callback();
        });
        
        return button;
    }
    
    createCloud(x, y, scale) {
        const cloud = this.add.container(x, y);
        
        const circles = [
            this.add.circle(0, 0, 15, 0xFFFFFF, 0.8),
            this.add.circle(-10, 5, 12, 0xFFFFFF, 0.8),
            this.add.circle(10, 5, 12, 0xFFFFFF, 0.8),
            this.add.circle(-5, -5, 10, 0xFFFFFF, 0.8),
            this.add.circle(5, -5, 10, 0xFFFFFF, 0.8)
        ];
        
        circles.forEach(circle => cloud.add(circle));
        cloud.setScale(scale);
        
        // Drift animation
        this.tweens.add({
            targets: cloud,
            x: x + 50,
            duration: 20000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    showHowToPlay() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Semi-transparent overlay
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
        overlay.setInteractive();
        
        // Instructions panel
        const panel = this.add.rectangle(width / 2, height / 2, 600, 450, 0x2C3E50);
        panel.setStrokeStyle(4, 0xFFD700);
        
        const instructions = this.add.text(width / 2, height / 2 - 150, 'HOW TO PLAY', {
            fontSize: '24px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700',
            align: 'center'
        }).setOrigin(0.5);
        
        const controls = this.add.text(width / 2, height / 2 - 80, 
            'CONTROLS:\n' +
            'Arrow Keys / WASD - Move\n' +
            'Space / Up - Jump\n' +
            'X - Bark Attack\n\n' +
            'GOALS:\n' +
            '🎾 Collect Tennis Balls (+25)\n' +
            '🦴 Collect Bones (+10)\n' +
            '🐕 Rescue Lost Dogs (+150)\n' +
            '🦝 Chase Away Enemies (+50)\n\n' +
            '3 Tennis Balls = ZOOMIES!\n', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P',
            color: '#FFFFFF',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5);
        
        const closeButton = this.createButton(width / 2, height / 2 + 180, 'GOT IT!', () => {
            overlay.destroy();
            panel.destroy();
            instructions.destroy();
            controls.destroy();
            closeButton.destroy();
        });
    }
}

