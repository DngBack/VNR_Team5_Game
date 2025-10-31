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
    endGameBtn: document.getElementById('end-game-btn'),
    showProgressBtn: document.getElementById('show-progress-btn'),
    restartRoomBtn: document.getElementById('restart-room-btn'),
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
elements.endGameBtn.addEventListener('click', endGame);
elements.showProgressBtn.addEventListener('click', showProgress);
elements.restartRoomBtn.addEventListener('click', restartRoom);

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
    elements.endGameBtn.disabled = false;
    elements.stageControl.classList.remove('hidden');
    
    // Send first question
    sendQuestion(1);
}

function sendNextQuestion() {
    if (currentStage < totalStages) {
        currentStage++;
        sendQuestion(currentStage);
    } else {
        showNotification('Đã hết các câu hỏi! Nhấn "Kết thúc game" để kết thúc.', 'success');
        elements.nextStageBtn.disabled = true;
    }
}

function endGame() {
    socket.emit('end-game', { roomCode: currentRoomCode });
    elements.endGameBtn.disabled = true;
    elements.nextStageBtn.disabled = true;
    showNotification('Game đã kết thúc!', 'success');
}

function restartRoom() {
    if (confirm('Bạn có chắc muốn tạo phòng mới? Phòng hiện tại sẽ bị xóa và tất cả người chơi sẽ bị disconnect.')) {
        // Reset state
        players.clear();
        currentStage = 1;
        currentRoomCode = null;
        
        // Hide all game-related sections
        elements.roomControl.classList.add('hidden');
        elements.playersSection.classList.add('hidden');
        elements.stageControl.classList.add('hidden');
        elements.progressDisplay.classList.add('hidden');
        
        // Show room creation
        elements.roomCreation.classList.remove('hidden');
        
        // Enable create button
        elements.createRoomBtn.disabled = false;
        elements.createRoomBtn.textContent = 'Tạo phòng mới';
        
        // Clean up display
        elements.roomCodeDisplay.textContent = '---';
        elements.shareLink.value = '';
        
        showNotification('Đã reset. Bạn có thể tạo phòng mới.', 'success');
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
        const answeredCount = player.answers.filter(a => a !== null && a !== undefined).length;
        
        // Show all choices and outputs for this player
        let allChoicesHtml = '';
        if (player.answers.length > 0) {
            allChoicesHtml = '<div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">';
            allChoicesHtml += '<strong style="display: block; margin-bottom: 10px;">📝 Tất cả lựa chọn:</strong>';
            
            player.answers.forEach((answerId, index) => {
                if (answerId) {
                    const choice = getChoiceData(answerId, index + 1, player.answers);
                    if (choice) {
                        allChoicesHtml += `
                            <div style="margin-bottom: 12px; padding: 10px; background: white; border-left: 3px solid #667eea; border-radius: 5px;">
                                <strong>Giai đoạn ${index + 1}:</strong> ${choice.text}
                                ${choice.inflation !== undefined ? `
                                    <div style="margin-top: 6px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; font-size: 0.85em;">
                                        <span>💹 Lạm phát: <strong>${choice.inflation}%</strong></span>
                                        <span>📦 Nguồn cung: <strong>${choice.supply}/100</strong></span>
                                        <span>💰 Thu nhập: <strong>${choice.income}/100</strong></span>
                                        <span>🤝 Niềm tin: <strong>${choice.trust}/100</strong></span>
                                    </div>
                                    <div style="margin-top: 6px; font-style: italic; font-size: 0.85em; color: #666;">
                                        💬 ${choice.feedback}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }
                }
            });
            
            allChoicesHtml += '</div>';
        }
        
        html += `
            <div class="player-card">
                <div class="player-name">${player.name}</div>
                <div class="player-progress">
                    <div><strong>Giai đoạn:</strong> ${player.stage}/${totalStages}</div>
                    <div><strong>Đã trả lời:</strong> ${answeredCount}/${totalStages}</div>
                    ${allChoicesHtml}
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
        
        // Get and display latest choice with stats
        let latestChoiceHtml = '';
        let latestStats = null;
        
        if (player.answers.length > 0) {
            const lastAnswerId = player.answers[answeredCount - 1];
            const stageNum = answeredCount;
            const lastChoice = getChoiceData(lastAnswerId, stageNum, player.answers);
            
            if (lastChoice) {
                latestChoiceHtml = `
                    <div style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 8px; font-size: 0.9em;">
                        <strong>Lựa chọn:</strong> ${lastChoice.text}
                        ${lastChoice.inflation !== undefined ? `
                            <div style="margin-top: 8px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; font-size: 0.85em;">
                                <span>💹 Lạm phát: <strong>${lastChoice.inflation}%</strong></span>
                                <span>📦 Nguồn cung: <strong>${lastChoice.supply}/100</strong></span>
                                <span>💰 Thu nhập: <strong>${lastChoice.income}/100</strong></span>
                                <span>🤝 Niềm tin: <strong>${lastChoice.trust}/100</strong></span>
                            </div>
                            ${lastChoice.feedback ? `
                                <div style="margin-top: 6px; font-style: italic; font-size: 0.85em; color: #666;">
                                    💬 ${lastChoice.feedback}
                                </div>
                            ` : ''}
                        ` : ''}
                    </div>
                `;
                latestStats = lastChoice;
            }
        }
        
        html += `
            <div class="player-card">
                <div class="player-name">${player.name}</div>
                <div class="player-progress">
                    <div><strong>Giai đoạn:</strong> ${player.currentStage}/${totalStages}</div>
                    <div><strong>Đã trả lời:</strong> ${answeredCount}/${totalStages}</div>
                    <div style="margin-top: 10px; color: ${player.currentStage > answeredCount ? '#00b894' : '#636e72'};">${status}</div>
                    ${latestChoiceHtml}
                </div>
            </div>
        `;
    });
    
    elements.playersList.innerHTML = html;
}

// Helper to get choice data with stats from gameData
function getChoiceData(choiceId, stage, playerAnswers = []) {
    if (!gameData) return null;
    
    let questionData;
    
    if (stage === 1) {
        questionData = gameData.stage1;
    } else if (stage === 2) {
        // Get the branch based on stage 1 answer
        const stage1Answer = playerAnswers[0];
        if (!stage1Answer) return null;
        questionData = gameData.stage2[stage1Answer];
    } else if (stage === 3) {
        // Get the branch based on stage 1 and 2 answers
        const stage1Answer = playerAnswers[0];
        const stage2Answer = playerAnswers[1];
        if (!stage1Answer || !stage2Answer) return null;
        const pathKey = `${stage1Answer}-${stage2Answer}`;
        questionData = gameData.stage3[pathKey];
    }
    
    if (!questionData || !questionData.choices) {
        return null;
    }
    
    return questionData.choices.find(c => c.id === choiceId);
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

