# EduCareLink — Tài liệu dự án / Project Documentation

Repository lưu trữ tài liệu đặc tả sản phẩm **EduCareLink** — nền tảng kết nối Phụ huynh với Sinh viên (CarePartner) cho 3 loại công việc: **Gia sư · Trông trẻ · Đón trẻ**.

*This repository holds the product & technical specification for **EduCareLink** — a platform connecting Parents with student CarePartners for three job types: **Tutoring · Childcare · Pickup**.*

---

## 📚 Tài liệu / Documents

| File | Ngôn ngữ / Language | Định dạng / Format | Đối tượng / Audience |
|------|---------------------|--------------------|----------------------|
| [docs/EduCareLink_HeThongGhepNoi.docx](docs/EduCareLink_HeThongGhepNoi.docx) | 🇻🇳 Tiếng Việt | Word (.docx) | Khách hàng · Dev · QA · Team members |
| [docs/EduCareLink_Matching_System_EN.md](docs/EduCareLink_Matching_System_EN.md) | 🇬🇧 English | Markdown (.md) | Customers · Devs · QA · Judges |

> Hai bản có nội dung tương đương. Bản Markdown tiếng Anh có thêm **Appendix C — Key Numbers & Glossary** (bảng tra nhanh toàn bộ con số cấu hình + thuật ngữ).
>
> *Both editions are equivalent in content. The English Markdown edition additionally includes **Appendix C — Key Numbers & Glossary** (a quick-reference table of every configurable number plus terminology).*

---

## 📖 Nội dung tài liệu / Document Contents

Tài liệu gồm **10 phần + 3 phụ lục** / *The document has **10 parts + 3 appendices**:*

| # | Phần / Part | Nội dung chính / Key content |
|---|-------------|------------------------------|
| 1 | Tổng quan điều hành / Executive Overview | 3 giá trị cốt lõi, điểm khác biệt so với app tìm việc thường |
| 2 | Kiến trúc & quy tắc bất biến / Architecture & Non-Negotiable Rules | Stack công nghệ, 12 quy tắc nghiệp vụ, 3 con số vàng |
| 3 | Luồng Phụ huynh / The Parent Journey | 3 form đăng việc, AI parsing (Gemini), danh sách tối đa 8 ứng viên, auto-commit |
| 4 | Luồng Sinh viên / The CarePartner Journey | Khai báo lịch rảnh, 3 quy tắc sửa lịch, Hidden ELO (6 bậc), thưởng/phạt, decay, probation, kháng cáo |
| 5 | Bộ máy ghép nối / The Matching Engine | 7 bước lọc cứng, 7 yếu tố chấm điểm có trọng số, tie-break, hiệu năng |
| 6 | Xử lý sự cố / Failure Handling | Commitment window, bậc phạt T0–T6, credit đền bù, no-show, auto-replacement, chống trùng lịch, buffer 90 phút |
| 7 | Thông báo & âm thanh / Notifications & Sound | 3 lớp thông báo, yêu cầu tiếng kêu to trên Android, giới hạn iOS |
| 8 | Giao diện người dùng / User-Facing Surfaces | 12 màn hình mobile, 11 trang web, 6 màn hình admin |
| 9 | Giới hạn MVP & lộ trình / MVP Limitations & Roadmap | 5 điều cố ý chưa làm + yêu cầu Phase 2 |
| 10 | Checklist kiểm thử / QA Test Checklist | 70+ test cases theo 12 module |
| A | Phụ lục A / Appendix A | State machines: 13 trạng thái Job Post + 16 trạng thái Booking |
| B | Phụ lục B / Appendix B | 17 assertion nghiệp vụ (`g13_business_rules.py`) |
| C | Phụ lục C / Appendix C | Bảng tra nhanh toàn bộ con số + Glossary thuật ngữ |

---

## 🔑 Ba con số cần nhớ / Three Numbers to Memorise

| Số / Number | Ý nghĩa / Meaning |
|-------------|-------------------|
| **8** | Số ứng viên tối đa hiển thị cho phụ huynh / Hard cap on candidates shown to a parent |
| **90** | Số phút nghỉ tối thiểu giữa 2 đơn liên tiếp / Minimum rest gap (minutes) between consecutive jobs |
| **1200** | Điểm tín nhiệm khởi đầu của sinh viên mới / Starting hidden trust score for every new CarePartner |

---

## 💡 Triết lý thiết kế / Design Philosophy

> **Người tử tế được ưu tiên. Người bùng kèo bị loại dần. Nhưng luôn luôn có đường để quay lại.**
>
> *The trustworthy are promoted. The flaky are filtered out. But there is always a way back.*

---

## ⬇️ Cách tải / How to Download

**Bản Word (.docx):** mở bằng Microsoft Word, LibreOffice hoặc Google Docs
*Word edition: open with Microsoft Word, LibreOffice or Google Docs*

    git clone https://github.com/huyhandsome6996/b1.git
    cd b1/docs

**Bản Markdown (.md):** đọc trực tiếp trên GitHub (link ở trên), hoặc mở bằng bất kỳ editor nào
*Markdown edition: read directly on GitHub via the link above, or open in any editor*

---

## 🔗 Repo chính (source code) / Main Repository

- Backend + Mobile + Admin web: https://github.com/huyhandsome6996/educarelink-backend-4-12-2026
- Branch đặc tả kỹ thuật chi tiết / Detailed technical spec branch: `docs/agent-spec/*.md` (16 files)

---

## 🏷️ Phiên bản / Version

- **v1.0** — Tháng 9/2026 — Bản đầu tiên (tiếng Việt, .docx), mô tả đầy đủ MVP cho cuộc thi khởi nghiệp
- **v1.1** — Tháng 9/2026 — Thêm bản tiếng Anh (.md) + Appendix C (Key Numbers & Glossary)

## 🤝 Đóng góp / Contributing

Mọi chỉnh sửa xin gửi qua Pull Request hoặc Issue. / *Please submit changes via Pull Request or Issue.*
