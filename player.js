const socket = io();
let currentRoomCode = null;
let playerName = '';
let currentStage = 1;
let selectedChoice = null;

// Use gameData from game.js (loaded in HTML)
// Track player stats to show results
let playerStats = { inflation: 200, supply: 30, income: 20, trust: 50 };

// Player state to track answers for branching
let playerAnswers = [];

// DOM elements
const elements = {
    joinScreen: document.getElementById('join-screen'),
    waitingScreen: document.getElementById('waiting-screen'),
    gameArea: document.getElementById('game-area'),
    completedScreen: document.getElementById('completed-screen'),
    playerNameInput: document.getElementById('player-name'),
    joinError: document.getElementById('join-error'),
    stageBadge: document.getElementById('stage-badge'),
    questionTitle: document.getElementById('question-title'),
    questionDescription: document.getElementById('question-description'),
    choicesGrid: document.getElementById('choices-grid'),
    submitBtn: document.getElementById('submit-btn'),
    resultDisplay: document.getElementById('result-display')
};

// Socket event listeners
socket.on('joined-room', (data) => {
    playerName = data.playerName;
    elements.joinScreen.classList.add('hidden');
    elements.waitingScreen.classList.remove('hidden');
});

socket.on('game-started', () => {
    elements.waitingScreen.classList.add('hidden');
    elements.gameArea.classList.add('active');
});

socket.on('question', (data) => {
    currentStage = data.stage;
    displayQuestion(data.stage);
});

socket.on('room-error', (data) => {
    elements.joinError.textContent = data.message;
    elements.joinError.classList.remove('hidden');
});

socket.on('admin-left', () => {
    elements.gameArea.classList.remove('active');
    elements.waitingScreen.classList.remove('hidden');
    elements.waitingScreen.innerHTML = `
        <div class="waiting-icon">⚠️</div>
        <div class="waiting-message">Admin đã rời khỏi phòng</div>
        <div class="waiting-subtitle">Vui lòng quay lại trang chủ</div>
    `;
});

// Functions
function joinRoom() {
    const name = elements.playerNameInput.value.trim();
    
    if (!name) {
        elements.joinError.textContent = 'Vui lòng nhập tên của bạn!';
        elements.joinError.classList.remove('hidden');
        return;
    }
    
    if (!window.ROOM_CODE) {
        elements.joinError.textContent = 'Không tìm thấy mã phòng!';
        elements.joinError.classList.remove('hidden');
        return;
    }
    
    currentRoomCode = window.ROOM_CODE;
    elements.joinError.classList.add('hidden');
    
    socket.emit('join-room', {
        roomCode: currentRoomCode,
        playerName: name
    });
}

function displayQuestion(stage) {
    selectedChoice = null;
    elements.submitBtn.disabled = true;
    elements.resultDisplay.classList.add('hidden'); // Hide previous result
    
    // Update stage badge
    elements.stageBadge.textContent = `Giai đoạn ${stage}/3`;
    
    let questionData;
    
    if (stage === 1) {
        questionData = gameData.stage1;
    } else if (stage === 2) {
        // Get the branch based on stage 1 answer
        const stage1Answer = playerAnswers[0];
        questionData = gameData.stage2[stage1Answer];
    } else if (stage === 3) {
        // Get the branch based on stage 1 and 2 answers
        const stage1Answer = playerAnswers[0];
        const stage2Answer = playerAnswers[1];
        const pathKey = `${stage1Answer}-${stage2Answer}`;
        questionData = gameData.stage3[pathKey];
    }
    
    if (!questionData) {
        console.error('Question data not found for stage:', stage);
        return;
    }
    
    // Update title and description
    elements.questionTitle.textContent = questionData.title;
    elements.questionDescription.textContent = questionData.description;
    
    // Render choices
    renderChoices(questionData.choices);
}

function renderChoices(choices) {
    elements.choicesGrid.innerHTML = '';
    
    choices.forEach((choice, index) => {
        const choiceCard = document.createElement('div');
        choiceCard.className = 'choice-option';
        choiceCard.innerHTML = `
            <h4>Lựa chọn ${index + 1}</h4>
            <p>${choice.text}</p>
        `;
        
        choiceCard.addEventListener('click', () => selectChoice(choiceCard, choice));
        elements.choicesGrid.appendChild(choiceCard);
    });
}

function selectChoice(card, choice) {
    // Remove previous selection
    document.querySelectorAll('.choice-option').forEach(c => {
        c.classList.remove('selected');
    });
    
    // Add selection to clicked card
    card.classList.add('selected');
    selectedChoice = choice;
    
    // Enable submit button
    elements.submitBtn.disabled = false;
}

function submitAnswer() {
    if (!selectedChoice) {
        return;
    }
    
    // Store answer for branching
    playerAnswers.push(selectedChoice.id);
    
    // Get full choice data from gameData to show result
    const fullChoice = getFullChoiceData(selectedChoice.id, currentStage);
    
    // Show result immediately with current stats
    showResult(fullChoice);
    
    // Update player stats AFTER showing result
    if (fullChoice) {
        playerStats.inflation = fullChoice.inflation;
        playerStats.supply = fullChoice.supply;
        playerStats.income = fullChoice.income;
        playerStats.trust = fullChoice.trust;
    }
    
    // Send answer to server
    socket.emit('submit-answer', {
        roomCode: currentRoomCode,
        stage: currentStage,
        choice: selectedChoice.id
    });
    
    // Disable submit button
    elements.submitBtn.disabled = true;
    
    // If last stage, show completed screen after a delay
    if (currentStage === 3) {
        setTimeout(() => {
            elements.gameArea.classList.remove('active');
            elements.completedScreen.classList.remove('hidden');
        }, 3000);
    }
}

// Get full choice data with stats from gameData
function getFullChoiceData(choiceId, stage) {
    let questionData;
    
    if (stage === 1) {
        questionData = gameData.stage1;
    } else if (stage === 2) {
        const stage1Answer = playerAnswers[0];
        questionData = gameData.stage2[stage1Answer];
    } else if (stage === 3) {
        const stage1Answer = playerAnswers[0];
        const stage2Answer = playerAnswers[1];
        const pathKey = `${stage1Answer}-${stage2Answer}`;
        questionData = gameData.stage3[pathKey];
    }
    
    if (!questionData || !questionData.choices) {
        return null;
    }
    
    return questionData.choices.find(c => c.id === choiceId);
}

// Show result after answer
function showResult(choice) {
    if (!choice) {
        return;
    }
    
    const prevStats = {...playerStats};
    
    // Calculate changes
    const inflationChange = choice.inflation - prevStats.inflation;
    const supplyChange = choice.supply - prevStats.supply;
    const incomeChange = choice.income - prevStats.income;
    const trustChange = choice.trust - prevStats.trust;
    
    const html = `
        <h3>📊 Kết quả của bạn</h3>
        <div class="result-stats">
            <div class="result-stat-item">
                <span class="result-stat-label">Lạm phát</span>
                <span class="result-stat-value">${choice.inflation}%</span>
                ${inflationChange !== 0 ? `<span style="color: ${inflationChange > 0 ? '#d63031' : '#00b894'}; font-size: 0.7em;">
                    ${inflationChange > 0 ? '↑' : '↓'} ${Math.abs(inflationChange)}%
                </span>` : ''}
            </div>
            <div class="result-stat-item">
                <span class="result-stat-label">Nguồn cung</span>
                <span class="result-stat-value">${choice.supply}/100</span>
                ${supplyChange !== 0 ? `<span style="color: ${supplyChange > 0 ? '#00b894' : '#d63031'}; font-size: 0.7em;">
                    ${supplyChange > 0 ? '↑' : '↓'} ${Math.abs(supplyChange)}
                </span>` : ''}
            </div>
            <div class="result-stat-item">
                <span class="result-stat-label">Thu nhập thực</span>
                <span class="result-stat-value">${choice.income}/100</span>
                ${incomeChange !== 0 ? `<span style="color: ${incomeChange > 0 ? '#00b894' : '#d63031'}; font-size: 0.7em;">
                    ${incomeChange > 0 ? '↑' : '↓'} ${Math.abs(incomeChange)}
                </span>` : ''}
            </div>
            <div class="result-stat-item">
                <span class="result-stat-label">Niềm tin</span>
                <span class="result-stat-value">${choice.trust}/100</span>
                ${trustChange !== 0 ? `<span style="color: ${trustChange > 0 ? '#00b894' : '#d63031'}; font-size: 0.7em;">
                    ${trustChange > 0 ? '↑' : '↓'} ${Math.abs(trustChange)}
                </span>` : ''}
            </div>
        </div>
        <div class="result-feedback">
            <strong>💬 Phản hồi:</strong> ${choice.feedback}
        </div>
    `;
    
    elements.resultDisplay.innerHTML = html;
    elements.resultDisplay.classList.remove('hidden');
}

// Allow Enter key to join room
elements.playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinRoom();
    }
});

