const socket = io();
let currentRoomCode = null;
let playerName = '';
let currentStage = 1;
let selectedChoice = null;

// Get game data from game.js
const gameData = {
    stage1: {
        title: "Giai đoạn 1: Điều chỉnh giá cả",
        description: "Nhà nước nhận thấy giá cả hàng hóa không phản ánh giá trị thị trường, gây khan hiếm và đầu cơ. Bạn cần quyết định cách điều chỉnh giá cả.",
        choices: [
            {
                text: "Tăng giá dựa trên giá thóc (ngoại trừ xăng, dầu, xi măng, sắt)",
                id: "1.1"
            },
            {
                text: "Giữ nguyên giá cả, tập trung tăng sản xuất qua doanh nghiệp nhà nước",
                id: "1.2"
            },
            {
                text: "Tự do giá cả theo cung - cầu, khuyến khích tư nhân sản xuất",
                id: "1.3"
            }
        ]
    },
    stage2: {
        "1.1": {
            title: "Giai đoạn 2: Điều chỉnh tiền lương",
            description: "Với lạm phát cao và nguồn cung thấp, bạn cần cân nhắc cẩn thận việc điều chỉnh lương.",
            choices: [
                { text: "Tăng lương 20% để bù giá", id: "2.1" },
                { text: "Giữ nguyên lương, áp giá trần để kiểm soát lạm phát", id: "2.2" },
                { text: "Tăng lương 10% dựa trên năng suất, cải thiện sản xuất nhà nước", id: "2.3" }
            ]
        },
        "1.2": {
            title: "Giai đoạn 2: Điều chỉnh tiền lương",
            description: "Với nguồn cung đã được cải thiện, bạn có nhiều lựa chọn hơn về điều chỉnh lương.",
            choices: [
                { text: "Tăng lương 20% dựa trên năng suất", id: "2.1" },
                { text: "Giữ lương, tiếp tục cải cách sản xuất qua tư nhân", id: "2.2" },
                { text: "Tăng lương 10%, cải thiện phân phối hàng hóa", id: "2.3" }
            ]
        },
        "1.3": {
            title: "Giai đoạn 2: Điều chỉnh tiền lương",
            description: "Với triển vọng kinh tế tích cực, bạn có cơ hội củng cố cải cách.",
            choices: [
                { text: "Tăng lương dựa trên năng suất và hiệu quả quản lý", id: "2.1" },
                { text: "Tăng lương 30% để bù giá, không dựa trên năng suất", id: "2.2" },
                { text: "Giữ lương, tập trung cải cách cơ chế thị trường", id: "2.3" }
            ]
        }
    },
    stage3: {
        "1.1-2.1": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Với lạm phát phi mã, cần quyết định quyết liệt về chính sách tiền tệ.",
            choices: [
                { text: "In tiền, đổi tiền 1:10", id: "3.1" },
                { text: "Ngừng in tiền, áp giá trần", id: "3.2" },
                { text: "Kiểm soát cung tiền, khuyến khích sản xuất", id: "3.3" }
            ]
        },
        "1.1-2.2": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Với nguồn cung thấp và niềm tin xã hội giảm, cần cân nhắc cẩn thận.",
            choices: [
                { text: "In tiền, đổi tiền 1:10", id: "3.1" },
                { text: "Ngừng in tiền, cải thiện phân phối", id: "3.2" },
                { text: "Kiểm soát cung tiền, khuyến khích tư nhân", id: "3.3" }
            ]
        },
        "1.1-2.3": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Với nỗ lực cải thiện sản xuất, cần chính sách tiền tệ phù hợp.",
            choices: [
                { text: "In tiền, đổi tiền 1:10", id: "3.1" },
                { text: "Ngừng in tiền, cải thiện sản xuất", id: "3.2" },
                { text: "Kiểm soát cung tiền, khuyến khích tư nhân", id: "3.3" }
            ]
        },
        "1.2-2.1": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Với nền tảng tốt, cần quyết định về cung tiền.",
            choices: [
                { text: "In tiền để hỗ trợ lương", id: "3.1" },
                { text: "Kiểm soát cung tiền, cải thiện sản xuất", id: "3.2" },
                { text: "Tạm dừng in tiền, cải cách cơ chế thị trường", id: "3.3" }
            ]
        },
        "1.2-2.2": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Với triển vọng kinh tế tích cực, cần hoàn thiện cải cách.",
            choices: [
                { text: "In tiền để tăng lương 10%", id: "3.1" },
                { text: "Kiểm soát cung tiền, cải thiện sản xuất", id: "3.2" },
                { text: "Tạm dừng in tiền, cải cách cơ chế thị trường", id: "3.3" }
            ]
        },
        "1.2-2.3": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Với cơ sở kinh tế ổn định, cần quyết định cuối cùng.",
            choices: [
                { text: "In tiền để tăng lương", id: "3.1" },
                { text: "Kiểm soát cung tiền, cải thiện sản xuất", id: "3.2" },
                { text: "Tạm dừng in tiền, cải cách cơ chế", id: "3.3" }
            ]
        },
        "1.3-2.1": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Với đời sống cải thiện, cần hoàn thiện cải cách.",
            choices: [
                { text: "In tiền để tăng lương 10%", id: "3.1" },
                { text: "Kiểm soát cung tiền, cải thiện sản xuất", id: "3.2" },
                { text: "Tạm dừng in tiền, cải cách cơ chế thị trường", id: "3.3" }
            ]
        },
        "1.3-2.2": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Với mức độ lo ngại về lạm phát, cần chính sách phù hợp.",
            choices: [
                { text: "In tiền để hỗ trợ lương", id: "3.1" },
                { text: "Kiểm soát cung tiền, cải thiện sản xuất", id: "3.2" },
                { text: "Tạm dừng in tiền, cải cách cơ chế", id: "3.3" }
            ]
        },
        "1.3-2.3": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Với triển vọng kinh tế tốt, cần quyết định cuối cùng.",
            choices: [
                { text: "In tiền để tăng lương 10%", id: "3.1" },
                { text: "Kiểm soát cung tiền, cải thiện sản xuất", id: "3.2" },
                { text: "Tạm dừng in tiền, cải cách cơ chế thị trường", id: "3.3" }
            ]
        }
    }
};

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
    submitBtn: document.getElementById('submit-btn')
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
    
    // Send answer to server
    socket.emit('submit-answer', {
        roomCode: currentRoomCode,
        stage: currentStage,
        choice: selectedChoice.id
    });
    
    // Disable submit button and show waiting message
    elements.submitBtn.disabled = true;
    elements.submitBtn.innerHTML = '<span class="loading"></span> Đã gửi...';
    
    // If last stage, show completed screen
    if (currentStage === 3) {
        setTimeout(() => {
            elements.gameArea.classList.remove('active');
            elements.completedScreen.classList.remove('hidden');
        }, 1000);
    }
    
    // Reset button after 2 seconds
    setTimeout(() => {
        elements.submitBtn.textContent = 'Xác nhận lựa chọn';
        elements.submitBtn.disabled = true;
    }, 2000);
}

// Allow Enter key to join room
elements.playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinRoom();
    }
});

