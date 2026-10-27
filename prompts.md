# NHẬT KÝ PROMPT AI - BÀI LUYỆN TẬP 02
**Môn học:** Luyện tập kỹ năng JavaScript cơ bản (AI-Driven)  
**Lớp:** AI-SDLC-PTHB260930  
**Học viên:** Trần Lê Chí Vỹ (TranLeChiVy)  
**Đề bài:** Quản lý chi tiêu cá nhân (Expense Tracker)

---

## 1. Prompt 1: Thiết lập cấu trúc giao diện HTML5 & Bố cục 4 vùng chuẩn Responsive
```text
Hãy tạo cấu trúc HTML5 cho ứng dụng "Quản lý chi tiêu cá nhân" trong file index.html và style.css với phong cách hiện đại, trực quan, chuyên nghiệp, hỗ trợ responsive hoàn hảo từ màn hình điện thoại 375px đến desktop.

Giao diện gồm 4 vùng chính theo đề bài:
1. Vùng 1 - Tổng quan & Ngân sách:
   - Header tiêu đề: "QUẢN LÝ CHI TIÊU".
   - Thống kê tài chính: Tổng thu, Tổng chi, Số dư (màu sắc phân biệt rõ ràng).
   - Quản lý ngân sách: Ô nhập số tiền ngân sách, nút [Lưu ngân sách], thanh tiến độ trực quan hiển thị % ngân sách đã chi trong tháng, nhãn cảnh báo vượt ngân sách, và hiển thị danh mục chi tiêu nhiều nhất trong tháng.
2. Vùng 2 - Biểu mẫu Giao dịch (Form):
   - Ô nhập Mô tả (tối đa 50 ký tự, có placeholder gợi ý).
   - Ô nhập Số tiền (VNĐ).
   - Lựa chọn Loại giao dịch: "Thu" hoặc "Chi" (dạng switch/radio/button rõ ràng).
   - Dropdown chọn Danh mục (Ăn uống, Đi lại, Học tập, Giải trí, Lương, Khác).
   - Ô chọn Ngày giao dịch (input date, mặc định ngày hôm nay).
   - Nút hành động: Nút "Thêm giao dịch", nút "Hủy" (ẩn khi thêm, hiện khi sửa).
   - Các vùng hiển thị lỗi xác thực ngay dưới từng ô nhập và thông báo trạng thái chung.
3. Vùng 3 - Bộ lọc đa tiêu chí:
   - Lọc theo Loại (Tất cả, Thu, Chi).
   - Lọc theo Danh mục (Tất cả và 6 danh mục).
   - Lọc theo Tháng (Tất cả các tháng và danh sách các tháng có giao dịch).
4. Vùng 4 - Bảng danh sách giao dịch:
   - Bảng 4 cột: Ngày (dd/mm/yyyy), Mô tả, Danh mục, Số tiền (khoản thu có dấu + màu xanh, khoản chi có dấu - màu đỏ).
   - Cột thao tác gồm nút Sửa và Xóa cho mỗi dòng.
   - Vùng thông báo khi chưa có giao dịch ("Chưa có giao dịch nào") hoặc lọc không thấy ("Không có giao dịch phù hợp").
```

---

## 2. Prompt 2: Khai báo dữ liệu toàn cục, Hằng số và Các hàm tiện ích dùng chung
```text
Trong file app.js, hãy viết mã nguồn khởi tạo cấu trúc dữ liệu nền tảng và các hàm tiện ích theo đúng yêu cầu:
1. Khai báo dữ liệu:
   - Mảng `expenses` lưu danh sách giao dịch. Mỗi giao dịch là object gồm 6 thuộc tính: `id` (number, Date.now()), `moTa` (string), `soTien` (number), `loai` (string "thu" | "chi"), `danhMuc` (string), `ngay` (string YYYY-MM-DD).
   - Hằng số `DANH_MUC` gồm 6 danh mục: ["Ăn uống", "Đi lại", "Học tập", "Giải trí", "Lương", "Khác"].
   - Hằng số `NGAN_SACH_MAC_DINH = 5000000`.
   - Biến `budget` lưu ngân sách hiện tại (mặc định 5.000.000đ).
   - Biến `editingId = null` để quản lý trạng thái đang thêm hay đang sửa.
   - Object `filter` lưu điều kiện lọc: `{ loai: "all", danhMuc: "all", thang: "all" }`.
2. Hàm tiện ích:
   - `saveData()`: Lưu mảng `expenses` và `budget` vào localStorage theo đúng key "expenses" và "budget".
   - `loadData()`: Đọc `expenses` và `budget` từ localStorage khi tải trang, gán giá trị mặc định nếu chưa có.
   - `formatMoney(so)`: Trả về chuỗi tiền Việt định dạng chuẩn (ví dụ 1.250.000 ₫).
   - `formatDateToDisplay(dateStr)`: Chuyển đổi định dạng ngày từ YYYY-MM-DD sang dd/mm/yyyy.
   - `getTodayString()`: Lấy ngày hiện tại dạng YYYY-MM-DD để đặt mặc định cho ô input date.
```

---

## 3. Prompt 3: Kiểm tra dữ liệu (Validate) dùng chung & Chức năng 1 - Thêm giao dịch
```text
Hãy viết hàm kiểm tra tính hợp lệ dữ liệu dùng chung `validateTransaction(data)` và hàm thêm giao dịch `addExpense()`:
1. Hàm `validateTransaction(data)` kiểm tra:
   - Mô tả: Không rỗng sau khi trim(), độ dài tối đa 50 ký tự. Nếu sai báo: "Mô tả không được để trống và tối đa 50 ký tự".
   - Số tiền: Phải là số nguyên dương (> 0, không có phần thập phân). Nếu sai báo: "Số tiền phải là số nguyên dương".
   - Loại: Phải là "thu" hoặc "chi".
   - Danh mục: Phải nằm trong danh sách `DANH_MUC`.
   - Ngày: Định dạng YYYY-MM-DD và không được sau ngày hôm nay. Nếu sau hôm nay báo: "Không được nhập giao dịch trong tương lai".
   - Hiển thị thông báo lỗi cụ thể ngay dưới ô nhập tương ứng. Trả về true nếu tất cả hợp lệ, ngược lại false.
2. Hàm `addExpense()`:
   - Lấy dữ liệu từ form, gọi `validateTransaction`.
   - Nếu hợp lệ: tạo object giao dịch mới với id = Date.now(), thêm vào đầu mảng `expenses`.
   - Xóa trắng form (reset về giá trị mặc định, ngày = hôm nay).
   - Hiển thị thông báo: "Thêm giao dịch thành công" (không dùng alert, hiện thông báo trên giao diện).
   - Lưu vào localStorage bằng `saveData()`, sau đó gọi `render()`.
```

---

## 4. Prompt 4: Chức năng 2 - Hiển thị danh sách giao dịch & Hàm Render trung tâm
```text
Hãy xây dựng hàm `render()` trung tâm dùng chung để vẽ lại toàn bộ giao diện mỗi khi có thay đổi dữ liệu:
1. Hàm `render()` thực hiện:
   - Cập nhật số liệu tổng quan: Tính Tổng thu, Tổng chi, Số dư từ danh sách đang hiển thị (theo bộ lọc hiện tại).
   - Cập nhật thống kê ngân sách và thanh tiến độ tháng hiện tại.
   - Cập nhật danh sách các tháng trong dropdown bộ lọc.
   - Gọi `renderTransactionList()` để vẽ bảng danh sách giao dịch:
     + Bảng gồm 4 cột: Ngày (dd/mm/yyyy), Mô tả, Danh mục, Số tiền; kèm cột thao tác có nút [Sửa] và [Xóa].
     + Sắp xếp theo ngày giảm dần (mới nhất ở trên), nếu trùng ngày sắp theo id giảm dần.
     + Khoản thu hiển thị dấu "+" màu xanh (ví dụ: +6.000.000 ₫), khoản chi hiển thị dấu "−" màu đỏ (ví dụ: -45.000 ₫).
     + Nếu `expenses` rỗng: hiển thị thông báo "Chưa có giao dịch nào".
     + Nếu `expenses` có dữ liệu nhưng kết quả sau khi lọc rỗng: hiển thị "Không có giao dịch phù hợp".
```

---

## 5. Prompt 5: Chức năng 3 - Cập nhật giao dịch & Cập nhật ngân sách
```text
Hãy xây dựng chức năng sửa giao dịch và thay đổi hạn mức ngân sách:
1. Cập nhật giao dịch:
   - Hàm `startEditExpense(id)`: Tìm giao dịch theo `id`, đưa toàn bộ dữ liệu lên form, đổi nhãn nút "Thêm" thành "Lưu", hiện nút "Hủy".
   - Hàm `updateExpense()`: Khi đang ở chế độ sửa và người dùng bấm "Lưu", gọi hàm kiểm tra dữ liệu `validateTransaction`. Giữ nguyên `id` ban đầu, cập nhật các thuộc tính trong `expenses`, hiện thông báo "Cập nhật thành công", reset form về trạng thái thêm mới, lưu vào localStorage và gọi `render()`.
   - Hàm `cancelEdit()`: Hủy chế độ sửa, đưa form về mặc định.
2. Cập nhật ngân sách:
   - Hàm `updateBudget()`: Đọc giá trị từ ô nhập ngân sách.
   - Kiểm tra: phải là số nguyên dương lớn hơn 0. Nếu không hợp lệ, báo lỗi rõ ràng.
   - Nếu hợp lệ: gán `budget = giá trị mới`, lưu vào localStorage qua `saveData()`, hiện thông báo "Cập nhật ngân sách thành công", cập nhật lại thanh tiến độ và số liệu ngay lập tức qua `render()`.
```

---

## 6. Prompt 6: Chức năng 4 - Xóa giao dịch với xác nhận
```text
Hãy xây dựng hàm xóa giao dịch `deleteExpense(id)`:
1. Khi bấm nút "Xóa", hiển thị hộp thoại xác nhận: `confirm("Bạn có chắc muốn xóa giao dịch này?")`.
2. Nếu người dùng chọn Đồng ý (OK):
   - Xóa đúng giao dịch có mã `id` tương ứng khỏi mảng `expenses`, tất cả các giao dịch khác giữ nguyên.
   - Nếu đang sửa chính giao dịch đó thì reset form về trạng thái thêm mới.
   - Hiển thị thông báo trên giao diện: "Xóa thành công".
   - Gọi `saveData()` để lưu vào localStorage và `render()` để cập nhật ngay lập tức tổng thu, tổng chi, số dư và thanh ngân sách.
```

---

## 7. Prompt 7: Chức năng 5 - Bộ lọc đa tiêu chí kết hợp
```text
Hãy xây dựng chức năng lọc giao dịch kết hợp theo 3 tiêu chí:
1. Bộ lọc gồm:
   - Loại: Tất cả / Thu / Chi.
   - Danh mục: Tất cả / 6 danh mục trong `DANH_MUC`.
   - Tháng: Tất cả các tháng / danh sách các tháng (dạng MM/YYYY) tự động trích xuất từ các giao dịch hiện có.
2. Cơ chế hoạt động:
   - Bắt sự kiện `change` trên cả 3 ô chọn để cập nhật object `filter`.
   - Hàm lọc trả về danh sách các giao dịch thỏa mãn đồng thời cả 3 điều kiện.
   - Tổng thu và Tổng chi trên phần Thống kê được tính toán và hiển thị chính xác theo kết quả của bộ lọc đang áp dụng.
   - Nếu bộ lọc không trả về kết quả nào, bảng hiển thị dòng thông báo: "Không có giao dịch phù hợp".
```

---

## 8. Prompt 8: Chức năng 6 - Thống kê ngân sách tháng hiện tại & Danh mục chi nhiều nhất
```text
Hãy xây dựng hàm `updateBudgetStats()` để tính toán và hiển thị trực quan tình hình ngân sách tháng này:
1. Thống kê ngân sách tháng hiện tại:
   - Lọc tất cả các giao dịch có `loai === "chi"` trong tháng và năm hiện tại (theo thời gian thực hệ thống).
   - Tính tổng chi tháng hiện tại.
   - Tỷ lệ sử dụng ngân sách = `Math.round((tongChiThang / budget) * 100)`.
   - Cập nhật thanh tiến độ (progress bar):
     + Dưới 80%: Thanh hiển thị màu xanh lá (#10b981).
     + Từ 80% đến dưới 100%: Thanh hiển thị màu vàng cam (#f59e0b).
     + Từ 100% trở lên: Thanh hiển thị màu đỏ (#ef4444) và hiển thị cảnh báo nổi bật: "Bạn đã chi vượt ngân sách tháng này".
2. Danh mục chi nhiều tiền nhất trong tháng:
   - Tính tổng tiền chi theo từng danh mục trong tháng hiện tại.
   - Tìm danh mục có tổng tiền chi lớn nhất. Quy tắc phá vỡ hòa (tie-break): Nếu có nhiều danh mục có tổng chi bằng nhau và lớn nhất, chọn danh mục xuất hiện trước trong mảng `DANH_MUC`.
   - Hiển thị tên danh mục chi nhiều nhất kèm số tiền đã chi, giúp người dùng dễ dàng kiểm soát tài chính.
```
