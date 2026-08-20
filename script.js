// OTP Configuration
const CORRECT_OTP = '11337'; // "one tea" - 1 (one) + tea (337 in leetspeak)

let balloonsPopped = 0;
let candlesBlown = 0;
const totalActivities = 2;

// Verify OTP
function verifyOTP() {
    const otpInput = document.getElementById('otpInput').value.trim();
    const errorDiv = document.getElementById('otpError');
    
    if (otpInput === CORRECT_OTP) {
        errorDiv.textContent = '';
        transitionToMainScreen();
    } else {
        errorDiv.textContent = '❌ Incorrect OTP! Hint: "one tea" 🍵';
        document.getElementById('otpInput').value = '';
        shake(document.querySelector('.otp-container'));
    }
}

// Transition to main celebration screen
function transitionToMainScreen() {
    const otpScreen = document.getElementById('otpScreen');
    const celebrationScreen = document.getElementById('celebrationScreen');
    
    otpScreen.classList.add('hidden');
    celebrationScreen.classList.add('active');
    
    // Play celebration effect
    setTimeout(() => {
        createConfetti();
    }, 300);
}

// Balloon Pop Game
function generateBalloons() {
    const container = document.getElementById('balloonContainer');
    container.innerHTML = '';
    balloonsPopped = 0;
    updateBalloonCount();
    
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa502', '#ff006e', '#00f5ff'];
    
    for (let i = 0; i < 12; i++) {
        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.style.left = Math.random() * 80 + '%';
        balloon.style.top = Math.random() * 70 + '%';
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDelay = Math.random() * 2 + 's';
        balloon.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            popBalloon(balloon);
        });
        
        container.appendChild(balloon);
    }
}

function popBalloon(balloon) {
    if (balloon.classList.contains('popping')) return;
    
    balloon.classList.add('popping');
    balloonsPopped++;
    updateBalloonCount();
    updateProgress();
    
    // Pop sound effect (visual feedback)
    createPopEffect(balloon);
    
    setTimeout(() => {
        balloon.remove();
    }, 500);
}

function updateBalloonCount() {
    document.getElementById('balloonCount').textContent = `Balloons popped: ${balloonsPopped}`;
}

// Candle Blowing Game
function generateCandles() {
    const container = document.getElementById('candleContainer');
    container.innerHTML = '';
    candlesBlown = 0;
    updateCandleCount();
    
    for (let i = 0; i < 5; i++) {
        const candleWrapper = document.createElement('div');
        candleWrapper.className = 'candle';
        candleWrapper.innerHTML = `
            <span class="candle-stick">🕯️</span>
            <span class="candle-flame">🔥</span>
        `;
        
        candleWrapper.addEventListener('click', () => {
            blowCandle(candleWrapper);
        });
        
        container.appendChild(candleWrapper);
    }
}

function blowCandle(candle) {
    if (candle.classList.contains('blown')) return;
    
    candle.classList.add('blown');
    candlesBlown++;
    updateCandleCount();
    updateProgress();
    
    // Wind effect
    createWindEffect(candle);
}

function updateCandleCount() {
    document.getElementById('candleCount').textContent = `Candles blown: ${candlesBlown}`;
}

// Update Progress
function updateProgress() {
    const totalCompleted = (balloonsPopped > 0 ? 1 : 0) + (candlesBlown > 0 ? 1 : 0);
    const progress = (totalCompleted / totalActivities) * 100;
    
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = Math.round(progress) + '%';
    
    // Enable letter button when progress reaches 100%
    const letterBtn = document.querySelector('.btn-open-letter');
    if (progress === 100) {
        letterBtn.disabled = false;
        letterBtn.style.cursor = 'pointer';
        createConfetti();
    }
}

// Open Vintage Letter
function openLetter() {
    const modal = document.getElementById('letterModal');
    modal.classList.remove('hidden');
    createConfetti();
}

function closeLetter() {
    const modal = document.getElementById('letterModal');
    modal.classList.add('hidden');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('letterModal');
    if (e.target === modal) {
        closeLetter();
    }
});

// Allow Enter key to verify OTP
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('otpInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyOTP();
        }
    });
});

// Confetti Effect
function createConfetti() {
    const canvas = document.getElementById('confetti');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const confetti = [];
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#ffa502', '#00f5ff', '#ff006e'];
    
    for (let i = 0; i < 100; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 5 + 5,
            size: Math.random() * 5 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * Math.PI * 2
        });
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        let anyConfetti = false;
        for (let particle of confetti) {
            if (particle.y < canvas.height) {
                anyConfetti = true;
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.2; // gravity
                particle.rotation += 0.1;
                
                ctx.save();
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.fillStyle = particle.color;
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
                ctx.restore();
            }
        }
        
        if (anyConfetti) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
}

// Pop effect for balloons
function createPopEffect(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Visual feedback
    const popup = document.createElement('div');
    popup.textContent = '💥';
    popup.style.position = 'fixed';
    popup.style.left = x + 'px';
    popup.style.top = y + 'px';
    popup.style.fontSize = '2em';
    popup.style.pointerEvents = 'none';
    popup.style.zIndex = '999';
    popup.style.animation = 'popAnim 0.6s ease-out forwards';
    
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 600);
}

// Wind effect for candles
function createWindEffect(element) {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    // Visual feedback
    const wind = document.createElement('div');
    wind.textContent = '💨';
    wind.style.position = 'fixed';
    wind.style.left = x + 'px';
    wind.style.top = y + 'px';
    wind.style.fontSize = '2em';
    wind.style.pointerEvents = 'none';
    wind.style.zIndex = '999';
    wind.style.animation = 'windAnim 0.8s ease-out forwards';
    
    document.body.appendChild(wind);
    setTimeout(() => wind.remove(), 800);
}

// Shake animation for error
function shake(element) {
    element.style.animation = 'shake 0.3s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 300);
}

// Add keyframe animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes popAnim {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(0, -50px) scale(0.5);
        }
    }
    
    @keyframes windAnim {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(30px, -50px) scale(0.5);
        }
    }
`;
document.head.appendChild(style);

// Handle window resize for confetti
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});