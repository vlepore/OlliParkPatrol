// Audio Manager - Generate sound effects procedurally
class AudioManager {
    static generateSoundEffects(scene) {
        // Jump sound - ascending tone
        this.createJumpSound(scene);
        
        // Collect sound - positive chime
        this.createCollectSound(scene);
        
        // Bark sound - short burst
        this.createBarkSound(scene);
        
        // Hurt sound - descending tone
        this.createHurtSound(scene);
        
        // Death sound - game over tone
        this.createDeathSound(scene);
        
        // Enemy defeat sound - explosion-like
        this.createEnemyDefeatSound(scene);
        
        // Dog rescue sound - happy bark
        this.createDogRescueSound(scene);
    }
    
    static createJumpSound(scene) {
        const duration = 0.15;
        const audioContext = scene.game.sound.context;
        const sampleRate = audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const freq = 300 + (t * 400); // Rising pitch
            channelData[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 8);
        }
        
        scene.cache.audio.add('jump', audioBuffer);
        scene.sound.add('jump');
    }
    
    static createCollectSound(scene) {
        const duration = 0.2;
        const audioContext = scene.game.sound.context;
        const sampleRate = audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const freq = 800 + (t * 400);
            channelData[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 12);
        }
        
        scene.cache.audio.add('collect', audioBuffer);
        scene.sound.add('collect');
    }
    
    static createBarkSound(scene) {
        const duration = 0.25;
        const audioContext = scene.game.sound.context;
        const sampleRate = audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const freq = 200 + Math.sin(t * 50) * 100;
            const noise = (Math.random() - 0.5) * 0.3;
            channelData[i] = (Math.sin(2 * Math.PI * freq * t) * 0.7 + noise) * Math.exp(-t * 6);
        }
        
        scene.cache.audio.add('bark', audioBuffer);
        scene.sound.add('bark');
    }
    
    static createHurtSound(scene) {
        const duration = 0.3;
        const audioContext = scene.game.sound.context;
        const sampleRate = audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const freq = 400 - (t * 300); // Descending pitch
            channelData[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 5);
        }
        
        scene.cache.audio.add('hurt', audioBuffer);
        scene.sound.add('hurt');
    }
    
    static createDeathSound(scene) {
        const duration = 0.5;
        const audioContext = scene.game.sound.context;
        const sampleRate = audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const freq = 300 - (t * 250);
            channelData[i] = Math.sin(2 * Math.PI * freq * t) * Math.exp(-t * 3);
        }
        
        scene.cache.audio.add('death', audioBuffer);
        scene.sound.add('death');
    }
    
    static createEnemyDefeatSound(scene) {
        const duration = 0.3;
        const audioContext = scene.game.sound.context;
        const sampleRate = audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const noise = (Math.random() - 0.5);
            channelData[i] = noise * Math.exp(-t * 10);
        }
        
        scene.cache.audio.add('enemyDefeat', audioBuffer);
        scene.sound.add('enemyDefeat');
    }
    
    static createDogRescueSound(scene) {
        const duration = 0.4;
        const audioContext = scene.game.sound.context;
        const sampleRate = audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        // Happy ascending bark
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const freq = 300 + (t * 500);
            const noise = (Math.random() - 0.5) * 0.2;
            channelData[i] = (Math.sin(2 * Math.PI * freq * t) * 0.8 + noise) * Math.exp(-t * 8);
        }
        
        scene.cache.audio.add('dogRescue', audioBuffer);
        scene.sound.add('dogRescue');
    }
}

