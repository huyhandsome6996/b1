# Bài 0.1 — Website hoạt động như thế nào? (đọc trước khi gõ dòng code đầu tiên)

## 1. Internet và Web khác nhau thế nào?

- **Internet** là hệ thống mạng toàn cầu nối hàng tỷ máy tính với nhau — như hệ thống đường bộ của cả thế giới.
- **Web (WWW)** là một dịch vụ chạy TRÊN internet: hàng tỷ trang tài liệu (web page) liên kết với nhau — như các xe buýt chạy trên con đường đó.

Một thiết bị nối mạng nhưng không dùng web vẫn được: chơi game online, gọi Zalo... đều là dịch vụ khác nhau trên cùng mạng internet.

## 2. Client – Server: hai nhân vật chính

Khi bạn gõ `google.com` và nhấn Enter, câu chuyện sau xảy ra trong chưa đầy 1 giây:

```
[Bạn - CLIENT]                        [Máy chủ GOOGLE - SERVER]
Gõ địa chỉ, nhấn Enter
      │
      │──── YÊU CẦU (request) ───────▶ Nhận yêu cầu,
      │                                 tìm/lấy nội dung,
      │◀─── PHẢN HỒI (response) ────── gửi về file HTML/CSS/JS + ảnh
      │
Trình duyệt "ghép" các file
thành trang web bạn nhìn thấy
```

- **Client (máy khách)** = máy tính/điện thoại của bạn + trình duyệt. Nhiệm vụ: gửi yêu cầu và hiển thị kết quả.
- **Server (máy chủ)** = một máy tính luôn bật, chứa website. Nhiệm vụ: lắng nghe và trả lời yêu cầu.
- **Request/response** = kiểu trò chuyện hỏi – đáp. Mỗi lần bạn bấm link hay submit form là một cặp hỏi – đáp mới.

> Ví dụ đời thường: bạn (client) gọi quán milk tea (server), nói món cần (request), quán pha xong giao cho bạn (response). Quán không thể tự giao nếu bạn chưa gọi.

## 3. Ba ngôn ngữ tạo nên mọi website

| Ngôn ngữ | Vai trò | Giống như |
|---|---|---|
| **HTML** | Tạo NỘI DUNG và CẤU TRÚC (chữ, ảnh, nút bấm...) | Khung xương của con người |
| **CSS** | Trang trí: màu sắc, kích thước, vị trí, hiệu ứng | Quần áo, make-up, phong cách ăn mặc |
| **JavaScript** | Làm cho trang PHẢN ỨNG: bấm nút đổi nội dung, kiểm tra form, tính toán... | Các hành động: đi, nhảy, nói |

Cùng một nội dung, ba tầng khác nhau:

```html
<!-- HTML: nói CÓ GÌ -->
<h1>Xin chào!</h1>
<button>Nhấn tôi</button>
```

```css
/* CSS: nói TRÔNG THẾ NÀO */
h1 { color: red; }
button { background: green; }
```

```javascript
// JS: nói LÀM GÌ KHI BẤM
button.onclick = function () { alert("Bạn vừa bấm nút!"); };
```

**Quy tắc sắt:** HTML quyết định nội dung. CSS chỉ nên trang trí. JS chỉ nên xử lý hành vi. Đây cũng là tiêu chí chấm đồ án: Code sạch nghĩa là chia 3 file riêng biệt.

## 4. Front-end, Back-end là gì?

- **Front-end (phía người dùng):** phần chạy NGAY TRONG TRÌNH DUYỆT của người xem, gồm HTML + CSS + JavaScript. Môn này của bạn học front-end.
- **Back-end (phía máy chủ):** phần chạy trên server — đăng nhập, lưu database, thanh toán... viết bằng PHP, Node.js, Python...
- **Full-stack:** người làm cả hai phía. Bạn sau này sẽ tiến dần tới đó.

Đồ án cuối kỳ môn này thường chỉ cần front-end thuần: nhiều trang tĩnh hoặc một trang có tương tác JS — vì vậy học tốt HTML/CSS/JS là đủ để điểm cao.

## 5. URL — địa chỉ của website

```
https://fpt.edu.vn/sinhvien/hocphi.html
└─┬──┘ └──┬────────┘└───────┬────────┘
giao thức   tên miền        đường dẫn tới file
(https =    (địa chỉ của    (file nằm ở thư mục nào
 có mã hóa) server)         trên server)
```

- `http://` và `https://`: quy tắc giao tiếp. Có chữ **s** nghĩa là encrypted (mã hóa) — an toàn hơn, mọi site hiện đại đều dùng https.
- Nếu không ghi tên file (`.../sinhvien/`) thì server tự trả về file mặc định tên **index.html** — lý do file chính của bạn LUÔN phải đặt tên `index.html`.

## 6. File HTML sống ở đâu?

Ba trường hợp bạn sẽ gặp:

1. **Mở file trực tiếp:** double-click `index.html` → trình duyệt đọc file từ ổ đĩa. Đủ dùng khi học, thiếu một vài tính năng (sẽ gặp ở bài AJAX sau này).
2. **Local server (khuyên dùng khi code):** Live Server trong VS Code giả lập một server nhỏ trên máy bạn — tự refresh khi lưu file.
3. **Hosting thật:** đẩy code lên GitHub Pages / Netlify / Vercel → cả thế giới truy cập được. Cuối kỳ đẩy đồ án lên đây để demo cho giảng viên rất ấn tượng.

## 7. Tóm tắt cần nhớ

- Mở web = client gửi request → server trả response → trình duyệt ghép HTML + CSS + JS hiển thị.
- HTML = nội dung, CSS = giao diện, JS = hành vi. Ba lớp tách bạch.
- Front-end chạy trên máy người dùng; môn này học front-end.
- File trang chủ đặt tên `index.html`.

**Câu hỏi tự kiểm tra:** (trả lời được hết mới sang bài sau)
1. Client và server ai gửi request, ai gửi response?
2. Muốn đổi màu chữ tiêu đề thì sửa bằng ngôn ngữ nào?
3. Vì sao file trang chủ phải tên `index.html`?
