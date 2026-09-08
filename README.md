# EduCareLink — Tài liệu dự án

Repository lưu trữ tài liệu đặc tả sản phẩm **EduCareLink** — nền tảng kết nối Phụ huynh với Sinh viên (CarePartner) cho 3 loại công việc: **Gia sư · Trông trẻ · Đón trẻ**.

## Tài liệu chính

| File | Mô tả | Đối tượng |
|------|-------|-----------|
| [docs/EduCareLink_HeThongGhepNoi.docx](docs/EduCareLink_HeThongGhepNoi.docx) | **Tài liệu đặc tả hệ thống ghép nối** (đầy đủ, có bảng biểu) | Khách hàng · Dev · QA · Team members |

## Nội dung tài liệu

Tài liệu gồm **8 phần + phụ lục**, cô đọng từ bản mô tả chi tiết:

1. **Tổng quan điều hành** — 3 giá trị cốt lõi, điểm khác biệt
2. **Kiến trúc tổng thể** — Stack công nghệ, 12 quy tắc nghiệp vụ
3. **Luồng Phụ huynh** — 3 form đăng việc, AI parsing, danh sách 8 ứng viên
4. **Luồng Sinh viên** — Khai báo lịch rảnh, Hidden ELO (6 bậc), thưởng/phạt
5. **Bộ máy ghép nối** — 7 bước lọc cứng, 7 yếu tố chấm điểm
6. **Xử lý sự cố** — Bậc phạt T0-T6, credit đền bù, auto-replacement
7. **Giới hạn MVP và lộ trình** — 5 điều cố ý chưa làm + Phase 2
8. **Checklist kiểm thử (QA)** — 20+ test cases theo module
9. **Phụ lục** — Trạng thái đơn, 17 assertion nghiệp vụ

## Cách tải

Clone repo về và mở file `.docx` bằng Microsoft Word, LibreOffice hoặc Google Docs:

    git clone https://github.com/huyhandsome6996/b1.git
    cd b1/docs
    # Mở EduCareLink_HeThongGhepNoi.docx

Hoặc bấm trực tiếp vào link file ở trên để tải về.

## Repo chính (source code)

- Backend + Mobile + Admin web: https://github.com/huyhandsome6996/educarelink-backend-4-12-2026
- Branch Flow 1 (đã merge): `main`

## Phiên bản

- **v1.0** — Tháng 9/2026 — Bản đầu tiên, mô tả đầy đủ MVP cho cuộc thi khởi nghiệp

## Đóng góp

Mọi chỉnh sửa xin gửi qua Pull Request hoặc Issue.
