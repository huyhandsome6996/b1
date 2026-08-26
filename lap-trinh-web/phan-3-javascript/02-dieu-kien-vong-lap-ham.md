# Bài 3.2 — Điều kiện, vòng lặp, hàm

## 1. If / else — rẽ nhánh theo điều kiện

```js
const diem = 8;

if (diem >= 9) {
  console.log("Xuất sắc");
} else if (diem >= 7) {       // else if nối tiếp nhiều tầng thoải mái
  console.log("Giỏi");
} else if (diem >= 5) {
  console.log("Trung bình");
} else {
  console.log("Phải học lại");  // else bắt mọi trường hợp còn lại
}
```

**Bẫy mới nhập môn:** dùng `=` (gán) thay `===` trong điều kiện — luôn ra đúng/n sai mù mờ. Nhớ: điều kiện so sánh luôn là `==`/`===`/`<`/`>`...

### Toán tử ba ngôi — if...else gói trong một dòng

```js
const trangThai = diem >= 5 ? "Đỗ" : "Trượt";
//          ? tên-biến = (điều kiện) ? giá-trị-nếu-đúng : giá-trị-nếu-sai
```

## 2. Switch — chọn nhánh theo đúng giá trị

```js
const thu = new Date().getDay();   // 0=CN, 1=T2...

switch (thu) {
  case 6:
  case 0:                          // hai case dồn vào nhau = OR logic
    console.log("Nghỉ!");
    break;                         // thiếu break là rơi tiếp case sau - bẫy kinh điển!
  default:
    console.log("Ngày học.");
}
```

Khi nào switch, khi nào if? Nhiều nhánh so **bằng chính xác một biến** → switch cho dễ đọc; khoảng giá trị (`>=`) → if.

## 3. Vòng lặp — cho máy làm phần lặp đi lặp lại

```js
// for: biết trước số lần chạy - cấu trúc 3 chấm phẩy
for (let i = 1; i <= 5; i++) {
  console.log(`Lần ${i}`);
}

// while: chưa chắc số lần - chạy đến khi điều kiện sai
let dem = 3;
while (dem > 0) {
  console.log(dem);
  dem--;                        // QUAN TRỌNG: phải có bước đưa về sai, kẻo lặp vô hạn treo máy
}

// break: phá thoát ngay | continue: bỏ qua vòng này sang vòng kế
for (let i = 1; i <= 10; i++) {
  if (i === 4) continue;        // 4 bị hất khỏi danh sách in
  if (i === 8) break;           // gặp 8 thì ngừng cả vòng
  console.log(i);               // in: 1 2 3 5 6 7
}
```

### Bài toán chuẩn thi + dùng trong đồ án: duyệt mảng tìm tốt nhất

```js
const diemSo = [7, 9, 6, 10];
let max = diemSo[0];                       // giả sử đầu tiên lớn nhất
for (let i = 1; i < diemSo.length; i++) {
  if (diemSo[i] > max) max = diemSo[i];    // đổi vô địch khi thấy điểm cao hơn
}
console.log(`Điểm cao nhất: ${max}`);      // 10
```

## 4. Hàm — gói chức năng dùng đi dùng lại

```js
// Khai báo: đặt tên rõ nghề của nó
function tinhDtb(toan, van) {         // toan, van = THAM SỐ - đầu vào biến số
  return (toan + van) / 2;            // return: ném kết quả RA NGOÀI cho ai gọi
}

const kq = tinhDtb(8, 10);            // GỌI với đối số cụ thể -> kq = 9
```

Ba quy tắc cần khắc cốt ghi da:
1. **Không gọi return** thì hàm vẫn chạy nhưng trả về `undefined`.
2. Biến khai bên trong hàm (dùng let/const) chỉ sống bên trong đó.
3. Một việc một hàm — hàm làm gì nhìn tên tự hiểu (`tinhTong`, `kiemTraEmail`), tránh hàm 200 dòng ôm đồm.

### Arrow function — kiểu viết gọn ES6 hiện đại

```js
// function truyền thống
function binhPhuong(x) { return x * x; }

// arrow: nếu body chỉ 1 biểu thức return thì bỏ {} và chữ return
const binhPhuong2 = x => x * x;

const chao = (ten) => `Chào ${ten}!`;   // hay dùng khi lặp qua mảng (bài sau)
chao("An");                              // "Chào An!"
```

## 5. Ghép mọi thứ: chương trình hoàn chỉnh có ý nghĩa

**Yêu cầu:** in bảng cửu chương của số bất kỳ, đánh dấu các kết quả chia hết cho 5.

```js
function inBangCuuChuong(so) {
  console.log(`--- Bảng nhân ${so} ---`);
  for (let i = 1; i <= 10; i++) {
    const tich = so * i;
    const danhDau = tich % 5 === 0 ? " <- chia hết cho 5" : "";
    console.log(`${so} x ${i} = ${tich}${danhDau}`);
  }
}

inBangCuuChuong(7);
```

Sản phẩm gồm đủ: hàm có tham số, vòng for, tính toán, ternary trả chuỗi, template literal. Code dạng này xuất hiện cực nhiều trong đề kiểm tra viết tay.

## Checklist tự kiểm tra

- [ ] Viết được if else 3 nhánh xếp loại học lực
- [ ] Trả lời: break vs continue khác gì nhau
- [ ] Viết hàm nhận tuổi, trả về true/false "đủ 18"
- [ ] Giải thích vì sao while không có bước tăng sẽ nguy hiểm
- [ ] Chuyển đổi qua lại function thường <-> arrow function
