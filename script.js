let timer;
let timeLeft;
let isRunning = false;
let isPaused = false;
let totalTime;
let audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');

// DOM elements
const hoursInput = document.getElementById('hours-input');
const minutesInput = document.getElementById('minutes-input');
const startBtn = document.getElementById('start-btn');
const focusScreen = document.getElementById('focus-screen');
const timerDisplay = document.getElementById('timer');
const completionScreen = document.getElementById('completion-screen');
const restartBtn = document.getElementById('restart-btn');
const presetBtns = document.querySelectorAll('.preset-btn');
const progressRingFill = document.querySelector('.progress-ring-fill');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  updateTimerDisplay();
  setupEventListeners();
});

function setupEventListeners() {
  startBtn.addEventListener('click', startTimer);
  restartBtn.addEventListener('click', restartTimer);
  
  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const hours = parseInt(btn.dataset.hours);
      const minutes = parseInt(btn.dataset.minutes);
      hoursInput.value = hours;
      minutesInput.value = minutes;
      
      // Update active state
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Enter key support for inputs
  hoursInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startTimer();
  });
  
  minutesInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startTimer();
  });
}

function startTimer() {
  const hours = parseInt(hoursInput.value) || 0;
  const minutes = parseInt(minutesInput.value) || 25;
  
  if (hours === 0 && minutes === 0) {
    alert('Please set a time greater than 0');
    return;
  }
  
  totalTime = (hours * 60 + minutes) * 60; // Convert to seconds
  timeLeft = totalTime;
  isRunning = true;
  isPaused = false;
  
  // Enter fullscreen
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
  
  focusScreen.classList.remove('hidden');
  focusScreen.classList.add('fullscreen');
  
  updateTimerDisplay();
  updateProgressRing();
  
  timer = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      updateTimerDisplay();
      updateProgressRing();
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        timerComplete();
      }
    }
  }, 1000);
}

function updateTimerDisplay() {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  
  if (hours > 0) {
    timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

function updateProgressRing() {
  const progress = (totalTime - timeLeft) / totalTime;
  const circumference = 2 * Math.PI * 270; // r = 270
  const offset = circumference - (progress * circumference);
  
  progressRingFill.style.strokeDashoffset = offset;
}

function timerComplete() {
  // Play alarm sound
  audio.play().catch(e => console.log('Audio play failed:', e));
  
  // Add fade-out effect
  focusScreen.classList.add('fade-out');
  
  // Exit fullscreen
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  
  // Show completion screen after fade animation
  setTimeout(() => {
    focusScreen.classList.add('hidden');
    focusScreen.classList.remove('fade-out');
    completionScreen.classList.remove('hidden');
  }, 2000);
}

function restartTimer() {
  completionScreen.classList.add('hidden');
  isRunning = false;
  isPaused = false;
  timeLeft = 0;
  totalTime = 0;
  
  // Reset progress ring
  progressRingFill.style.strokeDashoffset = '1696';
  
  // Reset inputs
  hoursInput.value = '0';
  minutesInput.value = '25';
  
  // Remove active state from preset buttons
  presetBtns.forEach(btn => btn.classList.remove('active'));
}

// Handle fullscreen changes
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && isRunning) {
    // User exited fullscreen, but timer is still running
    // You could choose to pause the timer or keep it running
  }
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
  if (document.hidden && isRunning) {
    // Tab is hidden, you could pause the timer or keep it running
  }
});
