// Mobile Touch Controls Manager
class MobileControls {
    constructor(scene) {
        this.scene = scene;
        this.buttons = {};
        this.isMobile = this.detectMobile();
        
        if (this.isMobile) {
            this.createControls();
        }
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }
    
    createControls() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        
        // Control container
        this.controlsContainer = this.scene.add.container(0, 0)
            .setScrollFactor(0)
            .setDepth(1000);
        
        // D-Pad on the left
        this.createDPad(80, height - 100);
        
        // Action buttons on the right
        this.createActionButtons(width - 80, height - 100);
        
        // Make buttons semi-transparent
        this.controlsContainer.setAlpha(0.7);
    }
    
    createDPad(centerX, centerY) {
        const buttonSize = 50;
        const spacing = 55;
        
        // Left button
        this.buttons.left = this.createButton(
            centerX - spacing, 
            centerY, 
            '◄', 
            0x4CAF50
        );
        
        // Right button
        this.buttons.right = this.createButton(
            centerX + spacing, 
            centerY, 
            '►', 
            0x4CAF50
        );
        
        // Up/Jump button
        this.buttons.up = this.createButton(
            centerX, 
            centerY - spacing, 
            '▲', 
            0x2196F3
        );
        
        // Set up touch events for movement
        this.setupButtonEvents(this.buttons.left, 'left');
        this.setupButtonEvents(this.buttons.right, 'right');
        this.setupButtonEvents(this.buttons.up, 'jump');
    }
    
    createActionButtons(centerX, centerY) {
        const spacing = 60;
        
        // Bark button
        this.buttons.bark = this.createButton(
            centerX, 
            centerY - spacing, 
            'X\nBARK', 
            0xFF5722,
            true
        );
        
        // Jump button (alternative position)
        this.buttons.jump = this.createButton(
            centerX, 
            centerY, 
            'JUMP', 
            0x2196F3,
            true
        );
        
        // Set up touch events
        this.setupButtonEvents(this.buttons.bark, 'bark');
        this.setupButtonEvents(this.buttons.jump, 'jump');
    }
    
    createButton(x, y, text, color, isRound = false) {
        const button = this.scene.add.container(x, y);
        
        // Button background
        const bg = isRound 
            ? this.scene.add.circle(0, 0, 30, color)
            : this.scene.add.rectangle(0, 0, 50, 50, color);
        
        bg.setStrokeStyle(3, 0xFFFFFF);
        
        // Button label
        const label = this.scene.add.text(0, 0, text, {
            fontSize: isRound ? '10px' : '16px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        button.add([bg, label]);
        button.setSize(isRound ? 60 : 50, isRound ? 60 : 50);
        button.setInteractive();
        
        button.bg = bg;
        button.label = label;
        
        this.controlsContainer.add(button);
        
        return button;
    }
    
    setupButtonEvents(button, action) {
        // Active state tracking
        button.isPressed = false;
        
        button.on('pointerdown', () => {
            button.isPressed = true;
            button.bg.setAlpha(1);
            button.setScale(0.9);
            
            // Trigger action
            this.handleAction(action, true);
        });
        
        button.on('pointerup', () => {
            button.isPressed = false;
            button.bg.setAlpha(1);
            button.setScale(1);
            
            // Release action
            this.handleAction(action, false);
        });
        
        button.on('pointerout', () => {
            if (button.isPressed) {
                button.isPressed = false;
                button.bg.setAlpha(1);
                button.setScale(1);
                
                // Release action
                this.handleAction(action, false);
            }
        });
    }
    
    handleAction(action, pressed) {
        const player = this.scene.player;
        if (!player || !player.active) return;
        
        switch(action) {
            case 'left':
                if (pressed) {
                    player.mobileControls = player.mobileControls || {};
                    player.mobileControls.left = true;
                } else {
                    if (player.mobileControls) player.mobileControls.left = false;
                }
                break;
                
            case 'right':
                if (pressed) {
                    player.mobileControls = player.mobileControls || {};
                    player.mobileControls.right = true;
                } else {
                    if (player.mobileControls) player.mobileControls.right = false;
                }
                break;
                
            case 'jump':
                if (pressed) {
                    player.mobileControls = player.mobileControls || {};
                    player.mobileControls.jump = true;
                } else {
                    if (player.mobileControls) player.mobileControls.jump = false;
                }
                break;
                
            case 'bark':
                if (pressed && !player.barkCooldown) {
                    player.bark();
                }
                break;
        }
    }
    
    update() {
        // Keep controls visible and responsive
        if (this.controlsContainer) {
            this.controlsContainer.setVisible(true);
        }
    }
    
    destroy() {
        if (this.controlsContainer) {
            this.controlsContainer.destroy();
        }
    }
}

