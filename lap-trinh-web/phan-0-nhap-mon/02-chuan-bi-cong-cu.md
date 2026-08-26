# Bài 0.2 — Chuẩn bị "bộ đồ nghề" lập trình web

Bạn chỉ cần đúng 3 thứ: **trình soạn thảo code VS Code**, **trình duyệt Chrome/Edge**, và extension **Live Server**. Toàn bộ miễn phí.

## 1. Cài đặt Visual Studio Code

1. Vào trang `code.visualstudio.com` → tải bản Windows.
2. Cài như phần mềm bình thường. Nhớ tick chọn:
   - ✅ *Add "Open with Code" action to directory context menu* — để chuột phải vào thư mục là mở được VS Code.
3. Giao diện lần đầu mở:

```
┌────────────────────────────────────────────────┐
│ ▓ thanh bên trái        khu vực soạn code      │
│   - Explorer (mở file)                        │
│   - Search            ┌─────────────────────┐ │
│   - Source Control    │ tab các file đang   │ │
│   - Extensions        │ mở                  │ │
│                       ├─────────────────────┤ │
│                       │ nội dung file       │ │
│                       ├─────────────────────┤ │
│                       │ TERMINAL (gõ lệnh)  │ │
└────────────────────────────────────────────────┘
```

**Phím tắt sống còn** (Windows):

| Phím | Chức năng |
|---|---|
| `Ctrl + S` | Lưu file (QUAN TRỌNG NHẤT — không lưu là trình duyệt không thấy thay đổi) |
| `Ctrl + /` | Bật/tắt dòng comment |
| `Ctrl + Z` | Hoàn tác |
| `Alt + ↑/↓` | Kéo nguyên dòng lên/xuống |
| `Ctrl + D` | Chọn từ giống nhau tiếp theo (đổi tên nhanh hàng loạt) |
| `!` + `Tab` | Sinh khung HTML chuẩn (gõ trong file .html) |

## 2. Cài 3 extension bắt buộc

Bấm icon ô vuông ở thanh trái (Extensions), gõ tên, bấm Install:

| Extension | Tác dụng |
|---|---|
| **Live Server** | Mở website local có tự refresh khi bạn lưu file |
| **Prettier - Code formatter** | Tự sắp xếp code gọn đẹp khi lưu (`Shift+Alt+F`) |
| **Auto Rename Tag** | Sửa thẻ mở thì thẻ đóng tự sửa theo |

Cấu hình Live Server tự lưu: `File → Auto Save` bật lên một lần là xong.

## 3. Tạo dự án đầu tiên

Thói quen tốt ngay từ đầu — mỗi bài tập/đồ án một thư mục, cấu trúc chuẩn như sau:

```
buoi-1/
├── index.html      ← trang chủ (LUÔN đặt tên này)
├── css/
│   └── style.css   ← toàn bộ mã CSS
├── js/
│   └── script.js   ← toàn bộ mã JavaScript
└── images/         ← ảnh của trang
```

Các bước chạy thử:

1. Chuột phải vào thư mục `buoi-1` → **Open with Code**.
2. Tạo file `index.html`, gõ dấu `!` rồi nhấn `Tab` → có sẵn khung HTML.
3. Sửa dòng trong `<body>` thành `<h1>Xin chào web!</h1>`, lưu `Ctrl+S`.
4. Chuột phải vào vùng code → **Open with Live Server** → trình duyệt mở địa chỉ dạng `127.0.0.1:5500`.
5. Giờ mỗi lần bạn `Ctrl+S`, trình duyệt **tự refresh** — đây là vòng lặp code − save − xem mà bạn sẽ lặp lại hàng nghìn lần.

## 4. DevTools — dụng cụ khám phá của trình duyệt

Nhấn **F12** (hoặc chuột phải → Inspect) trên bất kỳ trang web nào để mở DevTools:

| Tab | Làm gì được |
|---|---|
| **Elements** | Xem/sửa trực tiếp HTML-CSS của trang (sửa ở đây chỉ thay đổi tạm trên máy bạn, không đụng server) |
| **Console** | Nơi in thông báo bằng `console.log()`, nơi báo lỗi JavaScript màu đỏ |
| **Network** | Xem trang đã tải những file nào, nặng bao nhiêu |
| **Device toolbar** (icon điện thoại, `Ctrl+Shift+M`) | Giả sử màn hình điện thoại để test responsive |

Ví dụ nghỉ tay vui vẻ: mở trang bất kỳ, trong Console gõ `document.body.style.filter = "grayscale(1)"` rồi Enter — cả trang đổi ảnh xám. Xong gõ lại với `filter = "none"` để trả về.

## 5. Quy tắc đặt tên file/thư mục

- Chỉ dùng **chữ thường không dấu**, số, gạch ngang `-`: `trang-chu.html`, `images`, `san-pham`.
- KHÔNG dùng khoảng trắng hay dấu tiếng Việt: `bai tap moi.html` gây lỗi đường dẫn rất khó hiểu cho người mới.
- Trang chủ LUÔN là `index.html`.

## Checklist trước khi sang bài HTML

- [ ] Cài xong VS Code + Live Server
- [ ] Tạo được thư mục dự án, mở bằng VS Code
- [ ] Dùng `!` + Tab tạo khung HTML, chạy qua Live Server thành công
- [ ] Biết mở F12 và tìm tab Elements / Console
