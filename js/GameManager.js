// Global Game Manager for score tracking, state management, and localStorage
class GameManager {
    constructor() {
        this.score = 0;
        this.health = 3;
        this.maxHealth = 3;
        this.tennisBallStreak = 0;
        this.zoomiesActive = false;
        this.dogsRescued = 0;
        this.totalDogs = 0;
        this.damageTaken = false;
        this.levelStartTime = 0;
        this.currentLevel = 1;
        this.enemiesDefeated = 0;
    }

    // Score Management
    addScore(points) {
        this.score += points;
    }

    subtractScore(points) {
        this.score = Math.max(0, this.score - points);
    }

    // Tennis Ball Streak for Zoomies
    addTennisBall() {
        this.tennisBallStreak++;
        this.addScore(25);
        
        if (this.tennisBallStreak >= 3 && !this.zoomiesActive) {
            this.activateZoomies();
        }
    }

    activateZoomies() {
        this.zoomiesActive = true;
        this.addScore(100); // Bonus points
        this.tennisBallStreak = 0;
    }

    deactivateZoomies() {
        this.zoomiesActive = false;
    }

    resetStreak() {
        this.tennisBallStreak = 0;
    }

    // Health Management
    takeDamage() {
        this.health--;
        this.damageTaken = true;
        this.subtractScore(25);
        return this.health > 0;
    }

    heal() {
        this.health = Math.min(this.maxHealth, this.health + 1);
    }

    // Collectibles
    collectBone() {
        this.addScore(10);
    }

    collectTreat() {
        this.heal();
    }

    rescueDog() {
        this.dogsRescued++;
        this.addScore(150);
    }

    defeatEnemy() {
        this.enemiesDefeated++;
        this.addScore(50);
    }

    // Level Management
    startLevel(level, totalDogsInLevel) {
        this.currentLevel = level;
        this.totalDogs = totalDogsInLevel;
        this.dogsRescued = 0;
        this.damageTaken = false;
        this.levelStartTime = Date.now();
    }

    // Calculate End-of-Level Bonuses
    calculateBonuses(timeGoal) {
        const bonuses = {
            perfectRescue: false,
            speedPup: false,
            cleanPaws: false,
            total: 0
        };

        // Perfect Rescue Bonus: All dogs found
        if (this.dogsRescued === this.totalDogs && this.totalDogs > 0) {
            bonuses.perfectRescue = true;
            bonuses.total += 500;
        }

        // Speed Pup Bonus: Finished under time goal
        const timeElapsed = (Date.now() - this.levelStartTime) / 1000;
        if (timeElapsed < timeGoal) {
            bonuses.speedPup = true;
            bonuses.total += 250;
        }

        // Clean Paws Bonus: No damage taken
        if (!this.damageTaken) {
            bonuses.cleanPaws = true;
            bonuses.total += 200;
        }

        this.addScore(bonuses.total);
        return bonuses;
    }

    // Reset for New Game
    reset() {
        this.score = 0;
        this.health = 3;
        this.tennisBallStreak = 0;
        this.zoomiesActive = false;
        this.dogsRescued = 0;
        this.totalDogs = 0;
        this.damageTaken = false;
        this.currentLevel = 1;
        this.enemiesDefeated = 0;
    }

    // Leaderboard Management (localStorage)
    saveScore(nickname) {
        const scoreEntry = {
            nickname: nickname,
            score: this.score,
            level: this.currentLevel,
            date: new Date().toISOString()
        };

        let leaderboard = this.getLeaderboard();
        leaderboard.push(scoreEntry);
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10); // Keep top 10

        localStorage.setItem('olliLeaderboard', JSON.stringify(leaderboard));
    }

    getLeaderboard() {
        const data = localStorage.getItem('olliLeaderboard');
        return data ? JSON.parse(data) : [];
    }

    getPlayerRank() {
        const leaderboard = this.getLeaderboard();
        const rank = leaderboard.findIndex(entry => entry.score === this.score) + 1;
        return rank > 0 ? rank : null;
    }

    // Best Score Tracking
    getBestScore() {
        const leaderboard = this.getLeaderboard();
        if (leaderboard.length === 0) return 0;
        return leaderboard[0].score;
    }
}

// Global instance
const gameManager = new GameManager();

