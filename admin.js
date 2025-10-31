const socket = io();
let currentRoomCode = null;
let players = new Map();
let currentStage = 1;
const totalStages = 3;

// DOM elements
const elements = {
    roomCreation: document.getElementById('room-creation'),
    roomControl: document.getElementById('room-control'),
    playersSection: document.getElementById('players-section'),
    stageControl: document.getElementById('stage-control'),
    progressDisplay: document.getElementById('progress-display'),
    createRoomBtn: document.getElementById('create-room-btn'),
    startGameBtn: document.getElementById('start-game-btn'),
    nextStageBtn: document.getElementById('next-stage-btn'),
    showProgressBtn: document.getElementById('show-progress-btn'),
    roomCodeDisplay: document.getElementById('room-code-display'),
    shareLink: document.getElementById('share-link'),
    playersList: document.getElementById('players-list'),
    playerCount: document.getElementById('player-count'),
    currentStage: document.querySelector('.current-stage'),
    totalAnswered: document.getElementById('total-answered'),
    totalPlayers: document.getElementById('total-players'),
    progressDetails: document.getElementById('progress-details')
};

// Stage information based on game.js data
const stageData = {
    1: 'Giai đoạn 1: Điều chỉnh giá cả',
    2: 'Giai đoạn 2: Điều chỉnh tiền lương',
    3: 'Giai đoạn 3: Chính sách tiền tệ'
};

// Event listeners
elements.createRoomBtn.addEventListener('click', createRoom);
elements.startGameBtn.addEventListener('click', startGame);
elements.nextStageBtn.addEventListener('click', sendNextQuestion);
elements.showProgressBtn.addEventListener('click', showProgress);

// Socket event listeners
socket.on('room-created', (data) => {
    currentRoomCode = data.roomCode;
    elements.roomCodeDisplay.textContent = currentRoomCode;
    elements.shareLink.value = `${window.location.origin}/player.html?room=${currentRoomCode}`;
    
    elements.roomCreation.classList.add('hidden');
    elements.roomControl.classList.remove('hidden');
    elements.playersSection.classList.remove('hidden');
    
    showNotification('Phòng đã được tạo thành công!', 'success');
    updateCreateButton();
});

socket.on('player-joined', (data) => {
    players.set(data.playerId, {
        id: data.playerId,
        name: data.playerName,
        answers: [],
        currentStage: 1
    });
    updatePlayersList();
    updateStageStats();
    
    if (players.size > 0) {
        elements.startGameBtn.disabled = false;
    }
    
    showNotification(`${data.playerName} đã tham gia phòng`, 'success');
});

socket.on('player-left', (data) => {
    updatePlayersList();
    updateStageStats();
    
    if (players.size === 0) {
        elements.startGameBtn.disabled = true;
    }
    
    showNotification(`${data.playerName} đã rời khỏi phòng`, 'error');
});

socket.on('player-answer', (data) => {
    const player = players.get(data.playerId);
    if (player) {
        player.answers[data.stage - 1] = data.choice;
        player.currentStage = data.stage;
    }
    
    updatePlayersList();
    updateStageStats();
});

socket.on('question-sent', (data) => {
    showNotification(`Đã gửi câu hỏi giai đoạn ${data.stage}`, 'success');
});

socket.on('progress-data', (data) => {
    displayProgress(data.progress);
});

socket.on('admin-left', () => {
    showNotification('Admin đã rời khỏi phòng', 'error');
    window.location.href = '/';
});

socket.on('room-error', (data) => {
    showNotification(data.message, 'error');
});

// Functions
function createRoom() {
    // Generate random room code
    const roomCode = 'ROOM-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    socket.emit('create-room', { roomCode });
}

function startGame() {
    if (players.size === 0) {
        showNotification('Chưa có người chơi nào trong phòng!', 'error');
        return;
    }
    
    socket.emit('start-game', { roomCode: currentRoomCode });
    elements.startGameBtn.disabled = true;
    elements.nextStageBtn.disabled = false;
    elements.stageControl.classList.remove('hidden');
    
    // Send first question
    sendQuestion(1);
}

function sendNextQuestion() {
    if (currentStage < totalStages) {
        currentStage++;
        sendQuestion(currentStage);
    } else {
        showNotification('Đã hết các câu hỏi!', 'success');
    }
}

function sendQuestion(stage) {
    socket.emit('send-question', {
        roomCode: currentRoomCode,
        stage: stage
    });
    
    // Update current stage display
    elements.currentStage.textContent = stageData[stage] || `Giai đoạn ${stage}`;
    
    // Reset player answers for this stage (in UI)
    players.forEach(player => {
        player.answers[stage - 1] = null;
    });
    
    updatePlayersList();
    updateStageStats();
}

function showProgress() {
    socket.emit('get-progress', { roomCode: currentRoomCode });
    elements.progressDisplay.classList.remove('hidden');
}

function displayProgress(progressData) {
    let html = '<div class="players-list">';
    
    progressData.forEach(player => {
        html += `
            <div class="player-card">
                <div class="player-name">${player.name}</div>
                <div class="player-progress">
                    <div><strong>Giai đoạn:</strong> ${player.stage}/${totalStages}</div>
                    <div><strong>Đã trả lời:</strong> ${player.answers.filter(a => a !== null && a !== undefined).length}/${totalStages}</div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    elements.progressDetails.innerHTML = html;
}

function updatePlayersList() {
    elements.playerCount.textContent = players.size;
    
    if (players.size === 0) {
        elements.playersList.innerHTML = '<p class="no-players">Chờ người chơi tham gia...</p>';
        return;
    }
    
    let html = '';
    players.forEach(player => {
        const answeredCount = player.answers.filter(a => a !== null && a !== undefined).length;
        const status = player.currentStage > answeredCount ? '✅ Đang chờ' : '⏳ Chờ câu tiếp theo';
        
        html += `
            <div class="player-card">
                <div class="player-name">${player.name}</div>
                <div class="player-progress">
                    <div><strong>Giai đoạn:</strong> ${player.currentStage}/${totalStages}</div>
                    <div><strong>Đã trả lời:</strong> ${answeredCount}/${totalStages}</div>
                    <div style="margin-top: 10px; color: ${player.currentStage > answeredCount ? '#00b894' : '#636e72'};">${status}</div>
                </div>
            </div>
        `;
    });
    
    elements.playersList.innerHTML = html;
}

function updateStageStats() {
    elements.totalPlayers.textContent = players.size;
    
    if (players.size === 0) {
        elements.totalAnswered.textContent = '0';
        return;
    }
    
    let answeredCount = 0;
    players.forEach(player => {
        if (player.answers[currentStage - 1]) {
            answeredCount++;
        }
    });
    
    elements.totalAnswered.textContent = answeredCount;
}

function copyLink() {
    elements.shareLink.select();
    document.execCommand('copy');
    showNotification('Đã copy link!', 'success');
}

function updateCreateButton() {
    elements.createRoomBtn.disabled = true;
    elements.createRoomBtn.textContent = 'Phòng đã được tạo';
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize
updatePlayersList();

