/* ============================================================
   JAVASCRIPT CỦA DỰ ÁN MẪU - 5 tính năng, mỗi tính năng một khối
   1. Dark mode (lưu localStorage)
   2. Menu hamburger mobile
   3. Render danh sách dự án từ mảng object
   4. Bộ lọc dự án theo chuyên mục
   5. Validate form liên hệ
   Mọi khối đều dùng công thức: chọn phần tử -> nghe sự kiện -> đổi DOM.
   ============================================================ */

"use strict"; // chế độ nghiêm ngặt: bắt lỗi careless từ đầu

/* ============================================================
   TÍNH NĂNG 1: DARK MODE + NHỚ LỰA CHỌN BẰNG LOCALSTORAGE
   localStorage = hầm chứa dữ liệu nhỏ của trình duyệt, còn sống
   sau khi tắt tab. Chỉ nhận chuỗi: lưu bằng setItem, đọc getItem.
   ============================================================ */
const nutTheme = document.getElementById("nut-theme");
const iconTheme = nutTheme.querySelector("i");

function apDungTheme(batToi) {
  document.body.classList.toggle("theme-toi", batToi);
  // đổi icon mặt trăng <-> mặt trời
  iconTheme.className = batToi ? "fa-solid fa-sun" : "fa-solid fa-moon";
}

// khi vừa mở trang: đọc lựa chọn lần trước (chuỗi "1" nghĩa là tối)
apDungTheme(localStorage.getItem("theme") === "toi");

nutTheme.addEventListener("click", function () {
  const dangToi = document.body.classList.contains("theme-toi");
  apDungTheme(!dangToi);                              // lật ngược lại
  localStorage.setItem("theme", !dangToi ? "toi" : "sang");
});

/* ============================================================
   TÍNH NĂNG 2: MENU HAMBURGER (chỉ có tác dụng trên màn nhỏ)
   CSS đã viết sẵn body.mo-menu .menu { max-height:300px } -
   JS chỉ cần bật/tắt class như đóng công tắc đèn.
   ============================================================ */
document.getElementById("nut-menu-mobile")
  .addEventListener("click", () => document.body.classList.toggle("mo-menu"));

// bấm vào mục menu thì tự đóng menu cho người dùng khỏi phải bấm X
document.querySelectorAll(".menu a").forEach(link =>
  link.addEventListener("click", () => document.body.classList.remove("mo-menu"))
);

/* ============================================================
   TÍNH NĂNG 3: RENDER DỰ ÁN TỪ MẢNG OBJECT
   Dữ liệu sản phẩm/dự án luôn viết dạng mảng chứa object -
   đây là cấu trúc bạn sẽ thấy ở mọi API/backend sau này.
   Muốn thêm dự án mới? Chỉ việc push thêm object vào dưới đây,
   KHÔNG cần đụng HTML -> đúng tinh thần data-driven.
   ============================================================ */
const duAnCuaToi = [
  {
    ten: "Website giới thiệu bản thân",
    moTa: "Trang portfolio cá nhân với hero, kỹ năng và form liên hệ - chính website bạn đang xem.",
    anh: "https://placehold.co/600x340/2563eb/fff?text=Portfolio",
    theLoai: "web",
    tagChu: "HTML/CSS"
  },
  {
    ten: "Máy tính đơn giản",
    moTa: "Nhập hai số cộng trừ nhân chia, validate chia cho không - mini app luyện DOM.",
    anh: "https://placehold.co/600x340/16a34a/fff?text=May+tinh",
    theLoai: "cong-cu",
    tagChu: "JavaScript"
  },
  {
    ten: "Trò chơi đoán số",
    moTa: "Random số bí mật, gợi ý cao/thấp, đếm số lượt đoán - luyện if else và sự kiện.",
    anh: "https://placehold.co/600x340/dc2626/fff?text=Game+doan+so",
    theLoai: "game",
    tagChu: "Logic"
  },
  {
    ten: "Bộ đếm số đẹp",
    moTa: "Tăng/giảm/reset có giới hạn và thông báo cảnh báo - app DOM đầu tiên của mọi dev.",
    anh: "https://placehold.co/600x340/f59e0b/fff?text=Bo+dem",
    theLoai: "cong-cu",
    tagChu: "DOM"
  },
  {
    ten: "Landing page quán cà phê",
    moTa: "Menu đồ uống render từ mảng, tìm kiếm nhanh theo tên - ý tưởng đồ án số 2.",
    anh: "https://placehold.co/600x340/9333ea/fff?text=Cafe+page",
    theLoai: "web",
    tagChu: "Flexbox"
  }
];

const luoiDuAn = document.getElementById("luoi-du-an");

function renderDuAn(danhSach) {
  luoiDuAn.innerHTML = "";                 // xoá sạch trước khi vẽ (bài 3.4)
  for (const duAn of danhSach) {
    // nặn thẻ card bằng template literal - gọn hơn createElement khi cấu trúc lớn
    luoiDuAn.insertAdjacentHTML("beforeend", `
      <article class="the-du-an">
        <img src="${duAn.anh}" alt="Ảnh dự án ${duAn.ten}">
        <div class="noi-dung-card">
          <span class="tag">${duAn.tagChu}</span>
          <h3>${duAn.ten}</h3>
          <p>${duAn.moTa}</p>
        </div>
      </article>
    `);
  }
}
renderDuAn(duAnCuaToi);

/* ============================================================
   TÍNH NĂNG 4: BỘ LỌC THEO THỂ LOẠI
   Nhớ giá trị data-loc trên từng nút; so sánh với theLoai.
   Dùng filter() để lấy mảng con rồi render lại - dữ liệu gốc
   không bao giờ bị sửa đổi.
   ============================================================ */
const cacNutLoc = document.querySelectorAll(".nut-loc");

cacNutLoc.forEach(nut => {
  nut.addEventListener("click", function () {

    // cập nhật trạng thái "đang chọn" cho các nút
    document.querySelector(".nut-loc.dang-chon").classList.remove("dang-chon");
    this.classList.add("dang-chon");

    const luaChon = this.dataset.loc;     // đọc thuộc tính data-loc

    const ketQua = luaChon === "tat-ca"
      ? duAnCuaToi                         // giữ nguyên
      : duAnCuaToi.filter(d => d.theLoai === luaChon);

    renderDuAn(ketQua);
  });
});

/* ============================================================
   TÍNH NĂNG 5: VALIDATE FORM LIÊN HỆ
   Quy trình chuẩn bài 3.4:
   preventDefault -> đọc value -> kiểm tra -> báo lỗi hoặc chúc mừng
   Mỗi ô nhập đi qua một hàm kiểm tra riêng, trả về chuỗi lỗi hoặc "".
   ============================================================ */
const form = document.getElementById("form-lien-he");

function kiemTraTen(giaTri) {
  return giaTri.trim().length >= 2 ? "" : "Họ tên cần ít nhất 2 ký tự.";
}

function kiemTraEmail(giaTri) {
  // regex đơn giản chuẩn hình chữ u: a@b.c
  const dungDinhDang = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(giaTri.trim());
  return dungDinhDang ? "" : "Email chưa đúng định dạng ten@ten-cong-ty.com.";
}

function kiemTraTinNhan(giaTri) {
  return giaTri.trim().length >= 10 ? "" : "Nội dung cần ít nhất 10 ký tự.";
}

function baoLoi(oNhap, thongDiep) {
  const hopCha = oNhap.closest(".o-nhap");           // tìm div bọc ngoài
  const vungLoi = hopCha.querySelector(".bao-loi");
  hopCha.classList.toggle("sai", thongDiep !== "");  // viền đỏ nếu sai
  vungLoi.textContent = thongDiep;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();                                  // CHẶN reload trang!

  const oTen    = form.elements["ten"];
  const oEmail  = form.elements["email"];
  const oTinNhan= form.elements["tinNhan"];

  let hopLe = true;

  const loiTen = kiemTraTen(oTen.value);
  baoLoi(oTen, loiTen);
  if (loiTen) hopLe = false;

  const loiEmail = kiemTraEmail(oEmail.value);
  baoLoi(oEmail, loiEmail);
  if (loiEmail) hopLe = false;

  const loiTinNhan = kiemTraTinNhan(oTinNhan.value);
  baoLoi(oTinNhan, loiTinNhan);
  if (loiTinNhan) hopLe = false;

  const bangThongBao = document.getElementById("thong-bao-chung");

  if (!hopLe) {
    bangThongBao.textContent = "";
    return;
  }

  // Giả lập gửi thành công (đồ án thật có thể mở mailto: hoặc gửi lên API)
  console.log("Dữ liệu sẽ gửi:", { ten: oTen.value, email: oEmail.value, tinNhan: oTinNhan.value });

  bangThongBao.textContent =
    `Cảm ơn ${oTen.value.trim()}! Tin nhắn của bạn đã được ghi nhận.`;
  bangThongBao.classList.add("thanh-cong");

  form.reset();                                        // xoá trắng form
});

/* Ghi chú mở rộng cho đồ án của BẠN sau này:
   - Thêm danh sách thật: chỉ cần edit mảng duAnCuaToi.
   - Muốn modal chi tiết sản phẩm? addEventListener click vào card,
     mở overlay fixed (bài 2.3 position).
   - Muốn giỏ hàng đếm số? biến demSoLuong + badge đỏ (bài 2.3 ví dụ badge). */
