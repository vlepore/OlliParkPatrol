// Olli the Goldendoodle Player Class
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Physics properties
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        this.setGravityY(0);
        this.body.setSize(28, 32);
        
        // Player state
        this.health = 3;
        this.isInvulnerable = false;
        this.invulnerabilityDuration = 2000;
        this.zoomiesActive = false;
        this.zoomiesSpeed = 300;
        this.normalSpeed = 160;
        this.jumpVelocity = -380;
        
        // Bark attack
        this.barkCooldown = false;
        this.barkCooldownTime = 500;
        this.barkRange = 60;
        
        // Super Sniffer effect
        this.snifferGlow = null;
        this.nearHiddenDog = false;
        
        // Controls
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.wasd = {
            up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        };
        this.barkKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Animation state
        this.facing = 'right';
        this.idleTime = 0;
        this.isBarking = false;
        
        // Mobile controls state
        this.mobileControls = {
            left: false,
            right: false,
            jump: false
        };
        
        // Create sniffer glow effect
        this.createSnifferGlow(scene);
    }
    
    createSnifferGlow(scene) {
        this.snifferGlow = scene.add.circle(this.x, this.y - 10, 15, 0xFFD700, 0.3);
        this.snifferGlow.setVisible(false);
        
        // Pulse animation
        scene.tweens.add({
            targets: this.snifferGlow,
            alpha: { from: 0.3, to: 0.7 },
            scale: { from: 1, to: 1.3 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }
    
    update() {
        const speed = this.zoomiesActive ? this.zoomiesSpeed : this.normalSpeed;
        
        // Horizontal movement (keyboard + mobile)
        const leftPressed = this.cursors.left.isDown || this.wasd.left.isDown || this.mobileControls.left;
        const rightPressed = this.cursors.right.isDown || this.wasd.right.isDown || this.mobileControls.right;
        
        if (leftPressed) {
            this.setVelocityX(-speed);
            this.facing = 'left';
            this.setFlipX(true);
            this.idleTime = 0;
        } else if (rightPressed) {
            this.setVelocityX(speed);
            this.facing = 'right';
            this.setFlipX(false);
            this.idleTime = 0;
        } else {
            this.setVelocityX(0);
            this.idleTime++;
        }
        
        // Jumping (keyboard + mobile)
        const jumpPressed = this.cursors.up.isDown || this.wasd.up.isDown || this.spaceKey.isDown || this.mobileControls.jump;
        if (jumpPressed && this.body.touching.down) {
            this.setVelocityY(this.jumpVelocity);
            if (this.scene.sound.get('jump')) {
                this.scene.sound.play('jump', { volume: 0.3 });
            }
            // Reset jump flag for mobile (to prevent continuous jumping)
            if (this.mobileControls.jump) {
                this.scene.time.delayedCall(100, () => {
                    this.mobileControls.jump = false;
                });
            }
        }
        
        // Bark attack
        if (Phaser.Input.Keyboard.JustDown(this.barkKey) && !this.barkCooldown) {
            this.bark();
        }
        
        // Update sniffer glow position
        if (this.snifferGlow) {
            this.snifferGlow.setPosition(this.x, this.y - 20);
        }
        
        // Update animations
        this.updateAnimation();
    }
    
    updateAnimation() {
        if (this.isBarking) {
            this.anims.play('bark', true);
        } else if (this.body.velocity.y < 0) {
            this.anims.play('jump', true);
        } else if (this.body.velocity.y > 0) {
            this.anims.play('fall', true);
        } else if (this.body.velocity.x !== 0) {
            this.anims.play('run', true);
        } else {
            if (this.idleTime > 180) { // 3 seconds at 60fps
                this.anims.play('sit', true);
            } else {
                this.anims.play('idle', true);
            }
        }
    }
    
    bark() {
        this.barkCooldown = true;
        this.isBarking = true;
        
        this.scene.sound.play('bark', { volume: 0.5 });
        
        // Create bark visual effect
        const barkWave = this.scene.add.circle(
            this.x + (this.facing === 'right' ? 30 : -30),
            this.y,
            10,
            0xFFFFFF,
            0.5
        );
        
        this.scene.tweens.add({
            targets: barkWave,
            radius: this.barkRange,
            alpha: 0,
            duration: 300,
            onComplete: () => barkWave.destroy()
        });
        
        // Check for enemies in range
        this.checkBarkHit();
        
        // Reset bark state
        this.scene.time.delayedCall(200, () => {
            this.isBarking = false;
        });
        
        this.scene.time.delayedCall(this.barkCooldownTime, () => {
            this.barkCooldown = false;
        });
    }
    
    checkBarkHit() {
        // Will be used to detect enemies in range
        // Handled by GameScene with overlap detection
        this.scene.events.emit('barkAttack', {
            x: this.x + (this.facing === 'right' ? this.barkRange/2 : -this.barkRange/2),
            y: this.y,
            range: this.barkRange
        });
    }
    
    takeDamage() {
        if (this.isInvulnerable) return false;
        
        const stillAlive = gameManager.takeDamage();
        this.health = gameManager.health;
        
        if (stillAlive) {
            this.isInvulnerable = true;
            this.scene.sound.play('hurt', { volume: 0.4 });
            
            // Flash effect
            this.scene.tweens.add({
                targets: this,
                alpha: 0.3,
                duration: 100,
                yoyo: true,
                repeat: 10
            });
            
            // Knockback
            this.setVelocity(this.facing === 'right' ? -200 : 200, -200);
            
            this.scene.time.delayedCall(this.invulnerabilityDuration, () => {
                this.isInvulnerable = false;
                this.setAlpha(1);
            });
            
            return true;
        } else {
            this.die();
            return false;
        }
    }
    
    die() {
        this.setVelocity(0, -300);
        this.setAlpha(0.5);
        this.scene.sound.play('death', { volume: 0.5 });
        
        this.scene.time.delayedCall(1000, () => {
            this.scene.scene.start('GameOverScene');
        });
    }
    
    activateZoomies(duration = 5000) {
        if (this.zoomiesActive) return;
        
        this.zoomiesActive = true;
        this.setTint(0xFFFF00); // Yellow tint
        
        // Particle effect
        const particles = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: -50, max: 50 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'ADD',
            lifespan: 300,
            tint: 0xFFD700,
            frequency: 50
        });
        
        particles.startFollow(this);
        
        this.scene.time.delayedCall(duration, () => {
            this.zoomiesActive = false;
            this.clearTint();
            particles.stop();
            this.scene.time.delayedCall(500, () => {
                if (particles) particles.destroy();
            });
            gameManager.deactivateZoomies();
        });
    }
    
    showSnifferGlow(show) {
        this.nearHiddenDog = show;
        if (this.snifferGlow) {
            this.snifferGlow.setVisible(show);
        }
    }
    
    destroy() {
        if (this.snifferGlow) {
            this.snifferGlow.destroy();
        }
        super.destroy();
    }
}

