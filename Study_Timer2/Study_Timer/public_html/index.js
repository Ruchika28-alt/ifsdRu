class PomodoroTimer {
    constructor() {
        // Timer configurations
        this.timerConfigs = {
            work: 25 * 60,
            shortBreak: 5 * 60,
            longBreak: 15 * 60
        };

        // Timer state
        this.timeLeft = this.timerConfigs.work;
        this.isRunning = false;
        this.timerType = 'work';
        this.timerId = null;

        // DOM elements
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.toggleBtn = document.getElementById('toggleBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.workBtn = document.getElementById('workBtn');
        this.shortBreakBtn = document.getElementById('shortBreakBtn');
        this.longBreakBtn = document.getElementById('longBreakBtn');

        // Bind event listeners
        this.toggleBtn.addEventListener('click', () => this.toggleTimer());
        this.resetBtn.addEventListener('click', () => this.resetTimer());
        this.workBtn.addEventListener('click', () => this.switchMode('work'));
        this.shortBreakBtn.addEventListener('click', () => this.switchMode('shortBreak'));
        this.longBreakBtn.addEventListener('click', () => this.switchMode('longBreak'));

        // Initial display
        this.updateDisplay();
    }

    toggleTimer() {
        this.isRunning = !this.isRunning;
        this.toggleBtn.innerHTML = this.isRunning ? 
            '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' : 
            '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>';

        if (this.isRunning) {
            this.startTimer();
        } else {
            clearInterval(this.timerId);
        }
    }

    startTimer() {
        this.timerId = setInterval(() => {
            if (this.timeLeft > 0) {
                this.timeLeft--;
                this.updateDisplay();
            } else {
                this.handleTimerComplete();
            }
        }, 1000);
    }

    resetTimer() {
        clearInterval(this.timerId);
        this.isRunning = false;
        this.timeLeft = this.timerConfigs[this.timerType];
        this.updateDisplay();
        this.toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>';
    }

    switchMode(mode) {
        // Update active button styles
        [this.workBtn, this.shortBreakBtn, this.longBreakBtn].forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`${mode}Btn`).classList.add('active');

        // Reset timer for new mode
        this.timerType = mode;
        this.timeLeft = this.timerConfigs[mode];
        clearInterval(this.timerId);
        this.isRunning = false;
        this.updateDisplay();
        this.toggleBtn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8 5v14l11-7z"/></svg>';
    }

    handleTimerComplete() {
        clearInterval(this.timerId);
        this.isRunning = false;
        this.playAlarmSound();
        this.resetTimer();
    }

    playAlarmSound() {
        // Create and play a beeping sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.5;

        oscillator.start();
        
        setTimeout(() => {
            oscillator.stop();
        }, 500);
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});