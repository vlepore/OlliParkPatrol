// Base Collectible Class
class Collectible extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.collectibleType = type; // 'tennisBall', 'bone', 'treat'
        this.setCollideWorldBounds(false);
        this.body.setAllowGravity(false);
        
        // Set larger collision body for better detection
        this.setSize(24, 24);
        this.body.setSize(24, 24);
        this.body.setOffset(0, 0);
        
        // Floating animation
        this.startY = y;
        this.floatOffset = 0;
        this.baseY = y;
        
        // Collected flag to prevent double collection
        this.isCollecting = false;
        
        // Add sparkle effect
        this.createSparkle(scene);
    }
    
    createSparkle(scene) {
        const sparkle = scene.add.circle(this.x, this.y, 3, 0xFFFFFF, 0.6);
        this.sparkle = sparkle;
        scene.tweens.add({
            targets: sparkle,
            alpha: 0,
            scale: 2,
            duration: 800,
            repeat: -1,
            onRepeat: () => {
                if (sparkle && sparkle.active) {
                    sparkle.setAlpha(0.6);
                    sparkle.setScale(1);
                }
            }
        });
    }
    
    update(time) {
        if (!this.active || this.isCollecting) return;
        
        // Gentle floating motion
        this.floatOffset = Math.sin(time * 0.003) * 5;
        this.y = this.baseY + this.floatOffset;
        
        // CRITICAL: Force physics body to sync with sprite position
        if (this.body) {
            this.body.position.y = this.y - this.body.halfHeight;
            this.body.updateFromGameObject();
        }
        
        if (this.sparkle && this.sparkle.active) {
            this.sparkle.setPosition(this.x, this.y);
        }
        
        // Rotate
        this.angle += 1;
    }
    
    collect(player, scene) {
        // Prevent double collection
        if (!this.active || this.isCollecting) return;
        
        this.isCollecting = true;
        
        // Play collect sound
        if (scene.sound.get('collect')) {
            scene.sound.play('collect', { volume: 0.4 });
        }
        
        // Create particle burst
        const particles = scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.4, end: 0 },
            blendMode: 'ADD',
            lifespan: 400,
            quantity: 8,
            tint: this.getTint(),
            emitting: false
        });
        
        particles.explode(8);
        
        scene.time.delayedCall(500, () => {
            if (particles && particles.active) particles.destroy();
        });
        
        // Create floating score text - larger on mobile
        const points = this.getPoints();
        if (points > 0) {
            const isMobile = scene.cameras.main.width <= 600;
            const scoreText = scene.add.text(this.x, this.y, `+${points}`, {
                fontSize: isMobile ? '28px' : '20px',
                color: '#FFD700',
                fontFamily: 'Press Start 2P',
                stroke: '#000',
                strokeThickness: isMobile ? 6 : 4
            }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
            
            // Convert to screen position
            const screenX = this.x - scene.cameras.main.scrollX;
            const screenY = this.y - scene.cameras.main.scrollY;
            scoreText.setPosition(screenX, screenY);
            
            scene.tweens.add({
                targets: scoreText,
                y: scoreText.y - 50,
                alpha: 0,
                duration: 800,
                onComplete: () => {
                    if (scoreText) scoreText.destroy();
                }
            });
        }
        
        // Update game state based on type
        this.applyEffect(player);
        
        // Destroy collectible immediately and remove from physics
        if (this.sparkle && this.sparkle.active) {
            this.sparkle.destroy();
        }
        
        // Disable physics body first
        if (this.body) {
            this.body.enable = false;
        }
        
        // Remove from scene
        this.setActive(false);
        this.setVisible(false);
        
        // Destroy the sprite
        this.destroy();
    }
    
    getTint() {
        switch(this.collectibleType) {
            case 'tennisBall': return 0xFFFF00;
            case 'bone': return 0xFFFFFF;
            case 'treat': return 0xFF69B4;
            default: return 0xFFFFFF;
        }
    }
    
    getPoints() {
        switch(this.collectibleType) {
            case 'tennisBall': return 25;
            case 'bone': return 10;
            case 'treat': return 0;
            default: return 0;
        }
    }
    
    applyEffect(player) {
        switch(this.collectibleType) {
            case 'tennisBall':
                gameManager.addTennisBall();
                // Check for zoomies activation
                if (gameManager.zoomiesActive) {
                    player.activateZoomies();
                }
                break;
            case 'bone':
                gameManager.collectBone();
                // Reset tennis ball streak (not consecutive)
                gameManager.resetStreak();
                break;
            case 'treat':
                gameManager.collectTreat();
                player.health = gameManager.health;
                // Reset tennis ball streak
                gameManager.resetStreak();
                break;
        }
    }
}

// Tennis Ball
class TennisBall extends Collectible {
    constructor(scene, x, y) {
        super(scene, x, y, 'tennisBall');
    }
}

// Bone
class Bone extends Collectible {
    constructor(scene, x, y) {
        super(scene, x, y, 'bone');
    }
}

// Treat (healing item)
class Treat extends Collectible {
    constructor(scene, x, y) {
        super(scene, x, y, 'treat');
    }
}

