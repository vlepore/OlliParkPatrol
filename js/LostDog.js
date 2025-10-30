// Lost Dog Class - Hidden dogs to rescue in levels
class LostDog extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, breed = 'default') {
        super(scene, x, y, 'lostDog');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.breed = breed; // Could be 'husky', 'beagle', 'corgi', etc.
        this.setCollideWorldBounds(false);
        this.body.setAllowGravity(false);
        
        // Set proper collision body - larger for better detection
        this.setSize(30, 30);
        this.body.setSize(30, 30);
        this.body.setOffset(-3, -3);
        
        // Hidden initially
        this.isHidden = true;
        this.isRescued = false;
        this.setAlpha(0.3); // Semi-transparent when hidden
        
        // Sad whimper effect
        this.createWhimperEffect(scene);
        
        // Exclamation mark when player nearby
        this.exclamation = null;
    }
    
    createWhimperEffect(scene) {
        // Small floating hearts/notes to indicate presence
        this.whimperParticles = scene.add.particles(this.x, this.y - 20, 'particle', {
            speed: { min: 10, max: 20 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 1500,
            frequency: 2000,
            quantity: 1,
            tint: 0xADD8E6, // Light blue
            emitting: false
        });
    }
    
    update() {
        if (this.isRescued) return;
        
        // Bob up and down gently
        this.y += Math.sin(Date.now() * 0.003) * 0.2;
    }
    
    revealToPlayer(player) {
        if (!this.isHidden) return;
        
        this.isHidden = false;
        
        // Fade in
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            duration: 500
        });
        
        // Show exclamation mark
        if (!this.exclamation) {
            this.exclamation = this.scene.add.text(this.x, this.y - 50, '!', {
                fontSize: '32px',
                color: '#FF0000',
                fontFamily: 'Arial',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            this.scene.tweens.add({
                targets: this.exclamation,
                y: this.exclamation.y - 10,
                duration: 300,
                yoyo: true,
                repeat: 2,
                onComplete: () => {
                    if (this.exclamation) this.exclamation.destroy();
                }
            });
        }
        
        // Start whimpering
        this.whimperParticles.start();
    }
    
    rescue(player, scene) {
        if (this.isRescued) return;
        
        this.isRescued = true;
        
        // Play happy bark sound
        if (scene.sound.get('dogRescue')) {
            scene.sound.play('dogRescue', { volume: 0.5 });
        }
        
        // Show hearts
        const hearts = scene.add.particles(this.x, this.y - 30, 'particle', {
            speed: { min: 20, max: 60 },
            scale: { start: 0.6, end: 0 },
            blendMode: 'ADD',
            lifespan: 1000,
            quantity: 10,
            tint: 0xFF69B4, // Pink hearts
            emitting: false
        });
        
        hearts.explode(10);
        
        scene.time.delayedCall(1200, () => {
            if (hearts) hearts.destroy();
        });
        
        // Floating text - larger on mobile
        const isMobile = scene.cameras.main.width <= 600;
        const rescueText = scene.add.text(this.x, this.y - 60, 'RESCUED!\n+150', {
            fontSize: isMobile ? '32px' : '24px',
            color: '#00FF00',
            fontFamily: 'Press Start 2P',
            stroke: '#000',
            strokeThickness: isMobile ? 6 : 4,
            align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(100);
        
        scene.tweens.add({
            targets: rescueText,
            y: rescueText.y - 80,
            alpha: 0,
            duration: 1500,
            onComplete: () => rescueText.destroy()
        });
        
        // Happy jump animation
        this.setVelocityY(-150);
        scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 800
        });
        
        // Update game state
        gameManager.rescueDog();
        
        // Stop whimper effect
        this.whimperParticles.stop();
        
        // Fade out and destroy
        scene.time.delayedCall(1500, () => {
            scene.tweens.add({
                targets: this,
                alpha: 0,
                scale: 0,
                duration: 500,
                onComplete: () => {
                    this.whimperParticles.destroy();
                    this.destroy();
                }
            });
        });
    }
    
    destroy() {
        if (this.exclamation) this.exclamation.destroy();
        if (this.whimperParticles) this.whimperParticles.destroy();
        super.destroy();
    }
}

