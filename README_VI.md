# Quiz Game - Hướng Dẫn Sử Dụng

## 🎮 Hệ thống Quiz Game Multiplayer Realtime

Hệ thống quiz game tương tác với tính năng multiplayer realtime, cho phép admin tạo phòng và chia sẻ với người chơi để cùng làm bài quiz.

## 🚀 Cách chạy

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Khởi động server
```bash
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

## 📖 Hướng dẫn sử dụng

### 1️⃣ Cho Admin/Host

1. Truy cập **http://localhost:3000** và chọn **"Admin / Host"**
2. Click **"Tạo phòng mới"** → Hệ thống tạo mã phòng ngẫu nhiên
3. **Copy link** hoặc mã phòng và **chia sẻ** cho người chơi
4. Khi có người chơi, click **"Bắt đầu game"**
5. Click **"Câu hỏi tiếp theo"** để chuyển sang giai đoạn tiếp theo
6. Xem tiến trình: **"Xem tiến trình"**

### 2️⃣ Cho Người chơi

1. Nhận link từ admin (ví dụ: `http://localhost:3000/player.html?room=ROOM-ABC123`)
2. Nhập **tên** của bạn
3. Click **"Tham gia phòng"**
4. Chờ admin bắt đầu game
5. Đọc câu hỏi và chọn đáp án
6. Click **"Xác nhận lựa chọn"**
7. Chờ admin chuyển câu tiếp theo

### 3️⃣ Single Player (Game gốc)

1. Truy cập **http://localhost:3000/index_single.html**
2. Click **"Bắt đầu chơi"**
3. Chọn lựa chọn cho 3 giai đoạn
4. Xem kết quả và bài học

## 📁 Cấu trúc file

```
├── server.js              # Backend với Socket.io
├── package.json           # Dependencies
├── index.html             # Trang chủ
├── admin.html/js          # Trang Admin
├── player.html/js         # Trang Player
├── index_single.html      # Game single player
├── game.js                # Logic game gốc
└── styles.css             # CSS chung
```

## 🎯 Game Logic

- **3 giai đoạn**: Giá cả → Tiền lương → Tiền tệ
- **Nhánh động**: Mỗi câu trả lời ảnh hưởng đến câu sau
- **27 kịch bản**: 3 × 3 × 3 kết quả khác nhau

## 🛠 Công nghệ

- **Backend**: Node.js + Express + Socket.io
- **Frontend**: HTML5 + CSS3 + JavaScript
- **Realtime**: Socket.io cho đồng bộ tức thời

## 📊 Tính năng

### Admin
✅ Tạo phòng, chia sẻ link  
✅ Theo dõi tất cả người chơi  
✅ Xem lựa chọn realtime  
✅ Điều khiển flow game  
✅ Thống kê tiến trình  

### Player
✅ Tham gia bằng link/mã phòng  
✅ Giao diện quiz thân thiện  
✅ Nhận câu hỏi realtime  
✅ Branch logic tự động  

## 🎨 Giao diện

- Gradient backgrounds đẹp mắt
- Animations mượt mà
- Responsive design
- Card-based layouts
- Modern UI/UX

## ⚙️ Cấu hình

Thay đổi port trong `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

Hoặc:
```bash
PORT=4000 npm start
```

## 🔧 Troubleshooting

**Server không chạy?**
- Kiểm tra port 3000 đã được sử dụng chưa
- Chạy `npm install` lại
- Xóa `node_modules` và install lại

**Người chơi không kết nối được?**
- Admin phải tạo phòng trước
- Kiểm tra internet ổn định
- Refresh trang

**Lỗi Socket.io?**
- Đảm bảo server đang chạy
- Clear cache browser
- Kiểm tra firewall

## 💡 Tips

- Admin nên đợi có ít nhất 2-3 người chơi trước khi bắt đầu
- Người chơi nên chọn đáp án kỹ càng vì không thể sửa
- Có thể chơi test với 2 tab browser: 1 admin + 1 player

## 📝 License

ISC

## 👥 Team

VNR Team 5

---

**Chúc bạn chơi game vui vẻ! 🎮✨**

