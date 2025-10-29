// Base Enemy Class
class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.enemyType = type; // 'squirrel' or 'raccoon'
        this.setCollideWorldBounds(true);
        this.setBounce(0.1);
        
        // Enemy state
        this.isStunned = false;
        this.stunDuration = 2000;
        this.defeated = false;
        
        // Movement properties
        this.patrolSpeed = type === 'squirrel' ? 60 : 80;
        this.patrolDistance = 150;
        this.startX = x;
        this.direction = 1;
        
        // Set body size based on type
        if (type === 'squirrel') {
            this.body.setSize(24, 24);
        } else {
            this.body.setSize(32, 32);
        }
        
        this.setVelocityX(this.patrolSpeed * this.direction);
    }
    
    update() {
        if (this.defeated || this.isStunned) {
            this.setVelocityX(0);
            return;
        }
        
        // Simple patrol AI
        const distance = Math.abs(this.x - this.startX);
        
        if (distance > this.patrolDistance) {
            this.direction *= -1;
            this.setVelocityX(this.patrolSpeed * this.direction);
            this.setFlipX(this.direction < 0);
        }
        
        // Update animation
        if (this.body.velocity.x !== 0) {
            this.anims.play(`${this.enemyType}_walk`, true);
        } else {
            this.anims.play(`${this.enemyType}_idle`, true);
        }
    }
    
    stun() {
        if (this.isStunned || this.defeated) return;
        
        this.isStunned = true;
        this.setVelocity(0, 0);
        this.setTint(0xaaaaaa);
        
        // Dizzy stars effect
        const stars = this.scene.add.text(this.x, this.y - 40, '★ ★ ★', {
            fontSize: '16px',
            color: '#FFD700'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: stars,
            y: stars.y - 20,
            alpha: 0,
            duration: this.stunDuration,
            onComplete: () => stars.destroy()
        });
        
        this.scene.time.delayedCall(this.stunDuration, () => {
            if (!this.defeated) {
                this.isStunned = false;
                this.clearTint();
                this.setVelocityX(this.patrolSpeed * this.direction);
            }
        });
    }
    
    defeat() {
        if (this.defeated) return;
        
        this.defeated = true;
        this.isStunned = false;
        this.setVelocity(0, -200);
        this.setAngularVelocity(400);
        this.setTint(0x888888);
        
        // Play defeat sound
        this.scene.sound.play('enemyDefeat', { volume: 0.3 });
        
        // Create puff effect
        const puff = this.scene.add.circle(this.x, this.y, 20, 0xFFFFFF, 0.5);
        this.scene.tweens.add({
            targets: puff,
            radius: 40,
            alpha: 0,
            duration: 300,
            onComplete: () => puff.destroy()
        });
        
        // Screen shake
        this.scene.cameras.main.shake(100, 0.005);
        
        // Award points
        gameManager.defeatEnemy();
        
        // Remove after animation
        this.scene.time.delayedCall(1000, () => {
            this.destroy();
        });
    }
    
    getHitByBark(barkData) {
        // Check if enemy is in bark range
        const distance = Phaser.Math.Distance.Between(this.x, this.y, barkData.x, barkData.y);
        
        if (distance < barkData.range) {
            this.stun();
            return true;
        }
        return false;
    }
}

// Squirrel Enemy
class Squirrel extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'squirrel');
        this.patrolSpeed = 60;
    }
}

// Raccoon Enemy (faster, more dangerous)
class Raccoon extends Enemy {
    constructor(scene, x, y) {
        super(scene, x, y, 'raccoon');
        this.patrolSpeed = 90;
        this.patrolDistance = 200;
    }
}

