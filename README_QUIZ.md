# Quiz Game - Multiplayer Interactive Quiz System

Hệ thống game quiz tương tác với tính năng multiplayer realtime, cho phép admin tạo phòng và theo dõi tiến trình của người chơi.

## 📋 Mục lục

- [Tính năng](#tính-năng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Cài đặt](#cài-đặt)
- [Sử dụng](#sử-dụng)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)

## ✨ Tính năng

### Cho Admin/Host:
- ✅ Tạo phòng chơi với mã phòng ngẫu nhiên
- ✅ Chia sẻ link để người chơi tham gia
- ✅ Theo dõi tiến trình realtime của tất cả người chơi
- ✅ Xem lựa chọn của từng người chơi
- ✅ Điều khiển tiến trình game (bắt đầu, chuyển câu hỏi)
- ✅ Thống kê số người đã trả lời

### Cho Người chơi:
- ✅ Tham gia phòng bằng mã phòng hoặc link
- ✅ Giao diện quiz thân thiện và trực quan
- ✅ Nhận câu hỏi theo thời gian thực
- ✅ Tự động branch theo lựa chọn (27 kịch bản khác nhau)
- ✅ Hiển thị trạng thái hoàn thành

### Tính năng chung:
- ✅ Đồng bộ realtime với Socket.io
- ✅ 3 giai đoạn câu hỏi với nhánh logic động
- ✅ 27 kịch bản kết quả khác nhau
- ✅ Giao diện hiện đại, responsive
- ✅ Single player mode (game gốc)

## 📁 Cấu trúc dự án

```
VNR_Team5_Game/
├── server.js              # Backend server với Socket.io
├── package.json           # Dependencies
├── index.html             # Trang chủ (chọn vai trò)
├── admin.html             # Trang admin/host
├── admin.js               # Logic admin
├── player.html            # Trang người chơi
├── player.js              # Logic player
├── index_single.html      # Game single player (gốc)
├── game.js                # Logic game gốc
├── styles.css             # CSS chung
├── plan.md                # Kế hoạch chi tiết
├── README.md              # README gốc
└── README_QUIZ.md         # README này
```

## 🚀 Cài đặt

### Yêu cầu:
- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn

### Bước cài đặt:

1. **Clone repository:**
```bash
git clone <repository-url>
cd VNR_Team5_Game
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Chạy server:**
```bash
npm start
```

Hoặc sử dụng nodemon cho development:
```bash
npm install -g nodemon
nodemon server.js
```

4. **Mở trình duyệt:**
```
http://localhost:3000
```

## 🎮 Sử dụng

### Cho Admin:

1. Truy cập `http://localhost:3000/admin.html` hoặc chọn "Admin / Host" từ trang chủ
2. Click **"Tạo phòng mới"** để tạo phòng
3. Copy link hoặc mã phòng và chia sẻ cho người chơi
4. Khi có đủ người chơi, click **"Bắt đầu game"**
5. Click **"Câu hỏi tiếp theo"** để chuyển sang câu hỏi tiếp
6. Xem tiến trình và lựa chọn của người chơi trong **"Xem tiến trình"**

### Cho Người chơi:

1. Nhận link từ admin (ví dụ: `http://localhost:3000/player.html?room=ROOM-ABC123`)
2. Nhập tên của bạn và click **"Tham gia phòng"**
3. Chờ admin bắt đầu game
4. Chọn đáp án và click **"Xác nhận lựa chọn"**
5. Chờ admin chuyển sang câu hỏi tiếp theo

### Single Player:

1. Truy cập `http://localhost:3000/index_single.html`
2. Click **"Bắt đầu chơi"**
3. Chọn lựa chọn cho 3 giai đoạn
4. Xem kết quả và bài học

## 🛠 Công nghệ sử dụng

### Backend:
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - Realtime communication

### Frontend:
- **HTML5** - Markup
- **CSS3** - Styling với gradients và animations
- **JavaScript (ES6+)** - Client-side logic
- **Socket.io Client** - Realtime connection

### Giao diện:
- Responsive design
- Gradient backgrounds
- Smooth animations
- Card-based layouts
- Modern UI/UX

## 📊 Game Logic

Game có 3 giai đoạn chính:

1. **Giai đoạn 1**: Điều chỉnh giá cả (3 lựa chọn)
2. **Giai đoạn 2**: Điều chỉnh tiền lương (3 lựa chọn, branch dựa trên giai đoạn 1)
3. **Giai đoạn 3**: Chính sách tiền tệ (3 lựa chọn, branch dựa trên giai đoạn 1+2)

Tổng cộng: **3 × 3 × 3 = 27 kịch bản** khác nhau.

## 🔧 Cấu hình

Bạn có thể thay đổi port trong `server.js`:

```javascript
const PORT = process.env.PORT || 3000;
```

Hoặc set biến môi trường:
```bash
PORT=4000 npm start
```

## 📝 Ghi chú

- Game được xây dựng dựa trên sự kiện lịch sử Việt Nam năm 1985
- Admin có toàn quyền điều khiển game flow
- Người chơi không thể bỏ qua hoặc thay đổi câu trả lời
- Kết nối realtime yêu cầu internet ổn định

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

ISC

## 👥 Tác giả

VNR Team 5

