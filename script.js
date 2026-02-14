// Romantic quotes for cards
const romanticQuotes = [
    "\"I saw that you were perfect, and so I loved you. Then I saw that you were not perfect and I loved you even more.\" 💕",
    "\"In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.\" 💗",
    "\"You are my today and all of my tomorrows.\" ❤️",
    "\"I love you not only for what you are, but for what I am when I am with you.\" 💖",
    "\"Every love story is beautiful, but ours is my favorite.\" 💝",
    "\"You are the finest, loveliest, tenderest person I have ever known.\" 💕"
];

// Questions for recipient
const questions = [
    "{name}, do you enjoy talking to me?",
    "Would you be okay if I kept trying to make you smile?",
    "Do you think we could make beautiful memories together?",
    "Will you be my Valentine? 💕"
];

// Global state
let currentPage = 'landingPage';
let recipientName = '';
let senderName = '';
let drawingData = null;
let moveCount = 0;
const maxMoves = 5;
let isDrawing = false;
let currentQuestion = 0;
let selectedQuote = '';

// Canvas setup
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
if (canvas) {
    canvas.width = 600;
    canvas.height = 400;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    createFloatingElements();
});

function initializeApp() {
    // Select random quote
    selectedQuote = romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)];

    // Draw initial heart on canvas
    if (ctx) {
        drawInitialHeart();
    }
}

function setupEventListeners() {
    // Landing page
    const createBtn = document.getElementById('createBtn');
    if (createBtn) {
        createBtn.addEventListener('click', startCreating);
    }

    // Drawing canvas
    if (canvas) {
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);

        // Touch support
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', stopDrawing);
    }

    // Canvas buttons
    const closeDrawing = document.getElementById('closeDrawing');
    if (closeDrawing) {
        closeDrawing.addEventListener('click', () => showPage('landingPage'));
    }

    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetCanvas);
    }

    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', showPreview);
    }

    // Preview modal
    const closePreview = document.getElementById('closePreview');
    if (closePreview) {
        closePreview.addEventListener('click', () => {
            document.getElementById('previewModal').classList.remove('active');
        });
    }

    const regenerateQuote = document.getElementById('regenerateQuote');
    if (regenerateQuote) {
        regenerateQuote.addEventListener('click', () => {
            selectedQuote = romanticQuotes[Math.floor(Math.random() * romanticQuotes.length)];
            document.getElementById('cardQuote').textContent = selectedQuote;
        });
    }

    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.addEventListener('click', continueToQuestions);
    }

    // Question buttons
    const yesBtn = document.getElementById('yesBtn');
    const littleBtn = document.getElementById('littleBtn');
    if (yesBtn) yesBtn.addEventListener('click', () => nextQuestion());
    if (littleBtn) littleBtn.addEventListener('click', () => nextQuestion());

    // Navigation buttons
    document.querySelectorAll('[id^="tryItBtn"], [id^="loveMeBtn"]').forEach(btn => {
        btn.addEventListener('click', () => {
            showPage('landingPage');
            resetApp();
        });
    });

    const createOwnBtn = document.getElementById('createOwnBtn');
    if (createOwnBtn) {
        createOwnBtn.addEventListener('click', () => {
            showPage('landingPage');
            resetApp();
        });
    }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;
    }
}

function startCreating() {
    const input = document.getElementById('recipientInput');
    recipientName = input.value.trim();

    if (!recipientName) {
        alert('Please enter a name!');
        return;
    }

    showPage('drawingPage');
    resetCanvas();
}

// Drawing functions
function drawInitialHeart() {
    ctx.fillStyle = '#FF2D55';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF2D55';

    const x = canvas.width / 2;
    const y = canvas.height / 2 - 20;
    const size = 40;

    ctx.beginPath();
    ctx.moveTo(x, y + size / 4);
    ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x - size, y + size / 4);
    ctx.bezierCurveTo(x - size, y + size, x, y + size * 1.5, x, y + size * 1.5);
    ctx.bezierCurveTo(x, y + size * 1.5, x + size, y + size, x + size, y + size / 4);
    ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
    ctx.fill();

    ctx.shadowBlur = 0;
}

function startDrawing(e) {
    if (moveCount >= maxMoves) {
        return;
    }

    isDrawing = true;
    moveCount++;
    updateMoveCounter();

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);

    // Chalky brush effect
    ctx.strokeStyle = '#FF2D55';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#FF2D55';
}

function draw(e) {
    if (!isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Add some randomness for chalky effect
    const offsetX = (Math.random() - 0.5) * 2;
    const offsetY = (Math.random() - 0.5) * 2;

    ctx.lineTo(x + offsetX, y + offsetY);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawInitialHeart();
    moveCount = 0;
    updateMoveCounter();
}

function updateMoveCounter() {
    const counter = document.getElementById('moveCounter');
    if (counter) {
        counter.textContent = `${moveCount}/${maxMoves} MOVES`;
    }
}

function showPreview() {
    if (moveCount === 0) {
        alert('Please draw something first!');
        return;
    }

    // Save drawing data
    drawingData = canvas.toDataURL('image/png');

    // Show preview modal
    const modal = document.getElementById('previewModal');
    modal.classList.add('active');

    // Update preview
    document.getElementById('cardQuote').textContent = selectedQuote;
    document.getElementById('recipientName').textContent = recipientName;

    const previewCanvas = document.getElementById('previewCanvas');
    const previewCtx = previewCanvas.getContext('2d');
    previewCanvas.width = 300;
    previewCanvas.height = 200;

    const img = new Image();
    img.onload = () => {
        previewCtx.drawImage(img, 0, 0, 300, 200);
    };
    img.src = drawingData;
}

function continueToQuestions() {
    senderName = document.getElementById('senderInput').value.trim();

    if (!senderName) {
        alert('Please enter your name!');
        return;
    }

    // Close preview modal and start questions
    document.getElementById('previewModal').classList.remove('active');
    startQuestions();
}

function startQuestions() {
    currentQuestion = 0;
    showPage('questionPage');
    displayQuestion();
}

function displayQuestion() {
    const questionText = questions[currentQuestion].replace('{name}', recipientName);
    document.getElementById('questionText').textContent = questionText;
    document.getElementById('questionHeader').textContent = `QUESTION ${currentQuestion + 1} OF ${questions.length}`;

    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

function nextQuestion() {
    currentQuestion++;

    if (currentQuestion >= questions.length) {
        showFinalCard();
    } else {
        displayQuestion();
    }
}

function showFinalCard() {
    showPage('finalCardPage');

    // Update final card
    document.getElementById('finalQuote').textContent = selectedQuote;
    document.getElementById('finalRecipient').textContent = recipientName;
    document.getElementById('finalSender').textContent = senderName;

    // Draw on final canvas
    const finalCanvas = document.getElementById('finalCanvas');
    const finalCtx = finalCanvas.getContext('2d');
    finalCanvas.width = 300;
    finalCanvas.height = 200;

    const img = new Image();
    img.onload = () => {
        finalCtx.drawImage(img, 0, 0, 300, 200);
    };
    img.src = drawingData;
}

function resetApp() {
    recipientName = '';
    senderName = '';
    drawingData = null;
    moveCount = 0;
    currentQuestion = 0;

    document.getElementById('recipientInput').value = '';
    document.getElementById('senderInput').value = '';

    if (ctx) {
        resetCanvas();
    }
}

function createFloatingElements() {
    // Add more floating hearts and decorative elements
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        const decorations = page.querySelector('.floating-decorations');
        if (!decorations) return;

        // Add hearts
        for (let i = 0; i < 5; i++) {
            const heart = document.createElement('div');
            heart.textContent = '❤️';
            heart.style.position = 'absolute';
            heart.style.fontSize = '20px';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.animation = `float ${5 + Math.random() * 5}s infinite ease-in-out`;
            heart.style.animationDelay = Math.random() * 5 + 's';
            heart.style.opacity = '0.6';
            decorations.appendChild(heart);
        }

        // Add ducks
        const ducks = ['🦆', '🦢', '🐦'];
        for (let i = 0; i < 3; i++) {
            const duck = document.createElement('div');
            duck.textContent = ducks[i % ducks.length];
            duck.style.position = 'absolute';
            duck.style.fontSize = '50px';
            duck.style.left = Math.random() * 90 + '%';
            duck.style.top = (20 + Math.random() * 60) + '%';
            duck.style.animation = `waddle ${8 + Math.random() * 4}s infinite ease-in-out`;
            duck.style.animationDelay = Math.random() * 3 + 's';
            decorations.appendChild(duck);
        }

        // Add love letters
        for (let i = 0; i < 2; i++) {
            const letter = document.createElement('div');
            letter.textContent = '💌';
            letter.style.position = 'absolute';
            letter.style.fontSize = '30px';
            letter.style.left = Math.random() * 100 + '%';
            letter.style.top = Math.random() * 100 + '%';
            letter.style.animation = `float ${6 + Math.random() * 4}s infinite ease-in-out`;
            letter.style.animationDelay = Math.random() * 4 + 's';
            letter.style.opacity = '0.7';
            decorations.appendChild(letter);
        }
    });
}

// Add waddle animation
const style = document.createElement('style');
style.textContent = `
    @keyframes waddle {
        0%, 100% { transform: translateX(0) rotate(-5deg); }
        50% { transform: translateX(20px) rotate(5deg); }
    }
`;
document.head.appendChild(style);
