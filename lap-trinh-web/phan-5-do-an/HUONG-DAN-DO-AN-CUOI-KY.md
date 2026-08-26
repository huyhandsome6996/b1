# HƯỚNG DẪN ĐỒ ÁN CUỐI KỲ — Lập trình Web (HTML · CSS · JS)

Tài liệu này là bản đồ trọn vẹn từ chọn đề tài đến ngày nộp. Kèm theo `du-an-mau/` là một website hoàn chỉnh đã có đủ mọi thành phần để bạn mở ra chạy và bắt chước cấu trúc.

## 1. Giảng viên thường chấm gì?

Đồ án front-end cơ bản hầu như luôn chấm theo các nhóm tiêu chí dưới đây (đối chiếu với bảng điểm lớp của bạn):

| Tiêu chí | Trọng lượng thường thấy | Nghĩa là phải làm gì |
|---|---|---|
| **Hoàn thiện chức năng** | cao | Mọi nút bấm/form đều hoạt động thật, không có chỗ "vẽ vời chết" |
| **Giao diện - thẩm mỹ** | cao | Bố cục rõ, màu hài hòa, ảnh đẹp, khoảng trắng thoáng |
| **HTML ngữ nghĩa + code sạch** | trung bình | header/nav/main/footer; CSS tách file; đặt tên class hợp lý; có comment |
| **Responsive** | trung bình | Xem tốt desktop lẫn điện thoại |
| **JavaScript tương tác** | trung bình-cao | Ít nhất 2–3 tính năng JS thật sự xử lý dữ liệu |
| **Báo cáo + thuyết trình** | thấp-nhưng-easy-point | Có file báo cáo, demo mượt |

**Suy luận chiến lược:** người chấm mở đồ án của bạn trong ~5 phút. Vì vậy hãy đầu tư phần nhìn thấy được (trang chủ, card sản phẩm, hiệu ứng hover, dark mode) trước khi đào sâu logic phức tạp.

## 2. Chọn đề tài — 6 ý tưởng theo mức khó tăng dần

| # | Ý tưởng | Tính năng gợi ý | Mức khó |
|---|---|---|---|
| 1 | Website giới thiệu bản thân / portfolio | profile, kỹ năng, dự án, form liên hệ validate | Dễ (mẫu sẵn trong `du-an-mau/`) |
| 2 | Trang cửa hàng/quán cà phê static | menu render từ mảng, giỏ hàng đếm số, tìm kiếm lọc | Dễ-trung bình |
| 3 | To-do list nâng cao | thêm/sửa/xoá/tìm kiếm, lưu localStorage, đếm hoàn thành | Trung bình |
| 4 | Quản lý chi tiêu cá nhân | nhập khoản thu/chi, tổng tự tính, lọc theo tháng, biểu đồ đơn giản | Trung bình |
| 5 | Trang tin tức/blog tĩnh | bài viết render từ mảng object, tìm theo tiêu đề, dark mode | Trung bình |
| 6 | Mini game (câu đố, đoán chữ, flashcard từ vựng) | nhiều màn chơi, tính điểm, lưu kỷ lục | Cần tư duy logic tốt |

Chọn nguyên tắc: **nhỏ mà chạy ngon > khủng mà nửa chừng.** Một app 5 trang tính năng đủ mượt ăn điểm hơn bộ "amazon clone" lỗi loạn.

## 3. Cấu trúc thư mục chuẩn nộp

```
ten-do-an/
├── index.html            ← trang chủ
├── san-pham.html         ← các trang phụ (tùy số trang đề yêu cầu)
├── lien-he.html
├── css/
│   └── style.css         ← nếu nhiều trang dùng chung thì tách style.css + responsive.css
├── js/
│   └── main.js           ← tách theo trang nếu lớn: home.js, cart.js...
├── images/
└── README.md             ← mô tả dự án + cách chạy + tên sinh viên
```

Ba phép thuật nhớ kỹ: file chính luôn `index.html`; đường dẫn img dùng relative (`images/x.jpg`); mọi trang nhúng chung 1 `style.css`.

## 4. Lộ trình 4 tuần

### Tuần 1 — Chốt ý tưởng + dựng xương HTML

1. Vẽ phác thảo từng trang trên giấy/bún whiteboard: header có gì, thân chia mấy cột, footer ghi gì. 30 phút giấy tiết kiệm cả tuần code.
2. Tạo thư mục chuẩn mục 3, viết toàn bộ HTML semantic CHƯA cần đẹp.
3. Nội dung viết THẬT ngay từ đầu (không để lorem ipsum qua đêm), vì giờ mới chèn chữ thì cuối kỳ không bỏ hoang deadline chép content.

### Tuần 2 — Mặc quần áo CSS

4. Reset toàn cục + biến màu `:root` (bài 2.4).
5. Dựng layout từng trang bằng flex/grid (bài 2.3): navbar → hero → khối nội dung → footer.
6. Bo tròn card, đổ bóng, transition hover cho sinh động.
7. Cuối tuần test responsive lần đầu bằng DevTools mobile (bài 2.4).

### Tuần 3 — Trồng não JavaScript

8. Tính năng thứ nhất dễ nhất: render danh sách từ mảng object (bài 3.3, 3.4).
9. Tính năng hai: form validate + thông báo (bài 3.4 mục 5).
10. Tính năng ba tạo dấu ấn: dark mode / search filter / giỏ hàng đếm...
11. Kiểm tra Console (F12) SẠCH lỗi đỏ — đây là điều chấm kỹ năng JS họ mở đầu tiên.

### Tuần 4 — Rà soát + báo cáo

12. Fix hết bug, sửa chữ sai chính tả, tối ưu ảnh (nén < vài trăm KB mỗi tấm).
13. Deploy lên GitHub Pages / Netlify để có link demo gửi kèm báo cáo — cộng điểm ấn tượng lớn.
14. Viết báo cáo theo mẫu mục 6, tập demo theo kịch bản mục 7.

## 5. Checklist TRƯỚC KHI NỘP (in ra dán màn hình)

- [ ] Không còn `TODO`, comment code rác, console.log debug sót
- [ ] Mở F12 tab Console: 0 lỗi đỏ khi lướt hết mọi trang
- [ ] Test responsive ở 360px (mobile nhỏ), 768px, 1366px
- [ ] Mọi ảnh có `alt`, mọi link bấm không ra `404`
- [ ] Form không submit được khi thiếu/rỗng dữ liệu
- [ ] Tên file tiếng Việt không dấu, không khoảng trắng
- [ ] README.md có: tên SV, MSSV, cách chạy (mở index.html hoặc Live Server), link deploy, danh sách tính năng

## 6. Mẫu khung báo cáo 3-5 trang

```
TRANG BÌA: Tên trường - môn học - tên đồ án - SV thực hiện - MSSV - lớp - GVHD
1. GIỚI THIỆU   : lý do chọn đề tài, đối tượng người dùng, mục tiêu
2. CÔNG NGHỆ    : HTML5, CSS3, JavaScript ES6 + công cụ (VS Code, Live Server)
                 sơ đồ cấu trúc thư mục + mô tả ngắn từng file
3. PHÂN TÍCH    : liệt kê các trang và chức năng từng trang (bảng)
4. TRIỂN KHAI   : mô tả ngắn giải pháp kỹ thuật nổi bật kèm screenshot từng trang,
                 đoạn code tiêu biểu (render danh sách, validate form...)
5. DEMO & KIỂM THỬ : hướng dẫn trải nghiệm + bảng ca kiểm thử (nhập gì -> mong gì -> được gì)
6. KẾT LUẬN     : đã đạt gì, hạn chế, hướng phát triển (thêm backend, đăng nhập...)
PHỤ LỤC        : link GitHub + link deploy
```

Lưu ý biến thành vàng: mục 5 bảng ca kiểm thử 5-10 dòng nhìn rất "chuyên nghiệp" nhưng chỉ cần bạn tự thử như checklist mục 5 trên.

## 7. Kịch bản demo 5 phút trước mặt giảng viên

1. Mở trang chủ: giới thiệu bố cục, gradient/hero, nhân vật chào hỏi (30s)
2. Toggle dark mode LIVE — wow moment rẻ tiền nhất hành tinh (30s)
3. Lướt danh sách sản phẩm/dự án, hover lên card minh hoạ hiệu ứng (60s)
4. Demo chức năng đắt nhất: thêm vào giỏ/validate form lỗi rồi hợp lệ (90s)
5. Responsive: kéo hẹp cửa sổ cho thấy menu dọc/1 cột (60s)
6. Mở F12 tab Elements chỉ một chỗ bạn biết chắc mình hiểu để trả lời câu hỏi "ở đâu chú thích này?" (30s)

**Mẹo trả lời phản biện:** không biết thì nói thật "Đây là điểm em sẽ bổ sung, hiện tại em xử lý theo cách..." đừng bịa máy móc ma quái — giảng viên nghe phát là lộ.

## 8. 7 lỗi trừ điểm phổ biến nhất

1. Code JS nhét cả trang dài 800 dòng giữa body không comment — tách file + comment theo khối.
2. Giao diện chỉ đẹp trên máy dev, điện thoại vỡ tan — không test responsive sớm.
3. Link ảnh chết khi đổi máy/mở bằng con đường khác — luôn relative path + kiểm tra sau khi zip.
4. Trang "động" giả: button không có listener nào — một cái bấm chết cũng bị soi.
5. Regex/filter regex sao chép không hiểu, bị hỏi tức thì sập — học thuộc được từng dòng code giao nộp.
6. Nộp thiếu file hình/đổi tên file sau khi nén — zip xong phải giải nén ra thử ngay.
7. Trễ deadline vì ôm đồm tính năng mới đêm cuối — đóng băng tính năng từ tuần 3!

## 9. Hành trình tiếp theo sau môn học

Sau khi nộp đồ án thuận lợi, đường đi thẳng tới: Git/GitHub chuyên nghiệp → Sass/TailwindCSS → React hoặc Vue (dựng UI bằng component) → Node.js + database (full-stack) → portfolio cá nhân đầy đủ để xin internship. Bộ tài liệu này chính là phần móng vững chắc nhất để leo tiếp các bậc đó.

---
*File dự án mẫu hoàn chỉnh nằm tại `du-an-mau/index.html` — hãy mở nó là cấu trúc tham chiếu sống động nhất.*
