// Boot Scene - Asset Loading
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        // Create loading bar
        this.createLoadingBar();
        
        // Load audio
        this.load.audio('theme', 'theme.mp3');
        
        // Since we're using placeholder sprites, we'll generate them programmatically
        // in the create method instead of loading files
        
        // Create a simple 1x1 white particle for effects
        this.createParticleTexture();
    }
    
    createLoadingBar() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);
        
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px Press Start 2P',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2,
            text: '0%',
            style: {
                font: '18px Press Start 2P',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xffd700, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });
        
        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
    }
    
    createParticleTexture() {
        // Create a simple white circle texture for particles
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(4, 4, 4);
        graphics.generateTexture('particle', 8, 8);
        graphics.destroy();
    }
    
    create() {
        // Generate all sprite textures programmatically
        this.generatePlayerTextures();
        this.generateEnemyTextures();
        this.generateCollectibleTextures();
        this.generatePlatformTextures();
        this.generateLostDogTexture();
        
        // Create animations
        this.createAnimations();
        
        // Generate sound effects
        AudioManager.generateSoundEffects(this);
        
        // Start main menu
        this.scene.start('MainMenuScene');
    }
    
    generatePlayerTextures() {
        // Olli the Goldendoodle - golden/beige color with white belly
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        // Body (golden)
        graphics.fillStyle(0xF4D03F); // Golden color
        graphics.fillRoundedRect(2, 10, 28, 22, 8);
        
        // White underbelly
        graphics.fillStyle(0xFFFFFF); // White
        graphics.fillEllipse(16, 22, 12, 8);
        
        // Head
        graphics.fillStyle(0xF4D03F); // Golden color
        graphics.fillCircle(16, 8, 10);
        
        // Ears (floppy)
        graphics.fillEllipse(8, 8, 8, 12);
        graphics.fillEllipse(24, 8, 8, 12);
        
        // Eyes
        graphics.fillStyle(0x000000);
        graphics.fillCircle(12, 6, 2);
        graphics.fillCircle(20, 6, 2);
        
        // Nose
        graphics.fillCircle(16, 10, 2);
        
        // Collar (red)
        graphics.fillStyle(0xFF0000);
        graphics.fillRect(10, 16, 12, 3);
        
        // Tag (gold)
        graphics.fillStyle(0xFFD700);
        graphics.fillCircle(16, 17, 2);
        
        graphics.generateTexture('player', 32, 32);
        graphics.destroy();
    }
    
    generateEnemyTextures() {
        // Squirrel - brown
        let graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x8B4513); // Brown
        graphics.fillCircle(12, 12, 8); // Body
        graphics.fillCircle(8, 8, 5); // Head
        graphics.fillStyle(0x654321); // Darker brown for tail
        graphics.fillEllipse(18, 12, 12, 8);
        graphics.fillStyle(0x000000); // Eyes
        graphics.fillCircle(7, 7, 1);
        graphics.generateTexture('squirrel', 24, 24);
        graphics.destroy();
        
        // Raccoon - gray with mask
        graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x808080); // Gray
        graphics.fillCircle(16, 16, 10); // Body
        graphics.fillCircle(12, 10, 6); // Head
        graphics.fillStyle(0x000000); // Mask
        graphics.fillEllipse(10, 10, 8, 4);
        graphics.fillStyle(0xFFFFFF); // Eyes
        graphics.fillCircle(9, 10, 2);
        graphics.fillCircle(13, 10, 2);
        graphics.fillStyle(0x000000); // Pupils
        graphics.fillCircle(9, 10, 1);
        graphics.fillCircle(13, 10, 1);
        graphics.generateTexture('raccoon', 32, 32);
        graphics.destroy();
    }
    
    generateCollectibleTextures() {
        // Tennis Ball - yellow with curved line
        let graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xCCFF00);
        graphics.fillCircle(12, 12, 10);
        graphics.lineStyle(2, 0xFFFFFF);
        graphics.beginPath();
        graphics.arc(12, 12, 8, -Math.PI/4, Math.PI/4);
        graphics.strokePath();
        graphics.generateTexture('tennisBall', 24, 24);
        graphics.destroy();
        
        // Bone - white
        graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xFFFFFF);
        graphics.fillCircle(4, 8, 4);
        graphics.fillCircle(20, 8, 4);
        graphics.fillRect(6, 6, 12, 4);
        graphics.generateTexture('bone', 24, 16);
        graphics.destroy();
        
        // Treat - pink heart shape
        graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xFF69B4);
        graphics.fillCircle(8, 8, 5);
        graphics.fillCircle(16, 8, 5);
        graphics.beginPath();
        graphics.moveTo(4, 10);
        graphics.lineTo(12, 18);
        graphics.lineTo(20, 10);
        graphics.closePath();
        graphics.fillPath();
        graphics.generateTexture('treat', 24, 24);
        graphics.destroy();
    }
    
    generatePlatformTextures() {
        // Ground tile - green grass
        let graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x228B22); // Forest green
        graphics.fillRect(0, 0, 32, 32);
        graphics.fillStyle(0x32CD32); // Lighter green for grass blades
        for (let i = 0; i < 8; i++) {
            graphics.fillRect(i * 4, 0, 2, 4);
        }
        graphics.generateTexture('ground', 32, 32);
        graphics.destroy();
        
        // Platform - brown
        graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 0, 32, 16);
        graphics.lineStyle(2, 0x654321);
        graphics.strokeRect(0, 0, 32, 16);
        graphics.generateTexture('platform', 32, 16);
        graphics.destroy();
        
        // Tree - green circle on brown trunk
        graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(28, 40, 8, 40);
        graphics.fillStyle(0x228B22);
        graphics.fillCircle(32, 30, 25);
        graphics.fillStyle(0x32CD32);
        graphics.fillCircle(32, 30, 20);
        graphics.generateTexture('tree', 64, 80);
        graphics.destroy();
        
        // Bench
        graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0x8B4513);
        graphics.fillRect(0, 20, 48, 8); // Seat
        graphics.fillRect(4, 28, 4, 12); // Legs
        graphics.fillRect(40, 28, 4, 12);
        graphics.fillRect(0, 8, 48, 4); // Backrest
        graphics.fillRect(0, 8, 4, 16); // Support
        graphics.fillRect(44, 8, 4, 16);
        graphics.generateTexture('bench', 48, 40);
        graphics.destroy();
    }
    
    generateLostDogTexture() {
        // Lost dog - different color (light blue/gray)
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        graphics.fillStyle(0xADD8E6); // Light blue
        graphics.fillCircle(12, 8, 6); // Head
        graphics.fillRoundedRect(6, 12, 12, 10, 4); // Body
        graphics.fillStyle(0x000000);
        graphics.fillCircle(10, 7, 1); // Eyes
        graphics.fillCircle(14, 7, 1);
        graphics.fillCircle(12, 9, 1); // Nose
        graphics.generateTexture('lostDog', 24, 24);
        graphics.destroy();
    }
    
    createAnimations() {
        // Player animations (using single frame for now)
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 1
        });
        
        this.anims.create({
            key: 'run',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'jump',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 1
        });
        
        this.anims.create({
            key: 'fall',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 1
        });
        
        this.anims.create({
            key: 'bark',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 1
        });
        
        this.anims.create({
            key: 'sit',
            frames: [{ key: 'player', frame: 0 }],
            frameRate: 1
        });
        
        // Enemy animations
        this.anims.create({
            key: 'squirrel_walk',
            frames: [{ key: 'squirrel', frame: 0 }],
            frameRate: 8,
            repeat: -1
        });
        
        this.anims.create({
            key: 'squirrel_idle',
            frames: [{ key: 'squirrel', frame: 0 }],
            frameRate: 1
        });
        
        this.anims.create({
            key: 'raccoon_walk',
            frames: [{ key: 'raccoon', frame: 0 }],
            frameRate: 8,
            repeat: -1
        });
        
        this.anims.create({
            key: 'raccoon_idle',
            frames: [{ key: 'raccoon', frame: 0 }],
            frameRate: 1
        });
    }
}

