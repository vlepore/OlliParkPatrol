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
    
    createExternalControls() {
        // Create HTML controls container
        const controlsDiv = document.getElementById('mobile-controls');
        if (!controlsDiv) {
            const newControlsDiv = document.createElement('div');
            newControlsDiv.id = 'mobile-controls';
            newControlsDiv.className = 'mobile-controls-container';
            document.getElementById('game-container').appendChild(newControlsDiv);
            
            // Create D-Pad
            const dpadDiv = document.createElement('div');
            dpadDiv.className = 'dpad-container';
            dpadDiv.innerHTML = `
                <div class="dpad">
                    <button class="dpad-btn dpad-up" data-action="jump">▲</button>
                    <button class="dpad-btn dpad-left" data-action="left">◄</button>
                    <button class="dpad-btn dpad-center"></button>
                    <button class="dpad-btn dpad-right" data-action="right">►</button>
                </div>
            `;
            
            // Create Action Buttons
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'actions-container';
            actionsDiv.innerHTML = `
                <button class="action-btn jump-btn" data-action="jump">
                    <span class="btn-label">A</span>
                    <span class="btn-sublabel">JUMP</span>
                </button>
                <button class="action-btn bark-btn" data-action="bark">
                    <span class="btn-label">B</span>
                    <span class="btn-sublabel">BARK</span>
                </button>
            `;
            
            newControlsDiv.appendChild(dpadDiv);
            newControlsDiv.appendChild(actionsDiv);
            
            // Set up event listeners
            this.setupHTMLControls(newControlsDiv);
        }
    }
    
    setupHTMLControls(container) {
        const buttons = container.querySelectorAll('button[data-action]');
        
        buttons.forEach(button => {
            const action = button.getAttribute('data-action');
            
            // Touch events
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                button.classList.add('active');
                this.handleAction(action, true);
            });
            
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.classList.remove('active');
                this.handleAction(action, false);
            });
            
            button.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                button.classList.remove('active');
                this.handleAction(action, false);
            });
            
            // Mouse events for testing
            button.addEventListener('mousedown', (e) => {
                e.preventDefault();
                button.classList.add('active');
                this.handleAction(action, true);
            });
            
            button.addEventListener('mouseup', (e) => {
                e.preventDefault();
                button.classList.remove('active');
                this.handleAction(action, false);
            });
            
            button.addEventListener('mouseleave', (e) => {
                button.classList.remove('active');
                this.handleAction(action, false);
            });
        });
    }
    
    createControls() {
        const width = this.scene.cameras.main.width;
        const height = this.scene.cameras.main.height;
        
        // Control container - positioned in fixed external HTML container
        this.createExternalControls();
        
        // Also create minimal overlay indicators for feedback
        this.controlsContainer = this.scene.add.container(0, 0)
            .setScrollFactor(0)
            .setDepth(1000)
            .setAlpha(0); // Hide the overlay controls since we use external ones
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

