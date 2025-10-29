// Game Over Scene
class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    init(data) {
        this.bonuses = data.bonuses || {
            perfectRescue: false,
            speedPup: false,
            cleanPaws: false,
            total: 0
        };
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background gradient
        for (let i = 0; i < 10; i++) {
            const shade = 30 + i * 20;
            this.add.rectangle(
                width / 2,
                i * (height / 10),
                width,
                height / 10,
                Phaser.Display.Color.GetColor(shade, shade, shade + 30)
            ).setOrigin(0.5, 0);
        }
        
        // Celebration or game over title
        const isVictory = gameManager.health > 0;
        const titleText = isVictory ? 'LEVEL COMPLETE!' : 'GAME OVER';
        const titleColor = isVictory ? '#00FF00' : '#FF4444';
        
        const title = this.add.text(width / 2, 80, titleText, {
            fontSize: '40px',
            fontFamily: 'Press Start 2P',
            color: titleColor,
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Olli sprite
        const olliSprite = this.add.sprite(width / 2, 160, 'player').setScale(2);
        if (isVictory) {
            this.tweens.add({
                targets: olliSprite,
                y: 160 - 10,
                duration: 500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        } else {
            olliSprite.setAlpha(0.5);
        }
        
        // Score breakdown
        let yPos = 230;
        
        this.add.text(width / 2, yPos, 'FINAL SCORE', {
            fontSize: '20px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        yPos += 40;
        
        const baseScore = gameManager.score - this.bonuses.total;
        this.add.text(width / 2, yPos, `Base Score: ${baseScore}`, {
            fontSize: '14px',
            fontFamily: 'Press Start 2P',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        yPos += 30;
        
        // Display bonuses
        if (this.bonuses.perfectRescue) {
            this.add.text(width / 2, yPos, '🎖️ Perfect Rescue: +500', {
                fontSize: '12px',
                fontFamily: 'Press Start 2P',
                color: '#00FF00'
            }).setOrigin(0.5);
            yPos += 25;
        }
        
        if (this.bonuses.speedPup) {
            this.add.text(width / 2, yPos, '⚡ Speed Pup: +250', {
                fontSize: '12px',
                fontFamily: 'Press Start 2P',
                color: '#FFFF00'
            }).setOrigin(0.5);
            yPos += 25;
        }
        
        if (this.bonuses.cleanPaws) {
            this.add.text(width / 2, yPos, '✨ Clean Paws: +200', {
                fontSize: '12px',
                fontFamily: 'Press Start 2P',
                color: '#ADD8E6'
            }).setOrigin(0.5);
            yPos += 25;
        }
        
        if (this.bonuses.total === 0) {
            this.add.text(width / 2, yPos, 'No Bonuses', {
                fontSize: '12px',
                fontFamily: 'Press Start 2P',
                color: '#888888'
            }).setOrigin(0.5);
            yPos += 25;
        }
        
        yPos += 15;
        
        // Total score
        this.add.text(width / 2, yPos, `TOTAL: ${gameManager.score}`, {
            fontSize: '24px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        yPos += 50;
        
        // Name entry prompt
        this.add.text(width / 2, yPos, 'Enter Your Name (3 letters):', {
            fontSize: '14px',
            fontFamily: 'Press Start 2P',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        yPos += 30;
        
        // Name input
        this.playerName = '';
        this.nameText = this.add.text(width / 2, yPos, '___', {
            fontSize: '32px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Cursor blink
        this.tweens.add({
            targets: this.nameText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Keyboard input for name
        this.input.keyboard.on('keydown', this.handleNameInput, this);
        
        // Buttons (hidden until name is entered)
        this.continueButton = this.createButton(width / 2, height - 120, 'SAVE & CONTINUE', () => {
            this.saveAndContinue();
        });
        this.continueButton.setVisible(false);
        
        this.skipButton = this.createButton(width / 2, height - 60, 'SKIP', () => {
            this.skipToMenu();
        });
    }
    
    handleNameInput(event) {
        if (this.playerName.length >= 3 && event.key !== 'Backspace') return;
        
        if (event.key === 'Backspace') {
            this.playerName = this.playerName.slice(0, -1);
        } else if (event.key.length === 1 && /^[A-Za-z0-9]$/.test(event.key)) {
            this.playerName += event.key.toUpperCase();
        }
        
        // Update display
        let display = this.playerName;
        while (display.length < 3) {
            display += '_';
        }
        this.nameText.setText(display);
        
        // Show continue button when name is complete
        if (this.playerName.length === 3) {
            this.continueButton.setVisible(true);
            this.nameText.clearTween();
            this.nameText.setAlpha(1);
        } else {
            this.continueButton.setVisible(false);
        }
    }
    
    saveAndContinue() {
        if (this.playerName.length === 3) {
            gameManager.saveScore(this.playerName);
            this.sound.play('collect', { volume: 0.5 });
            this.scene.start('LeaderboardScene', { returnTo: 'MainMenuScene', highlight: this.playerName });
        }
    }
    
    skipToMenu() {
        this.sound.play('collect', { volume: 0.5 });
        this.scene.start('MainMenuScene');
    }
    
    createButton(x, y, text, callback) {
        const button = this.add.container(x, y);
        
        const bg = this.add.rectangle(0, 0, 300, 45, 0x4CAF50);
        bg.setStrokeStyle(4, 0x2E7D32);
        
        const label = this.add.text(0, 0, text, {
            fontSize: '14px',
            fontFamily: 'Press Start 2P',
            color: '#FFFFFF'
        }).setOrigin(0.5);
        
        button.add([bg, label]);
        button.setSize(300, 45);
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
}

