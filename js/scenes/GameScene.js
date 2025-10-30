// Main Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    init(data) {
        this.currentLevel = data.level || 1;
    }
    
    create() {
        // Set up level data
        const levelData = this.getLevelData(this.currentLevel);
        this.levelData = levelData;
        
        // Start level timing
        gameManager.startLevel(this.currentLevel, levelData.totalDogs);
        
        // Create world
        this.createWorld(levelData);
        
        // Create player
        this.player = new Player(this, 100, 400);
        
        // Create mobile controls
        this.mobileControls = new MobileControls(this);
        
        // Create collectibles groups
        this.tennisBalls = this.physics.add.group();
        this.bones = this.physics.add.group();
        this.treats = this.physics.add.group();
        
        // Create enemies group
        this.enemies = this.physics.add.group();
        
        // Create lost dogs group
        this.lostDogs = this.physics.add.group();
        
        // Spawn level objects
        this.spawnCollectibles(levelData);
        this.spawnEnemies(levelData);
        this.spawnLostDogs(levelData);
        
        // Set up physics collisions
        this.setupCollisions();
        
        // Create HUD
        this.createHUD();
        
        // Set up camera
        this.cameras.main.setBounds(0, 0, levelData.worldWidth, 600);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.physics.world.setBounds(0, 0, levelData.worldWidth, 600);
        
        // Listen for bark attacks
        this.events.on('barkAttack', this.handleBarkAttack, this);
        
        // Pause key
        this.input.keyboard.on('keydown-ESC', this.pauseGame, this);
        
        // Level timer
        this.levelTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }
    
    getLevelData(level) {
        const levels = {
            1: {
                name: 'Sunny Start',
                worldWidth: 2400,
                timeGoal: 120, // 2 minutes
                totalDogs: 2,
                backgroundColor: 0x87CEEB,
                slippery: false,
                platforms: [
                    { x: 0, y: 568, width: 2400 }, // Ground
                    { x: 300, y: 450, width: 128 },
                    { x: 500, y: 380, width: 128 },
                    { x: 700, y: 310, width: 128 },
                    { x: 900, y: 380, width: 128 },
                    { x: 1100, y: 450, width: 128 },
                    { x: 1400, y: 400, width: 192 },
                    { x: 1700, y: 350, width: 128 },
                    { x: 2000, y: 450, width: 192 }
                ],
                decorations: [
                    { type: 'tree', x: 200, y: 488 },
                    { type: 'tree', x: 800, y: 488 },
                    { type: 'tree', x: 1200, y: 488 },
                    { type: 'tree', x: 1800, y: 488 },
                    { type: 'bench', x: 600, y: 528 },
                    { type: 'bench', x: 1600, y: 528 }
                ],
                tennisBalls: [
                    { x: 250, y: 400 },
                    { x: 520, y: 330 },
                    { x: 720, y: 260 },
                    { x: 920, y: 330 },
                    { x: 1120, y: 400 },
                    { x: 1420, y: 350 },
                    { x: 1720, y: 300 },
                    { x: 2020, y: 400 },
                    { x: 1500, y: 350 },
                    { x: 400, y: 520 }
                ],
                bones: [
                    { x: 150, y: 520 },
                    { x: 350, y: 400 },
                    { x: 550, y: 330 },
                    { x: 750, y: 260 },
                    { x: 950, y: 330 },
                    { x: 1150, y: 400 },
                    { x: 1350, y: 520 },
                    { x: 1550, y: 350 },
                    { x: 1750, y: 300 },
                    { x: 1950, y: 520 },
                    { x: 2100, y: 400 },
                    { x: 2200, y: 520 },
                    { x: 1000, y: 520 },
                    { x: 1300, y: 520 },
                    { x: 450, y: 520 }
                ],
                treats: [
                    { x: 650, y: 280 },
                    { x: 1450, y: 350 }
                ],
                enemies: [
                    { type: 'squirrel', x: 400, y: 500 },
                    { type: 'squirrel', x: 1000, y: 500 },
                    { type: 'squirrel', x: 1800, y: 500 }
                ],
                lostDogs: [
                    { x: 650, y: 500, hidden: true }, // Under bench
                    { x: 1750, y: 300, hidden: true } // On platform
                ]
            },
            2: {
                name: 'Rainy Day Chase',
                worldWidth: 2800,
                timeGoal: 150, // 2.5 minutes
                totalDogs: 3,
                backgroundColor: 0x708090,
                slippery: true,
                platforms: [
                    { x: 0, y: 568, width: 2800 }, // Ground
                    { x: 250, y: 480, width: 128 },
                    { x: 450, y: 400, width: 96 },
                    { x: 650, y: 320, width: 96 },
                    { x: 850, y: 400, width: 128 },
                    { x: 1050, y: 480, width: 160 },
                    { x: 1300, y: 380, width: 128 },
                    { x: 1550, y: 300, width: 96 },
                    { x: 1750, y: 380, width: 128 },
                    { x: 2000, y: 450, width: 192 },
                    { x: 2300, y: 380, width: 160 },
                    { x: 2550, y: 480, width: 128 }
                ],
                decorations: [
                    { type: 'tree', x: 150, y: 488 },
                    { type: 'tree', x: 550, y: 488 },
                    { type: 'tree', x: 950, y: 488 },
                    { type: 'tree', x: 1450, y: 488 },
                    { type: 'tree', x: 1900, y: 488 },
                    { type: 'tree', x: 2400, y: 488 },
                    { type: 'bench', x: 350, y: 528 },
                    { type: 'bench', x: 1150, y: 440 },
                    { type: 'bench', x: 2100, y: 410 }
                ],
                tennisBalls: [
                    { x: 270, y: 430 },
                    { x: 470, y: 350 },
                    { x: 670, y: 270 },
                    { x: 870, y: 350 },
                    { x: 1320, y: 330 },
                    { x: 1570, y: 250 },
                    { x: 2020, y: 400 },
                    { x: 2320, y: 330 },
                    { x: 2570, y: 430 },
                    { x: 1770, y: 330 },
                    { x: 1100, y: 430 },
                    { x: 200, y: 520 }
                ],
                bones: [
                    { x: 300, y: 520 },
                    { x: 500, y: 350 },
                    { x: 700, y: 270 },
                    { x: 900, y: 350 },
                    { x: 1100, y: 430 },
                    { x: 1350, y: 330 },
                    { x: 1600, y: 250 },
                    { x: 1800, y: 330 },
                    { x: 2050, y: 400 },
                    { x: 2350, y: 330 },
                    { x: 2600, y: 430 },
                    { x: 800, y: 520 },
                    { x: 1250, y: 520 },
                    { x: 1700, y: 520 },
                    { x: 2200, y: 520 }
                ],
                treats: [
                    { x: 670, y: 270 },
                    { x: 1570, y: 250 },
                    { x: 2320, y: 330 }
                ],
                enemies: [
                    { type: 'raccoon', x: 500, y: 500 },
                    { type: 'raccoon', x: 1200, y: 500 },
                    { type: 'raccoon', x: 1800, y: 500 },
                    { type: 'raccoon', x: 2400, y: 500 }
                ],
                lostDogs: [
                    { x: 400, y: 500, hidden: true }, // Under bench
                    { x: 1200, y: 410, hidden: true }, // Under bench
                    { x: 2150, y: 380, hidden: true } // Under bench
                ]
            }
        };
        
        return levels[level] || levels[1];
    }
    
    createWorld(levelData) {
        // Set background color
        this.cameras.main.setBackgroundColor(levelData.backgroundColor);
        
        // Add rain effect for level 2
        if (levelData.slippery) {
            this.createRainEffect();
        }
        
        // Create platforms group
        this.platforms = this.physics.add.staticGroup();
        
        // Create ground and platforms
        levelData.platforms.forEach(platform => {
            const numTiles = Math.floor(platform.width / 32);
            for (let i = 0; i < numTiles; i++) {
                const tile = this.platforms.create(
                    platform.x + (i * 32) + 16,
                    platform.y + 16,
                    platform.y > 550 ? 'ground' : 'platform'
                );
                tile.setScale(1).refreshBody();
            }
        });
        
        // Add decorations
        levelData.decorations.forEach(deco => {
            this.add.sprite(deco.x, deco.y, deco.type).setOrigin(0.5, 1);
        });
    }
    
    createRainEffect() {
        const particles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: this.levelData.worldWidth },
            y: -20,
            speedY: { min: 400, max: 600 },
            speedX: { min: -50, max: -30 },
            lifespan: 3000,
            scale: { start: 0.3, end: 0.1 },
            alpha: { start: 0.6, end: 0.2 },
            frequency: 10,
            tint: 0xADD8E6,
            maxParticles: 100
        });
        
        particles.setDepth(-1);
        particles.setScrollFactor(1, 0);
    }
    
    spawnCollectibles(levelData) {
        // Tennis balls
        levelData.tennisBalls.forEach(pos => {
            const ball = new TennisBall(this, pos.x, pos.y);
            this.tennisBalls.add(ball);
        });
        
        // Bones
        levelData.bones.forEach(pos => {
            const bone = new Bone(this, pos.x, pos.y);
            this.bones.add(bone);
        });
        
        // Treats
        levelData.treats.forEach(pos => {
            const treat = new Treat(this, pos.x, pos.y);
            this.treats.add(treat);
        });
    }
    
    spawnEnemies(levelData) {
        levelData.enemies.forEach(enemy => {
            let enemyObj;
            if (enemy.type === 'squirrel') {
                enemyObj = new Squirrel(this, enemy.x, enemy.y);
            } else {
                enemyObj = new Raccoon(this, enemy.x, enemy.y);
            }
            this.enemies.add(enemyObj);
        });
    }
    
    spawnLostDogs(levelData) {
        levelData.lostDogs.forEach(dog => {
            const lostDog = new LostDog(this, dog.x, dog.y);
            this.lostDogs.add(lostDog);
        });
    }
    
    setupCollisions() {
        // Player collisions
        this.physics.add.collider(this.player, this.platforms);
        
        // Apply slippery physics if rainy level
        if (this.levelData.slippery) {
            this.physics.add.collider(this.player, this.platforms, (player, platform) => {
                // Reduce friction on platforms
                player.body.setDragX(50);
            });
        } else {
            this.player.body.setDragX(800);
        }
        
        // Collectibles - use overlap with process callback for better detection
        this.physics.add.overlap(this.player, this.tennisBalls, this.collectItem, this.checkCollectible, this);
        this.physics.add.overlap(this.player, this.bones, this.collectItem, this.checkCollectible, this);
        this.physics.add.overlap(this.player, this.treats, this.collectItem, this.checkCollectible, this);
        
        // Enable collision detection for collectibles groups
        this.tennisBalls.setActive(true);
        this.bones.setActive(true);
        this.treats.setActive(true);
        
        // Enemies
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, this.checkEnemyCollision, this);
        
        // Lost Dogs
        this.physics.add.overlap(this.player, this.lostDogs, this.rescueDog, this.checkDogCollision, this);
    }
    
    checkCollectible(player, item) {
        // Process callback - check if item is active and not already being collected
        return item && item.active && !item.isCollecting;
    }
    
    checkEnemyCollision(player, enemy) {
        return enemy && enemy.active && !enemy.defeated;
    }
    
    checkDogCollision(player, dog) {
        return dog && dog.active && !dog.isRescued;
    }
    
    collectItem(player, item) {
        if (item && item.active && item.collect) {
            item.collect(player, this);
            this.updateHUD();
        }
    }
    
    hitEnemy(player, enemy) {
        if (enemy.defeated || enemy.isStunned) return;
        
        player.takeDamage();
        this.updateHUD();
    }
    
    rescueDog(player, dog) {
        if (dog && dog.active && !dog.isRescued && dog.rescue) {
            dog.rescue(player, this);
            this.updateHUD();
        }
    }
    
    handleBarkAttack(barkData) {
        // Check all enemies
        this.enemies.children.entries.forEach(enemy => {
            if (enemy.active && !enemy.defeated) {
                if (enemy.getHitByBark(barkData)) {
                    // Enemy was hit, check if we should defeat it
                    if (enemy.isStunned) {
                        this.time.delayedCall(500, () => {
                            if (enemy.active && enemy.isStunned) {
                                enemy.defeat();
                                this.updateHUD();
                            }
                        });
                    }
                }
            }
        });
    }
    
    createHUD() {
        // Create fixed HUD container
        this.hudContainer = this.add.container(0, 0).setScrollFactor(0).setDepth(100);
        
        // Background panel
        const hudBg = this.add.rectangle(10, 10, 280, 80, 0x000000, 0.5).setOrigin(0);
        
        // Score
        this.scoreText = this.add.text(20, 20, `Score: ${gameManager.score}`, {
            fontSize: '16px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700'
        });
        
        // Health hearts
        this.healthContainer = this.add.container(20, 50);
        this.updateHealthDisplay();
        
        // Zoomies meter
        this.zoomiesText = this.add.text(120, 50, `⚡: ${gameManager.tennisBallStreak}/3`, {
            fontSize: '14px',
            fontFamily: 'Press Start 2P',
            color: '#FFFF00'
        });
        
        // Timer
        this.timerText = this.add.text(20, 70, 'Time: 0:00', {
            fontSize: '12px',
            fontFamily: 'Press Start 2P',
            color: '#FFFFFF'
        });
        
        // Dogs rescued
        this.dogsText = this.add.text(170, 20, `🐕: ${gameManager.dogsRescued}/${gameManager.totalDogs}`, {
            fontSize: '14px',
            fontFamily: 'Press Start 2P',
            color: '#FFA500'
        });
        
        this.hudContainer.add([hudBg, this.scoreText, this.healthContainer, this.zoomiesText, this.timerText, this.dogsText]);
    }
    
    updateHealthDisplay() {
        this.healthContainer.removeAll(true);
        
        for (let i = 0; i < gameManager.maxHealth; i++) {
            const heart = this.add.text(i * 25, 0, i < gameManager.health ? '♥' : '♡', {
                fontSize: '20px',
                color: i < gameManager.health ? '#FF0000' : '#666666'
            });
            this.healthContainer.add(heart);
        }
    }
    
    updateHUD() {
        this.scoreText.setText(`Score: ${gameManager.score}`);
        this.updateHealthDisplay();
        this.zoomiesText.setText(`⚡: ${gameManager.tennisBallStreak}/3`);
        this.dogsText.setText(`🐕: ${gameManager.dogsRescued}/${gameManager.totalDogs}`);
        
        if (gameManager.zoomiesActive) {
            this.zoomiesText.setColor('#00FF00');
        } else {
            this.zoomiesText.setColor('#FFFF00');
        }
    }
    
    updateTimer() {
        const elapsed = Math.floor((Date.now() - gameManager.levelStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
    }
    
    checkLevelCompletion() {
        // Check if player reached the end of the level
        if (this.player.x > this.levelData.worldWidth - 200) {
            this.completeLevel();
        }
    }
    
    completeLevel() {
        // Calculate bonuses
        const bonuses = gameManager.calculateBonuses(this.levelData.timeGoal);
        
        // Move to next level or game over
        if (this.currentLevel < 2) {
            this.scene.start('GameScene', { level: this.currentLevel + 1 });
        } else {
            this.scene.start('GameOverScene', { bonuses: bonuses });
        }
    }
    
    pauseGame() {
        this.scene.pause();
        this.showPauseMenu();
    }
    
    showPauseMenu() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
            .setScrollFactor(0)
            .setDepth(200);
        
        const pauseText = this.add.text(width / 2, height / 2 - 50, 'PAUSED', {
            fontSize: '48px',
            fontFamily: 'Press Start 2P',
            color: '#FFD700'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        
        const resumeText = this.add.text(width / 2, height / 2 + 20, 'Press ESC to Resume', {
            fontSize: '16px',
            fontFamily: 'Press Start 2P',
            color: '#FFFFFF'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        
        const quitText = this.add.text(width / 2, height / 2 + 60, 'Press Q to Quit', {
            fontSize: '14px',
            fontFamily: 'Press Start 2P',
            color: '#AAAAAA'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        
        const resumeKey = this.input.keyboard.once('keydown-ESC', () => {
            overlay.destroy();
            pauseText.destroy();
            resumeText.destroy();
            quitText.destroy();
            this.scene.resume();
        });
        
        const quitKey = this.input.keyboard.once('keydown-Q', () => {
            this.scene.stop();
            this.scene.start('MainMenuScene');
        });
    }
    
    update(time, delta) {
        // Limit physics updates to prevent glitches
        const fixedDelta = Math.min(delta, 33); // Cap at ~30fps equivalent
        
        if (this.player && this.player.active) {
            this.player.update();
        }
        
        // Update enemies
        this.enemies.children.entries.forEach(enemy => {
            if (enemy && enemy.active && enemy.update) {
                enemy.update();
            }
        });
        
        // Update collectibles with physics sync - use actual time
        this.tennisBalls.children.entries.forEach(item => {
            if (item && item.active && item.update) {
                item.update(time);
            }
        });
        this.bones.children.entries.forEach(item => {
            if (item && item.active && item.update) {
                item.update(time);
            }
        });
        this.treats.children.entries.forEach(item => {
            if (item && item.active && item.update) {
                item.update(time);
            }
        });
        
        // Update lost dogs and check for player proximity
        this.lostDogs.children.entries.forEach(dog => {
            if (dog && dog.active && dog.update) {
                dog.update();
                
                // Super Sniffer: Reveal nearby dogs
                const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, dog.x, dog.y);
                if (distance < 150 && dog.isHidden && !dog.isRescued) {
                    dog.revealToPlayer(this.player);
                    this.player.showSnifferGlow(true);
                } else if (distance >= 150) {
                    if (dog.isHidden) {
                        this.player.showSnifferGlow(false);
                    }
                }
            }
        });
        
        // Check level completion
        this.checkLevelCompletion();
    }
}

