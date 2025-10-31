// Game state
let gameState = {
    stage: 1,
    path: [],
    inflation: 200,
    supply: 30,
    income: 20,
    trust: 50
};

// Game data structure
const gameData = {
    stage1: {
        title: "Giai đoạn 1: Điều chỉnh giá cả",
        description: "Nhà nước nhận thấy giá cả hàng hóa không phản ánh giá trị thị trường, gây khan hiếm và đầu cơ. Bạn cần quyết định cách điều chỉnh giá cả.",
        choices: [
            {
                text: "Tăng giá dựa trên giá thóc (ngoại trừ xăng, dầu, xi măng, sắt)",
                inflation: 350,
                supply: 25,
                income: 15,
                trust: 40,
                feedback: "Lựa chọn này giống cải cách 1985, gây lạm phát cao và giảm nguồn cung.",
                id: "1.1"
            },
            {
                text: "Giữ nguyên giá cả, tập trung tăng sản xuất qua doanh nghiệp nhà nước",
                inflation: 200,
                supply: 40,
                income: 20,
                trust: 55,
                feedback: "Cải thiện nguồn cung nhưng chưa giải quyết lạm phát và thu nhập thấp.",
                id: "1.2"
            },
            {
                text: "Tự do giá cả theo cung - cầu, khuyến khích tư nhân sản xuất",
                inflation: 150,
                supply: 50,
                income: 25,
                trust: 60,
                feedback: "Phản ánh tư duy Đổi mới 1986, hiệu quả nhưng cần cải cách đồng bộ.",
                id: "1.3"
            }
        ]
    },
    stage2: {
        "1.1": {
            title: "Giai đoạn 2: Điều chỉnh tiền lương",
            description: "Lạm phát tăng vọt lên 350%, hàng hóa biến mất, lương chỉ mua được 15% nhu cầu. Người dân gửi thư phàn nàn khắp nơi. Bạn – lãnh đạo Ủy ban Cải cách – cần quyết định cách xử lý tiền lương trước khi tình hình trở nên tồi tệ hơn.",
            choices: [
                {
                    text: "Tăng lương 20% để bù giá",
                    inflation: 500,
                    supply: 20,
                    income: 20,
                    trust: 30,
                    feedback: "Tái hiện sai lầm 1985, gây lạm phát phi mã.",
                    id: "2.1"
                },
                {
                    text: "Giữ nguyên lương, áp giá trần để kiểm soát lạm phát",
                    inflation: 300,
                    supply: 15,
                    income: 10,
                    trust: 25,
                    feedback: "Giá trần gây đầu cơ, không giải quyết gốc rễ.",
                    id: "2.2"
                },
                {
                    text: "Tăng lương 10% dựa trên năng suất, cải thiện sản xuất nhà nước",
                    inflation: 400,
                    supply: 30,
                    income: 20,
                    trust: 35,
                    feedback: "Hướng đi đúng nhưng chưa đủ do cơ chế bao cấp.",
                    id: "2.3"
                }
            ]
        },
        "1.2": {
            title: "Giai đoạn 2: Điều chỉnh tiền lương",
            description: "Lạm phát ổn định ở mức 200%, sản xuất đã tăng nhẹ. Lương vẫn thấp, nhưng người dân thấy nhiều hàng hóa hơn trong các cửa hàng. Bạn chọn cách nào để xử lý tiền lương?",
            choices: [
                {
                    text: "Tăng lương 20% dựa trên năng suất",
                    inflation: 250,
                    supply: 45,
                    income: 30,
                    trust: 60,
                    feedback: "Hiệu quả, nhưng cần kiểm soát cung tiền.",
                    id: "2.1"
                },
                {
                    text: "Giữ lương, tiếp tục cải cách sản xuất qua tư nhân",
                    inflation: 180,
                    supply: 50,
                    income: 20,
                    trust: 65,
                    feedback: "Ưu tiên nguồn cung, nhưng cần tăng lương hợp lý.",
                    id: "2.2"
                },
                {
                    text: "Tăng lương 10%, cải thiện phân phối hàng hóa",
                    inflation: 220,
                    supply: 45,
                    income: 25,
                    trust: 60,
                    feedback: "Hiệu quả, nhưng cần cải cách cơ chế sâu hơn.",
                    id: "2.3"
                }
            ]
        },
        "1.3": {
            title: "Giai đoạn 2: Điều chỉnh tiền lương",
            description: "Giá cả tự do, hàng hóa tăng, lạm phát giảm xuống còn 150%. Người dân bắt đầu tin tưởng. Bạn chọn cách nào để củng cố và tiếp tục cải cách?",
            choices: [
                {
                    text: "Tăng lương dựa trên năng suất và hiệu quả quản lý",
                    inflation: 180,
                    supply: 55,
                    income: 35,
                    trust: 70,
                    feedback: "Hiệu quả, giống tư duy Đổi mới 1986.",
                    id: "2.1"
                },
                {
                    text: "Tăng lương 30% để bù giá, không dựa trên năng suất",
                    inflation: 250,
                    supply: 50,
                    income: 30,
                    trust: 55,
                    feedback: "Tăng lương không dựa trên năng suất gây lạm phát.",
                    id: "2.2"
                },
                {
                    text: "Giữ lương, tập trung cải cách cơ chế thị trường",
                    inflation: 140,
                    supply: 60,
                    income: 25,
                    trust: 65,
                    feedback: "Ưu tiên cơ chế thị trường, nhưng cần tăng lương.",
                    id: "2.3"
                }
            ]
        }
    },
    stage3: {
        "1.1-2.1": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Lạm phát đã vượt 500%, hàng hóa chỉ còn 20%, người dân xếp hàng từ 3 giờ sáng nhưng trở về tay không. Lương 67 đồng không mua nổi 1kg gạo. Doanh nghiệp tê liệt, ngân sách cạn kiệt. Bộ Chính trị yêu cầu hành động KHẨN CẤP. Bạn – Thống đốc Ngân hàng Nhà nước – chọn chính sách tiền tệ nào?",
            choices: [
                {
                    text: "In tiền, đổi tiền 1:10",
                    inflation: 800,
                    supply: 10,
                    income: 5,
                    trust: 10,
                    feedback: "In tiền không kiểm soát gây lạm phát phi mã, khủng hoảng toàn diện.",
                    result: "Thất bại hoàn toàn (tái hiện 1985)",
                    id: "3.1"
                },
                {
                    text: "Ngừng in tiền, áp giá trần",
                    inflation: 400,
                    supply: 15,
                    income: 15,
                    trust: 25,
                    feedback: "Giá trần gây đầu cơ, không giải quyết gốc rễ.",
                    result: "Thất bại một phần",
                    id: "3.2"
                },
                {
                    text: "Kiểm soát cung tiền, khuyến khích sản xuất",
                    inflation: 350,
                    supply: 25,
                    income: 20,
                    trust: 35,
                    feedback: "Cải thiện nhẹ nhưng không đủ do cơ chế bao cấp.",
                    result: "Thất bại một phần",
                    id: "3.3"
                }
            ]
        },
        "1.1-2.2": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Lạm phát 300%, hàng hóa chỉ còn 15%, chợ đen tràn lan, lương 56 đồng không mua nổi nhu yếu phẩm. Dân gửi thư phàn nàn khắp nơi. Bạn phải cứu vãn trước khi mất kiểm soát hoàn toàn. Chọn chính sách tiền tệ nào?",
            choices: [
                {
                    text: "In tiền, đổi tiền 1:10",
                    inflation: 600,
                    supply: 10,
                    income: 5,
                    trust: 15,
                    feedback: "In tiền làm trầm trọng khủng hoảng.",
                    result: "Thất bại",
                    id: "3.1"
                },
                {
                    text: "Ngừng in tiền, cải thiện phân phối",
                    inflation: 250,
                    supply: 20,
                    income: 15,
                    trust: 30,
                    feedback: "Cải thiện phân phối giúp giảm lạm phát nhẹ.",
                    result: "Thất bại một phần",
                    id: "3.2"
                },
                {
                    text: "Kiểm soát cung tiền, khuyến khích tư nhân",
                    inflation: 200,
                    supply: 30,
                    income: 20,
                    trust: 40,
                    feedback: "Bước tiến đúng hướng nhưng vẫn cần cải cách cơ chế.",
                    result: "Trung bình",
                    id: "3.3"
                }
            ]
        },
        "1.1-2.3": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Lạm phát 400%, sản xuất bắt đầu tăng nhẹ (30%), nhưng dân vẫn khổ vì lương chưa đủ sống. Doanh nghiệp nhà nước kêu gọi hỗ trợ. Bạn chọn cách nào để không làm tình hình tệ hơn?",
            choices: [
                {
                    text: "In tiền, đổi tiền 1:10",
                    inflation: 700,
                    supply: 20,
                    income: 10,
                    trust: 20,
                    feedback: "In tiền gây lạm phát phi mã.",
                    result: "Thất bại",
                    id: "3.1"
                },
                {
                    text: "Ngừng in tiền, cải thiện sản xuất",
                    inflation: 300,
                    supply: 35,
                    income: 25,
                    trust: 45,
                    feedback: "Cải thiện sản xuất giúp giảm lạm phát.",
                    result: "Trung bình",
                    id: "3.2"
                },
                {
                    text: "Kiểm soát cung tiền, khuyến khích tư nhân",
                    inflation: 250,
                    supply: 40,
                    income: 30,
                    trust: 50,
                    feedback: "Hướng đi đúng, nhưng cần cải cách sâu hơn.",
                    result: "Trung bình",
                    id: "3.3"
                }
            ]
        },
        "1.2-2.1": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Lạm phát 250%, sản xuất tăng (45%), lương bắt đầu đủ sống hơn. Dân lạc quan, nhưng ngân sách căng thẳng. Bạn chọn cách củng cố hay mạo hiểm thêm?",
            choices: [
                {
                    text: "In tiền để hỗ trợ lương",
                    inflation: 400,
                    supply: 40,
                    income: 25,
                    trust: 50,
                    feedback: "In tiền làm tăng lạm phát, giảm hiệu quả cải cách.",
                    result: "Trung bình",
                    id: "3.1"
                },
                {
                    text: "Kiểm soát cung tiền, cải thiện sản xuất",
                    inflation: 200,
                    supply: 50,
                    income: 35,
                    trust: 65,
                    feedback: "Kiểm soát cung tiền giúp ổn định kinh tế.",
                    result: "Trung bình",
                    id: "3.2"
                },
                {
                    text: "Tạm dừng in tiền, cải cách cơ chế thị trường",
                    inflation: 150,
                    supply: 55,
                    income: 40,
                    trust: 70,
                    feedback: "Cải cách cơ chế giúp ổn định kinh tế.",
                    result: "Thành công một phần",
                    id: "3.3"
                }
            ]
        },
        "1.2-2.2": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Lạm phát 180%, tư nhân bắt đầu sản xuất (50% hàng hóa), nhưng lương vẫn thấp. Dân tin tưởng triển vọng. Bạn chọn cách đẩy mạnh hay an toàn?",
            choices: [
                {
                    text: "In tiền để tăng lương 10%",
                    inflation: 250,
                    supply: 45,
                    income: 30,
                    trust: 60,
                    feedback: "In tiền gây lạm phát, làm giảm hiệu quả cải cách.",
                    result: "Trung bình",
                    id: "3.1"
                },
                {
                    text: "Kiểm soát cung tiền, cải thiện sản xuất",
                    inflation: 140,
                    supply: 60,
                    income: 30,
                    trust: 70,
                    feedback: "Kiểm soát cung tiền và tăng sản xuất là hướng đi đúng.",
                    result: "Thành công một phần",
                    id: "3.2"
                },
                {
                    text: "Tạm dừng in tiền, cải cách cơ chế thị trường",
                    inflation: 120,
                    supply: 65,
                    income: 35,
                    trust: 75,
                    feedback: "Tương tự Đổi mới 1986, cải cách cơ chế là chìa khóa.",
                    result: "Thành công",
                    id: "3.3"
                }
            ]
        },
        "1.2-2.3": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Lạm phát 220%, phân phối tốt hơn (45%), lương tăng nhẹ. Dân thấy hàng hóa đều hơn. Bạn chọn cách duy trì đà tăng trưởng ra sao?",
            choices: [
                {
                    text: "In tiền để tăng lương",
                    inflation: 350,
                    supply: 40,
                    income: 20,
                    trust: 50,
                    feedback: "In tiền làm tăng lạm phát, giảm hiệu quả cải cách.",
                    result: "Trung bình",
                    id: "3.1"
                },
                {
                    text: "Kiểm soát cung tiền, cải thiện sản xuất",
                    inflation: 180,
                    supply: 50,
                    income: 30,
                    trust: 65,
                    feedback: "Kiểm soát cung tiền giúp ổn định kinh tế.",
                    result: "Thành công một phần",
                    id: "3.2"
                },
                {
                    text: "Tạm dừng in tiền, cải cách cơ chế",
                    inflation: 150,
                    supply: 55,
                    income: 35,
                    trust: 70,
                    feedback: "Cải cách cơ chế giúp cải thiện kinh tế bền vững.",
                    result: "Thành công một phần",
                    id: "3.3"
                }
            ]
        },
        "1.3-2.1": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Lạm phát chỉ 180%, hàng hóa dồi dào (55%), lương đủ sống, dân tin tưởng cao. Đây là cơ hội vàng để hoàn tất Đổi mới. Bạn chọn cách nào?",
            choices: [
                {
                    text: "In tiền để tăng lương 10%",
                    inflation: 250,
                    supply: 50,
                    income: 40,
                    trust: 60,
                    feedback: "In tiền làm tăng lạm phát, giảm hiệu quả cải cách.",
                    result: "Trung bình",
                    id: "3.1"
                },
                {
                    text: "Kiểm soát cung tiền, cải thiện sản xuất",
                    inflation: 140,
                    supply: 65,
                    income: 45,
                    trust: 75,
                    feedback: "Kết hợp cải cách thị trường và kiểm soát cung tiền là công thức thành công.",
                    result: "Thành công",
                    id: "3.2"
                },
                {
                    text: "Tạm dừng in tiền, cải cách cơ chế thị trường",
                    inflation: 120,
                    supply: 70,
                    income: 50,
                    trust: 80,
                    feedback: "Tương tự Đổi mới 1986, cải cách toàn diện mang lại kết quả bền vững.",
                    result: "Thành công",
                    id: "3.3"
                }
            ]
        },
        "1.3-2.2": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Lạm phát tăng lại 250% do bù lương không dựa trên năng suất, hàng hóa ổn định (50%). Dân lo ngại lạm phát quay lại. Bạn chọn cách khắc phục?",
            choices: [
                {
                    text: "In tiền để hỗ trợ lương",
                    inflation: 400,
                    supply: 45,
                    income: 25,
                    trust: 50,
                    feedback: "In tiền làm tăng lạm phát, giảm hiệu quả cải cách.",
                    result: "Trung bình",
                    id: "3.1"
                },
                {
                    text: "Kiểm soát cung tiền, cải thiện sản xuất",
                    inflation: 200,
                    supply: 55,
                    income: 35,
                    trust: 60,
                    feedback: "Kiểm soát cung tiền giúp ổn định kinh tế.",
                    result: "Trung bình",
                    id: "3.2"
                },
                {
                    text: "Tạm dừng in tiền, cải cách cơ chế",
                    inflation: 180,
                    supply: 60,
                    income: 40,
                    trust: 65,
                    feedback: "Cải cách cơ chế giúp cải thiện kinh tế.",
                    result: "Thành công một phần",
                    id: "3.3"
                }
            ]
        },
        "1.3-2.3": {
            title: "Giai đoạn 3: Chính sách tiền tệ",
            description: "Lạm phát thấp nhất 140%, hàng hóa dồi dào (60%), cơ chế thị trường đang hình thành. Dân chờ lương tăng. Bạn chọn cách hoàn thiện cải cách?",
            choices: [
                {
                    text: "In tiền để tăng lương 10%",
                    inflation: 200,
                    supply: 55,
                    income: 35,
                    trust: 60,
                    feedback: "In tiền làm tăng lạm phát, giảm hiệu quả cải cách.",
                    result: "Trung bình",
                    id: "3.1"
                },
                {
                    text: "Kiểm soát cung tiền, cải thiện sản xuất",
                    inflation: 120,
                    supply: 65,
                    income: 40,
                    trust: 70,
                    feedback: "Kiểm soát cung tiền và cải thiện sản xuất là hướng đi đúng.",
                    result: "Thành công một phần",
                    id: "3.2"
                },
                {
                    text: "Tạm dừng in tiền, cải cách cơ chế thị trường",
                    inflation: 100,
                    supply: 70,
                    income: 45,
                    trust: 80,
                    feedback: "Tương tự Đổi mới 1986, cải cách toàn diện mang lại kết quả bền vững.",
                    result: "Thành công",
                    id: "3.3"
                }
            ]
        }
    }
};

// DOM elements
const screens = {
    start: document.getElementById('start-screen'),
    game: document.getElementById('game-screen'),
    result: document.getElementById('result-screen'),
    allScenarios: document.getElementById('all-scenarios-screen')
};

// Event listeners
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('show-all-btn').addEventListener('click', showAllScenarios);
document.getElementById('show-all-from-game-btn').addEventListener('click', showAllScenarios);
document.getElementById('show-all-from-result-btn').addEventListener('click', showAllScenarios);
document.getElementById('reset-btn').addEventListener('click', resetGame);
document.getElementById('play-again-btn').addEventListener('click', resetGame);
document.getElementById('back-to-start-btn').addEventListener('click', backToStart);

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
}

function resetGame() {
    gameState = {
        stage: 1,
        path: [],
        inflation: 200,
        supply: 30,
        income: 20,
        trust: 50
    };
    document.getElementById('feedback-section').classList.add('hidden');
    startGame();
}

function backToStart() {
    resetGame();
    showScreen('start');
}

function startGame() {
    gameState = {
        stage: 1,
        path: [],
        inflation: 200,
        supply: 30,
        income: 20,
        trust: 50
    };
    showScreen('game');
    updateStats();
    updateProgressBar();
    loadStage();
}

function updateStats() {
    document.getElementById('current-inflation').textContent = `${gameState.inflation}%`;
    document.getElementById('current-supply').textContent = `${gameState.supply}/100`;
    document.getElementById('current-income').textContent = `${gameState.income}/100`;
    document.getElementById('current-trust').textContent = `${gameState.trust}/100`;
}

function updateProgressBar() {
    // Update progress bar
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
        const stageNum = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stageNum < gameState.stage) {
            step.classList.add('completed');
        } else if (stageNum === gameState.stage) {
            step.classList.add('active');
        }
    });
    
    // Update stage indicator
    document.getElementById('stage-indicator').textContent = `Giai đoạn ${gameState.stage}/3`;
}

function loadStage() {
    const stage = gameData[`stage${gameState.stage}`];
    let currentChoices;

    if (gameState.stage === 1) {
        document.getElementById('stage-title').textContent = stage.title;
        document.getElementById('stage-description').textContent = stage.description;
        currentChoices = stage.choices;
    } else if (gameState.stage === 2) {
        const pathKey = gameState.path[0];
        document.getElementById('stage-title').textContent = stage[pathKey].title;
        document.getElementById('stage-description').textContent = stage[pathKey].description;
        currentChoices = stage[pathKey].choices;
    } else if (gameState.stage === 3) {
        const pathKey = `${gameState.path[0]}-${gameState.path[1]}`;
        document.getElementById('stage-title').textContent = stage[pathKey].title;
        document.getElementById('stage-description').textContent = stage[pathKey].description;
        currentChoices = stage[pathKey].choices;
    }

    renderChoices(currentChoices);
}

function renderChoices(choices) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    choices.forEach((choice, index) => {
        const choiceCard = document.createElement('div');
        choiceCard.className = 'choice-card';
        choiceCard.innerHTML = `
            <h4>Lựa chọn ${index + 1}</h4>
            <p>${choice.text}</p>
        `;
        choiceCard.addEventListener('click', () => makeChoice(choice));
        container.appendChild(choiceCard);
    });
}

function makeChoice(choice) {
    // Store previous values before updating
    const prevInflation = gameState.inflation;
    const prevSupply = gameState.supply;
    const prevIncome = gameState.income;
    const prevTrust = gameState.trust;
    
    // Update state
    gameState.inflation = choice.inflation;
    gameState.supply = choice.supply;
    gameState.income = choice.income;
    gameState.trust = choice.trust;
    gameState.path.push(choice.id);

    // Show feedback
    const feedbackSection = document.getElementById('feedback-section');
    const feedbackContent = document.getElementById('feedback-content');
    
    // Calculate changes
    const inflationChange = choice.inflation - prevInflation;
    const inflationChangeText = inflationChange > 0 ? `+${inflationChange}%` : inflationChange < 0 ? `${inflationChange}%` : '0%';
    const inflationChangeClass = inflationChange > 0 ? 'negative' : inflationChange < 0 ? 'positive' : 'neutral';
    
    const supplyChange = choice.supply - prevSupply;
    const supplyChangeText = supplyChange > 0 ? `+${supplyChange}` : supplyChange < 0 ? `${supplyChange}` : '0';
    const supplyChangeClass = supplyChange > 0 ? 'positive' : supplyChange < 0 ? 'negative' : 'neutral';
    
    const incomeChange = choice.income - prevIncome;
    const incomeChangeText = incomeChange > 0 ? `+${incomeChange}` : incomeChange < 0 ? `${incomeChange}` : '0';
    const incomeChangeClass = incomeChange > 0 ? 'positive' : incomeChange < 0 ? 'negative' : 'neutral';
    
    const trustChange = choice.trust - prevTrust;
    const trustChangeText = trustChange > 0 ? `+${trustChange}` : trustChange < 0 ? `${trustChange}` : '0';
    const trustChangeClass = trustChange > 0 ? 'positive' : trustChange < 0 ? 'negative' : 'neutral';
    
    const isLastStage = gameState.stage === 3;
    
    feedbackContent.innerHTML = `
        <div class="feedback-text">
            <p><strong>📊 Kết quả:</strong></p>
            <div class="result-changes">
                <div class="change-item">
                    <span>Lạm phát:</span>
                    <span class="change-value ${inflationChangeClass}">${choice.inflation}% ${inflationChangeText}</span>
                </div>
                <div class="change-item">
                    <span>Nguồn cung:</span>
                    <span class="change-value ${supplyChangeClass}">${choice.supply}/100 ${supplyChangeText}</span>
                </div>
                <div class="change-item">
                    <span>Thu nhập thực tế:</span>
                    <span class="change-value ${incomeChangeClass}">${choice.income}/100 ${incomeChangeText}</span>
                </div>
                <div class="change-item">
                    <span>Niềm tin xã hội:</span>
                    <span class="change-value ${trustChangeClass}">${choice.trust}/100 ${trustChangeText}</span>
                </div>
            </div>
            <p><strong>💬 Phản hồi:</strong> ${choice.feedback}</p>
        </div>
        <div class="feedback-actions">
            ${isLastStage ? 
                '<button id="view-result-btn" class="btn btn-primary">Xem kết quả cuối cùng</button>' :
                '<button id="next-stage-btn" class="btn btn-primary">Tiếp tục đến giai đoạn tiếp theo →</button>'
            }
        </div>
    `;
    feedbackSection.classList.remove('hidden');

    updateStats();

    // Add event listener to continue button
    if (isLastStage) {
        document.getElementById('view-result-btn').addEventListener('click', () => {
            continueToNext();
        });
    } else {
        document.getElementById('next-stage-btn').addEventListener('click', () => {
            continueToNext();
        });
    }
}

function continueToNext() {
    gameState.stage++;
    if (gameState.stage <= 3) {
        document.getElementById('feedback-section').classList.add('hidden');
        updateProgressBar();
        loadStage();
    } else {
        // Mark all stages as completed
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach(step => {
            step.classList.add('completed');
            step.classList.remove('active');
        });
        endGame();
    }
}

function endGame() {
    showScreen('result');
    
    document.getElementById('final-inflation').textContent = `${gameState.inflation}%`;
    document.getElementById('final-supply').textContent = `${gameState.supply}/100`;
    document.getElementById('final-income').textContent = `${gameState.income}/100`;
    document.getElementById('final-trust').textContent = `${gameState.trust}/100`;

    // Determine result
    const success = gameState.inflation < 150 && gameState.supply > 60 && gameState.income > 50 && gameState.trust > 70;
    const failure = gameState.inflation > 500 || gameState.supply < 30 || gameState.income < 20 || gameState.trust < 30;

    let resultMessage, resultClass;
    if (success) {
        resultMessage = "🎉 THÀNH CÔNG! Bạn đã vực dậy nền kinh tế thành công!";
        resultClass = "success";
    } else if (failure) {
        resultMessage = "❌ THẤT BẠI! Nền kinh tế rơi vào khủng hoảng.";
        resultClass = "failure";
    } else {
        resultMessage = "⚠️ KẾT QUẢ TRUNG BÌNH! Cần cải cách sâu hơn.";
        resultClass = "average";
    }

    document.getElementById('result-title').textContent = resultMessage;
    document.getElementById('result-title').className = resultClass;

    // Get final feedback from last choice
    const pathKey = `${gameState.path[0]}-${gameState.path[1]}`;
    const finalChoice = gameData.stage3[pathKey].choices.find(c => c.id === gameState.path[2]);
    
    document.getElementById('result-message').innerHTML = `
        <div class="result-message ${resultClass}">
            <h3>${finalChoice.result}</h3>
            <p>${finalChoice.feedback}</p>
        </div>
    `;
}

function showAllScenarios() {
    showScreen('allScenarios');
    
    const container = document.getElementById('all-scenarios-container');
    container.innerHTML = '';

    const scenarios = generateAllScenarios();
    
    scenarios.forEach((scenario, index) => {
        const scenarioCard = document.createElement('div');
        scenarioCard.className = 'scenario-card';
        
        const pathStr = scenario.path.join(' → ');
        
        scenarioCard.innerHTML = `
            <div class="scenario-header">
                <h3>Kịch bản ${index + 1}</h3>
                <span class="path-label">${pathStr}</span>
            </div>
            <div class="scenario-stats">
                <div class="stat-item">
                    <span class="stat-label">Lạm phát</span>
                    <span class="stat-value">${scenario.inflation}%</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Nguồn cung</span>
                    <span class="stat-value">${scenario.supply}/100</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Thu nhập</span>
                    <span class="stat-value">${scenario.income}/100</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Niềm tin</span>
                    <span class="stat-value">${scenario.trust}/100</span>
                </div>
            </div>
            <div class="scenario-result">
                <span class="result-badge ${scenario.resultClass}">${scenario.result}</span>
            </div>
        `;
        
        container.appendChild(scenarioCard);
    });
}

function generateAllScenarios() {
    const scenarios = [];
    
    // Iterate through all possible paths
    const paths = {
        stage1: ['1.1', '1.2', '1.3'],
        stage2_1: ['2.1', '2.2', '2.3'],
        stage2_2: ['2.1', '2.2', '2.3'],
        stage2_3: ['2.1', '2.2', '2.3'],
        stage3: ['3.1', '3.2', '3.3']
    };

    paths.stage1.forEach(s1 => {
        const s2Choices = gameData.stage2[s1].choices;
        s2Choices.forEach(s2Choice => {
            const pathKey = `${s1}-${s2Choice.id}`;
            const s3Choices = gameData.stage3[pathKey].choices;
            s3Choices.forEach(s3Choice => {
                const inflation = s3Choice.inflation;
                const supply = s3Choice.supply;
                const income = s3Choice.income;
                const trust = s3Choice.trust;

                const success = inflation < 150 && supply > 60 && income > 50 && trust > 70;
                const failure = inflation > 500 || supply < 30 || income < 20 || trust < 30;

                let result, resultClass;
                if (success) {
                    result = "Thành công";
                    resultClass = "success";
                } else if (failure) {
                    result = "Thất bại";
                    resultClass = "failure";
                } else {
                    result = "Trung bình";
                    resultClass = "average";
                }

                scenarios.push({
                    path: [s1, s2Choice.id, s3Choice.id],
                    inflation: inflation,
                    supply: supply,
                    income: income,
                    trust: trust,
                    result: result,
                    resultClass: resultClass
                });
            });
        });
    });

    return scenarios;
}

// Initialize
showScreen('start');

