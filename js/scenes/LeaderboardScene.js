// Leaderboard Scene
class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
    }
    
    init(data) {
        this.returnTo = data.returnTo || 'MainMenuScene';
        this.highlightName = data.highlight || null;
    }
    
    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Background gradient
        for (let i = 0; i < 10; i++) {
            const shade = 30 + i * 15;
            this.add.rectangle(
                width / 2,
                i * (height / 10),
                width,
                height / 10,
                Phaser.Display.Color.GetColor(shade, shade + 40, shade + 80)
            ).setOrigin(0.5, 0);
        }
        
        // Title
        const title = this.add.text(width / 2, 50, 'LEADERBOARD', {
            fontSize: '36px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        // Trophy icon
        this.add.text(width / 2 - 150, 50, '🏆', {
            fontSize: '36px'
        });
        
        this.add.text(width / 2 + 150, 50, '🏆', {
            fontSize: '36px'
        });
        
        // Get leaderboard data
        const leaderboard = gameManager.getLeaderboard();
        
        // Leaderboard panel
        const panelY = 120;
        const panelHeight = 380;
        
        const panel = this.add.rectangle(width / 2, panelY + panelHeight / 2, 650, panelHeight, 0x1a1a2e);
        panel.setStrokeStyle(4, 0xFFD700);
        
        // Headers
        this.add.text(width / 2 - 280, panelY + 20, 'RANK', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700'
        });
        
        this.add.text(width / 2 - 180, panelY + 20, 'NAME', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700'
        });
        
        this.add.text(width / 2 - 20, panelY + 20, 'SCORE', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700'
        });
        
        this.add.text(width / 2 + 150, panelY + 20, 'LEVEL', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700'
        });
        
        // Divider line
        const divider = this.add.rectangle(width / 2, panelY + 45, 620, 2, 0xFFD700);
        
        // Display leaderboard entries
        if (leaderboard.length === 0) {
            this.add.text(width / 2, panelY + 180, 'No scores yet!\nBe the first!', {
                fontSize: '18px',
                fontFamily: 'Press Start 2P',
                color: '#888888',
                align: 'center',
                lineSpacing: 10
            }).setOrigin(0.5);
        } else {
            let entryY = panelY + 70;
            
            leaderboard.forEach((entry, index) => {
                const rank = index + 1;
                const isHighlighted = this.highlightName && entry.nickname === this.highlightName;
                
                // Highlight background for player's entry
                if (isHighlighted) {
                    const highlight = this.add.rectangle(width / 2, entryY + 10, 620, 30, 0x4CAF50, 0.3);
                }
                
                // Rank with medal for top 3
                let rankDisplay = rank.toString();
                if (rank === 1) rankDisplay = '🥇 1';
                else if (rank === 2) rankDisplay = '🥈 2';
                else if (rank === 3) rankDisplay = '🥉 3';
                
                const color = isHighlighted ? '#00FF00' : '#FFFFFF';
                
                this.add.text(width / 2 - 280, entryY, rankDisplay, {
                    fontSize: '14px',
                    fontFamily: 'Press Start 2P',
                    color: color
                });
                
                this.add.text(width / 2 - 180, entryY, entry.nickname, {
                    fontSize: '14px',
                    fontFamily: 'Press Start 2P',
                    color: color
                });
                
                this.add.text(width / 2 - 20, entryY, entry.score.toString(), {
                    fontSize: '14px',
                    fontFamily: 'Press Start 2P',
                    color: color
                });
                
                this.add.text(width / 2 + 150, entryY, `Lvl ${entry.level}`, {
                    fontSize: '14px',
                    fontFamily: 'Press Start 2P',
                    color: color
                });
                
                entryY += 32;
            });
        }
        
        // Best score display
        const bestScore = gameManager.getBestScore();
        if (bestScore > 0) {
            this.add.text(width / 2, height - 120, `🌟 Best Score: ${bestScore} 🌟`, {
                fontSize: '14px',
                fontFamily: 'Press Start 2P',
                color: '#FFD700',
                stroke: '#000',
                strokeThickness: 3
            }).setOrigin(0.5);
        }
        
        // Back button
        const backButton = this.createButton(width / 2, height - 60, 'BACK TO MENU', () => {
            this.sound.play('collect', { volume: 0.5 });
            this.scene.start(this.returnTo);
        });
        
        // Confetti effect for top score
        if (leaderboard.length > 0 && this.highlightName && leaderboard[0].nickname === this.highlightName) {
            this.createConfetti();
        }
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
    
    createConfetti() {
        const width = this.cameras.main.width;
        
        // Create colorful particle explosions
        const colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
        
        for (let i = 0; i < 5; i++) {
            this.time.delayedCall(i * 200, () => {
                const particles = this.add.particles(width / 2, 100, 'particle', {
                    speed: { min: 200, max: 400 },
                    angle: { min: 0, max: 360 },
                    scale: { start: 1, end: 0 },
                    blendMode: 'ADD',
                    lifespan: 2000,
                    quantity: 20,
                    tint: colors
                });
                
                this.time.delayedCall(2500, () => particles.destroy());
            });
        }
    }
}

