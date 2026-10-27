/**
 * ==============================================================================
 * ỨNG DỤNG QUẢN LÝ CHI TIÊU CÁ NHÂN (EXPENSE TRACKER)
 * Bài luyện tập kỹ năng JavaScript cơ bản (AI-Driven) - Đề số 02
 * Học viên: Trần Lê Chí Vỹ (TranLeChiVy) - Lớp: AI-SDLC-PTHB260930
 * ==============================================================================
 */

// ------------------------------------------------------------------------------
// 4.1. KHAI BÁO DỮ LIỆU & HẰNG SỐ TOÀN CỤC
// ------------------------------------------------------------------------------

/** Mảng chứa danh sách các giao dịch */
let expenses = [];

/** Hằng số mảng 6 danh mục cố định */
const DANH_MUC = ["Ăn uống", "Đi lại", "Học tập", "Giải trí", "Lương", "Khác"];

/** Hằng số ngân sách mặc định (5.000.000 đồng) */
const NGAN_SACH_MAC_DINH = 5000000;

/** Biến lưu ngân sách hiện tại */
let budget = NGAN_SACH_MAC_DINH;

/** Object lưu điều kiện lọc đang chọn */
const filter = {
  loai: "all",
  danhMuc: "all",
  thang: "all"
};

/** Biến lưu id giao dịch đang sửa (null nếu đang ở chế độ thêm mới) */
let editingId = null;

// ------------------------------------------------------------------------------
// HÀM TIỆN ÍCH DÙNG CHUNG (4.9)
// ------------------------------------------------------------------------------

/**
 * Định dạng số thành chuỗi tiền Việt (ví dụ: 1.250.000 ₫)
 * @param {number} so - Số tiền cần định dạng
 * @returns {string} Chuỗi định dạng tiền tệ Việt Nam
 */
function formatMoney(so) {
  const num = Number(so) || 0;
  return num.toLocaleString("vi-VN") + " ₫";
}

/**
 * Chuyển định dạng ngày từ YYYY-MM-DD sang dd/mm/yyyy
 * @param {string} dateStr - Chuỗi ngày định dạng YYYY-MM-DD
 * @returns {string} Chuỗi ngày định dạng dd/mm/yyyy
 */
function formatDateToDisplay(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

/**
 * Lấy ngày hôm nay dưới dạng YYYY-MM-DD
 * @returns {string} Chuỗi ngày hôm nay
 */
function getTodayString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Hiển thị thông báo Toast trên màn hình (Không dùng alert)
 * @param {string} message - Nội dung thông báo
 * @param {"success" | "error" | "info"} type - Kiểu thông báo
 */
let toastTimeout = null;
function showToast(message, type = "success") {
  const toastEl = document.getElementById("toast-message");
  if (!toastEl) return;

  toastEl.textContent = message;
  toastEl.className = `toast-message toast-${type}`;
  toastEl.classList.remove("hidden");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastEl.classList.add("hidden");
  }, 3000);
}

/**
 * Lưu dữ liệu expenses và budget vào localStorage
 */
function saveData() {
  try {
    localStorage.setItem("expenses", JSON.stringify(expenses));
    localStorage.setItem("budget", JSON.stringify(budget));
  } catch (error) {
    console.error("Lỗi khi lưu vào localStorage:", error);
  }
}

/**
 * Đọc dữ liệu expenses và budget từ localStorage
 */
function loadData() {
  try {
    const storedExpenses = localStorage.getItem("expenses");
    if (storedExpenses) {
      expenses = JSON.parse(storedExpenses);
      if (!Array.isArray(expenses)) expenses = [];
    } else {
      expenses = [];
    }

    const storedBudget = localStorage.getItem("budget");
    if (storedBudget !== null) {
      const parsedBudget = Number(JSON.parse(storedBudget));
      budget = !isNaN(parsedBudget) && parsedBudget > 0 ? parsedBudget : NGAN_SACH_MAC_DINH;
    } else {
      budget = NGAN_SACH_MAC_DINH;
    }
  } catch (error) {
    console.error("Lỗi khi đọc từ localStorage:", error);
    expenses = [];
    budget = NGAN_SACH_MAC_DINH;
  }
}

// ------------------------------------------------------------------------------
// HÀM KIỂM TRA DỮ LIỆU DÙNG CHUNG (CHO CẢ THÊM VÀ SỬA - 4.9)
// ------------------------------------------------------------------------------

/**
 * Kiểm tra tính hợp lệ của dữ liệu giao dịch
 * @param {Object} data - Dữ liệu giao dịch cần kiểm tra
 * @returns {boolean} true nếu hợp lệ, false nếu có lỗi
 */
function validateTransaction(data) {
  let isValid = true;

  // Lấy các phần tử báo lỗi
  const moTaError = document.getElementById("mo-ta-error");
  const soTienError = document.getElementById("so-tien-error");
  const loaiError = document.getElementById("loai-error");
  const danhMucError = document.getElementById("danh-muc-error");
  const ngayError = document.getElementById("ngay-error");

  const moTaInput = document.getElementById("mo-ta");
  const soTienInput = document.getElementById("so-tien");
  const danhMucInput = document.getElementById("danh-muc");
  const ngayInput = document.getElementById("ngay");

  // Xóa thông báo lỗi cũ
  const resetError = (errEl, inputEl) => {
    if (errEl) {
      errEl.textContent = "";
      errEl.classList.add("hidden");
    }
    if (inputEl) inputEl.classList.remove("input-invalid");
  };

  const showError = (errEl, inputEl, message) => {
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.remove("hidden");
    }
    if (inputEl) inputEl.classList.add("input-invalid");
    isValid = false;
  };

  resetError(moTaError, moTaInput);
  resetError(soTienError, soTienInput);
  resetError(loaiError, null);
  resetError(danhMucError, danhMucInput);
  resetError(ngayError, ngayInput);

  // 1. Kiểm tra mô tả: Không rỗng, tối đa 50 ký tự
  const moTaTrim = (data.moTa || "").trim();
  if (!moTaTrim) {
    showError(moTaError, moTaInput, "Mô tả không được để trống.");
  } else if (moTaTrim.length > 50) {
    showError(moTaError, moTaInput, "Mô tả tối đa 50 ký tự.");
  }

  // 2. Kiểm tra số tiền: Đổi từ chuỗi sang số; phải là số nguyên lớn hơn 0
  const rawSoTien = data.soTien;
  const numSoTien = Number(rawSoTien);
  if (
    rawSoTien === "" ||
    rawSoTien === null ||
    rawSoTien === undefined ||
    isNaN(numSoTien) ||
    numSoTien <= 0 ||
    !Number.isInteger(numSoTien)
  ) {
    showError(soTienError, soTienInput, "Số tiền phải là số nguyên dương.");
  }

  // 3. Kiểm tra loại: "thu" hoặc "chi"
  if (data.loai !== "thu" && data.loai !== "chi") {
    showError(loaiError, null, "Loại giao dịch phải là 'thu' hoặc 'chi'.");
  }

  // 4. Kiểm tra danh mục: Phải nằm trong DANH_MUC
  if (!DANH_MUC.includes(data.danhMuc)) {
    showError(danhMucError, danhMucInput, "Danh mục không hợp lệ.");
  }

  // 5. Kiểm tra ngày: Không rỗng, không sau ngày hôm nay
  const todayStr = getTodayString();
  if (!data.ngay) {
    showError(ngayError, ngayInput, "Vui lòng chọn ngày giao dịch.");
  } else if (data.ngay > todayStr) {
    showError(ngayError, ngayInput, "Không được nhập giao dịch trong tương lai.");
  }

  return isValid;
}

// ------------------------------------------------------------------------------
// CHỨC NĂNG 1: THÊM GIAO DỊCH (4.3)
// ------------------------------------------------------------------------------

/**
 * Xử lý thêm giao dịch mới
 */
function addExpense() {
  const moTa = document.getElementById("mo-ta").value;
  const soTien = document.getElementById("so-tien").value;
  const loaiRadio = document.querySelector('input[name="loai"]:checked');
  const loai = loaiRadio ? loaiRadio.value : "chi";
  const danhMuc = document.getElementById("danh-muc").value;
  const ngay = document.getElementById("ngay").value;

  const formData = { moTa, soTien, loai, danhMuc, ngay };

  if (!validateTransaction(formData)) {
    return;
  }

  // Tạo đối tượng giao dịch mới
  const newExpense = {
    id: Date.now(),
    moTa: moTa.trim(),
    soTien: Number(soTien),
    loai: loai,
    danhMuc: danhMuc,
    ngay: ngay
  };

  // Thêm vào danh sách
  expenses.unshift(newExpense);

  // Xóa trắng form & khôi phục mặc định
  resetTransactionForm();

  // Thông báo thành công
  showToast("Thêm giao dịch thành công", "success");

  // Lưu và render
  saveData();
  render();
}

/**
 * Xóa trắng và khôi phục giá trị mặc định cho form
 */
function resetTransactionForm() {
  const form = document.getElementById("transaction-form");
  if (form) form.reset();

  document.getElementById("mo-ta").value = "";
  document.getElementById("so-tien").value = "";
  document.getElementById("loai-chi").checked = true;
  document.getElementById("danh-muc").value = DANH_MUC[0];
  document.getElementById("ngay").value = getTodayString();
  document.getElementById("mo-ta-counter").textContent = "0/50";

  // Xóa các thông báo lỗi nếu có
  const errorElements = document.querySelectorAll(".input-error-msg");
  errorElements.forEach(el => {
    el.textContent = "";
    el.classList.add("hidden");
  });

  const invalidInputs = document.querySelectorAll(".input-invalid");
  invalidInputs.forEach(el => el.classList.remove("input-invalid"));

  // Đưa nút và tiêu đề về trạng thái thêm
  editingId = null;
  document.getElementById("form-heading").textContent = "Thêm Giao Dịch Mới";
  document.getElementById("form-mode-badge").textContent = "Chế độ: Thêm mới";
  document.getElementById("form-mode-badge").className = "badge-mode mode-add";
  document.getElementById("submit-btn-text").textContent = "Thêm giao dịch";
  document.getElementById("cancel-btn").classList.add("hidden");
}

// ------------------------------------------------------------------------------
// CHỨC NĂNG 3: CẬP NHẬT GIAO DỊCH & NGÂN SÁCH (4.5)
// ------------------------------------------------------------------------------

/**
 * Bắt đầu chế độ sửa giao dịch
 * @param {number} id - Mã giao dịch cần sửa
 */
function startEditExpense(id) {
  const expense = expenses.find(item => item.id === id);
  if (!expense) return;

  editingId = id;

  // Đưa dữ liệu lên form
  document.getElementById("mo-ta").value = expense.moTa;
  document.getElementById("mo-ta-counter").textContent = `${expense.moTa.length}/50`;
  document.getElementById("so-tien").value = expense.soTien;

  if (expense.loai === "thu") {
    document.getElementById("loai-thu").checked = true;
  } else {
    document.getElementById("loai-chi").checked = true;
  }

  document.getElementById("danh-muc").value = expense.danhMuc;
  document.getElementById("ngay").value = expense.ngay;

  // Cập nhật giao diện form sang chế độ sửa
  document.getElementById("form-heading").textContent = "Chỉnh Sửa Giao Dịch";
  document.getElementById("form-mode-badge").textContent = `Chế độ: Đang sửa #${id}`;
  document.getElementById("form-mode-badge").className = "badge-mode mode-edit";
  document.getElementById("submit-btn-text").textContent = "Lưu";
  document.getElementById("cancel-btn").classList.remove("hidden");

  // Cuộn mượt lên form
  document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
}

/**
 * Cập nhật giao dịch đang sửa
 */
function updateExpense() {
  if (editingId === null) return;

  const moTa = document.getElementById("mo-ta").value;
  const soTien = document.getElementById("so-tien").value;
  const loaiRadio = document.querySelector('input[name="loai"]:checked');
  const loai = loaiRadio ? loaiRadio.value : "chi";
  const danhMuc = document.getElementById("danh-muc").value;
  const ngay = document.getElementById("ngay").value;

  const formData = { moTa, soTien, loai, danhMuc, ngay };

  if (!validateTransaction(formData)) {
    return;
  }

  const index = expenses.findIndex(item => item.id === editingId);
  if (index !== -1) {
    // Giữ nguyên id ban đầu, cập nhật các thuộc tính
    expenses[index] = {
      id: editingId,
      moTa: moTa.trim(),
      soTien: Number(soTien),
      loai: loai,
      danhMuc: danhMuc,
      ngay: ngay
    };

    showToast("Cập nhật thành công", "success");
    resetTransactionForm();
    saveData();
    render();
  }
}

/**
 * Hủy bỏ chế độ sửa giao dịch
 */
function cancelEdit() {
  resetTransactionForm();
}

/**
 * Cập nhật hạn mức ngân sách
 */
function updateBudget() {
  const budgetInput = document.getElementById("budget-input");
  const budgetError = document.getElementById("budget-error");
  const rawValue = budgetInput.value.trim();
  const numValue = Number(rawValue);

  if (rawValue === "" || isNaN(numValue) || numValue <= 0 || !Number.isInteger(numValue)) {
    budgetError.textContent = "Ngân sách phải là số nguyên dương.";
    budgetError.classList.remove("hidden");
    budgetInput.classList.add("input-invalid");
    return;
  }

  budgetError.textContent = "";
  budgetError.classList.add("hidden");
  budgetInput.classList.remove("input-invalid");

  budget = numValue;
  saveData();
  render();
  showToast("Cập nhật ngân sách thành công", "success");
}

// ------------------------------------------------------------------------------
// CHỨC NĂNG 4: XÓA GIAO DỊCH (4.6)
// ------------------------------------------------------------------------------

/**
 * Xóa một giao dịch theo id
 * @param {number} id - Mã giao dịch cần xóa
 */
function deleteExpense(id) {
  const confirmed = confirm("Bạn có chắc muốn xóa giao dịch này?");
  if (!confirmed) return;

  expenses = expenses.filter(item => item.id !== id);

  // Nếu đang sửa giao dịch bị xóa thì reset form
  if (editingId === id) {
    resetTransactionForm();
  }

  saveData();
  render();
  showToast("Xóa thành công", "success");
}

// ------------------------------------------------------------------------------
// CHỨC NĂNG 5: LỌC GIAO DỊCH (4.7)
// ------------------------------------------------------------------------------

/**
 * Lọc danh sách giao dịch theo 3 tiêu chí kết hợp (Loại, Danh mục, Tháng)
 * @returns {Array} Danh sách các giao dịch sau khi lọc
 */
function filterExpenses() {
  return expenses.filter(item => {
    // 1. Lọc theo loại (Tất cả / Thu / Chi)
    if (filter.loai !== "all" && item.loai !== filter.loai) {
      return false;
    }

    // 2. Lọc theo danh mục
    if (filter.danhMuc !== "all" && item.danhMuc !== filter.danhMuc) {
      return false;
    }

    // 3. Lọc theo tháng (so sánh tiền tố YYYY-MM)
    if (filter.thang !== "all" && !item.ngay.startsWith(filter.thang)) {
      return false;
    }

    return true;
  });
}

/**
 * Cập nhật danh sách các tháng trong dropdown bộ lọc dựa trên dữ liệu hiện có
 */
function updateMonthFilterOptions() {
  const monthSelect = document.getElementById("filter-thang");
  if (!monthSelect) return;

  const currentSelected = filter.thang;

  // Lấy tập hợp các tháng xuất hiện trong expenses
  const monthsSet = new Set();
  expenses.forEach(item => {
    if (item.ngay && item.ngay.length >= 7) {
      monthsSet.add(item.ngay.substring(0, 7)); // 'YYYY-MM'
    }
  });

  // Luôn thêm tháng hiện tại vào nếu chưa có
  const todayStr = getTodayString();
  monthsSet.add(todayStr.substring(0, 7));

  // Sắp xếp các tháng giảm dần (mới nhất lên đầu)
  const sortedMonths = Array.from(monthsSet).sort().reverse();

  let optionsHtml = '<option value="all">Tất cả các tháng</option>';
  sortedMonths.forEach(ym => {
    const [year, month] = ym.split("-");
    const label = `Tháng ${month}/${year}`;
    optionsHtml += `<option value="${ym}">${label}</option>`;
  });

  monthSelect.innerHTML = optionsHtml;

  // Khôi phục lựa chọn trước đó nếu hợp lệ
  if (monthsSet.has(currentSelected) || currentSelected === "all") {
    monthSelect.value = currentSelected;
  } else {
    filter.thang = "all";
    monthSelect.value = "all";
  }
}

// ------------------------------------------------------------------------------
// CHỨC NĂNG 6: THỐNG KÊ NGÂN SÁCH (4.8)
// ------------------------------------------------------------------------------

/**
 * Thống kê ngân sách trong tháng hiện tại và tìm danh mục chi nhiều nhất
 */
function updateBudgetStats() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");
  const currentMonthKey = `${currentYear}-${currentMonth}`;

  // Lọc các khoản chi trong tháng hiện tại
  const currentMonthExpenses = expenses.filter(
    item => item.loai === "chi" && item.ngay.startsWith(currentMonthKey)
  );

  // Tổng chi tháng hiện tại
  const totalMonthExpense = currentMonthExpenses.reduce((sum, item) => sum + item.soTien, 0);

  // Tính phần trăm ngân sách đã dùng: (tổng chi tháng / ngân sách * 100), làm tròn số nguyên
  const percent = budget > 0 ? Math.round((totalMonthExpense / budget) * 100) : 0;

  // Cập nhật giao diện tiến độ
  const monthSpentText = document.getElementById("month-spent-text");
  const budgetLimitText = document.getElementById("budget-limit-text");
  const percentBadge = document.getElementById("budget-percent-text");
  const progressBar = document.getElementById("budget-progress-bar");
  const progressTrack = document.getElementById("progress-track");
  const budgetAlert = document.getElementById("budget-alert");

  if (monthSpentText) monthSpentText.textContent = formatMoney(totalMonthExpense);
  if (budgetLimitText) budgetLimitText.textContent = formatMoney(budget);
  if (percentBadge) percentBadge.textContent = `${percent}%`;

  // Độ dài thanh tiến độ (tối đa 100% về mặt hình ảnh)
  const visualPercent = Math.min(percent, 100);
  if (progressBar) progressBar.style.width = `${visualPercent}%`;
  if (progressTrack) progressTrack.setAttribute("aria-valuenow", percent);

  // Đổi màu theo ngưỡng:
  // - Dưới 80%: Xanh
  // - 80% đến dưới 100%: Vàng
  // - Từ 100% trở lên: Đỏ và hiện "Bạn đã chi vượt ngân sách tháng này"
  if (percent < 80) {
    if (progressBar) progressBar.className = "progress-fill progress-safe";
    if (percentBadge) percentBadge.className = "progress-percent-badge progress-safe";
    if (budgetAlert) budgetAlert.classList.add("hidden");
  } else if (percent < 100) {
    if (progressBar) progressBar.className = "progress-fill progress-warning";
    if (percentBadge) percentBadge.className = "progress-percent-badge progress-warning";
    if (budgetAlert) budgetAlert.classList.add("hidden");
  } else {
    if (progressBar) progressBar.className = "progress-fill progress-danger";
    if (percentBadge) percentBadge.className = "progress-percent-badge progress-danger";
    if (budgetAlert) budgetAlert.classList.remove("hidden");
  }

  // Thống kê danh mục chi nhiều tiền nhất trong tháng
  // "Nếu bằng nhau, lấy danh mục đứng trước trong DANH_MUC"
  const topCategoryEl = document.getElementById("top-category-text");
  if (topCategoryEl) {
    if (currentMonthExpenses.length === 0) {
      topCategoryEl.innerHTML = "Chi nhiều nhất tháng: <em>Chưa có khoản chi</em>";
    } else {
      // Khởi tạo tổng chi cho 6 danh mục theo đúng thứ tự DANH_MUC
      const categoryTotals = {};
      DANH_MUC.forEach(cat => {
        categoryTotals[cat] = 0;
      });

      currentMonthExpenses.forEach(item => {
        if (categoryTotals.hasOwnProperty(item.danhMuc)) {
          categoryTotals[item.danhMuc] += item.soTien;
        }
      });

      // Duyệt qua DANH_MUC theo thứ tự ban đầu để tìm max, nếu bằng nhau thì giữ danh mục đứng trước
      let topCategory = DANH_MUC[0];
      let maxSpent = -1;

      for (const cat of DANH_MUC) {
        if (categoryTotals[cat] > maxSpent) {
          maxSpent = categoryTotals[cat];
          topCategory = cat;
        }
      }

      if (maxSpent > 0) {
        topCategoryEl.innerHTML = `Chi nhiều nhất tháng: <strong>${topCategory}</strong> (${formatMoney(maxSpent)})`;
      } else {
        topCategoryEl.innerHTML = "Chi nhiều nhất tháng: <em>Chưa có khoản chi</em>";
      }
    }
  }
}

// ------------------------------------------------------------------------------
// CHỨC NĂNG 2: HIỂN THỊ DANH SÁCH (4.4)
// ------------------------------------------------------------------------------

/**
 * Hiển thị danh sách giao dịch lên bảng HTML
 * @param {Array} list - Danh sách giao dịch cần hiển thị
 */
function renderTransactionList(list) {
  const tbody = document.getElementById("transaction-tbody");
  const emptyState = document.getElementById("empty-state");
  const emptyText = document.getElementById("empty-state-text");
  const countBadge = document.getElementById("transaction-count-badge");
  const table = document.getElementById("transaction-table");

  if (!tbody) return;

  if (countBadge) {
    countBadge.textContent = `${list.length} giao dịch`;
  }

  // Kiểm tra trường hợp chưa có giao dịch nào hoặc lọc không thấy
  if (list.length === 0) {
    tbody.innerHTML = "";
    if (table) table.classList.add("hidden");
    if (emptyState) {
      emptyState.classList.remove("hidden");
      if (expenses.length === 0) {
        emptyText.textContent = "Chưa có giao dịch nào";
      } else {
        emptyText.textContent = "Không có giao dịch phù hợp";
      }
    }
    return;
  }

  if (table) table.classList.remove("hidden");
  if (emptyState) emptyState.classList.add("hidden");

  // Sắp xếp theo ngày, mới nhất ở trên (nếu trùng ngày sắp theo id giảm dần)
  const sortedList = [...list].sort((a, b) => {
    if (a.ngay !== b.ngay) {
      return b.ngay.localeCompare(a.ngay);
    }
    return b.id - a.id;
  });

  // Tạo các hàng trong bảng
  let html = "";
  sortedList.forEach(item => {
    const isIncome = item.loai === "thu";
    const amountPrefix = isIncome ? "+" : "−";
    const amountClass = isIncome ? "amount-income" : "amount-expense";
    const formattedAmount = `${amountPrefix}${formatMoney(item.soTien)}`;
    const formattedDate = formatDateToDisplay(item.ngay);

    html += `
      <tr data-id="${item.id}">
        <td class="td-date">${formattedDate}</td>
        <td class="td-desc">${escapeHtml(item.moTa)}</td>
        <td class="td-category"><span class="category-tag">${escapeHtml(item.danhMuc)}</span></td>
        <td class="td-amount ${amountClass}">${formattedAmount}</td>
        <td class="td-actions">
          <div class="action-buttons">
            <button type="button" class="btn-action btn-edit" onclick="startEditExpense(${item.id})" title="Sửa giao dịch">Sửa</button>
            <button type="button" class="btn-action btn-delete" onclick="deleteExpense(${item.id})" title="Xóa giao dịch">Xóa</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/**
 * Tránh lỗi XSS khi render chuỗi người dùng nhập
 * @param {string} str - Chuỗi cần escape
 * @returns {string} Chuỗi đã escape an toàn
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ------------------------------------------------------------------------------
// HÀM RENDER TRUNG TÂM (DÙNG CHUNG THEO 4.9)
// ------------------------------------------------------------------------------

/**
 * Hàm render trung tâm: vẽ lại toàn bộ giao diện từ dữ liệu
 * Được gọi lại sau mọi thao tác: Thêm, Sửa, Xóa, Lọc, Khởi tạo trang
 */
function render() {
  // 1. Lọc danh sách theo filter hiện tại
  const filteredList = filterExpenses();

  // 2. Tính Tổng thu, Tổng chi, Số dư THEO KẾT QUẢ ĐANG LỌC (Yêu cầu 4.7)
  let totalIncome = 0;
  let totalExpense = 0;

  filteredList.forEach(item => {
    if (item.loai === "thu") {
      totalIncome += item.soTien;
    } else if (item.loai === "chi") {
      totalExpense += item.soTien;
    }
  });

  // Số dư = tổng thu - tổng chi (tính khi hiển thị, không lưu)
  const balance = totalIncome - totalExpense;

  // Cập nhật số liệu thống kê lên màn hình
  const totalIncomeEl = document.getElementById("total-income");
  const totalExpenseEl = document.getElementById("total-expense");
  const totalBalanceEl = document.getElementById("total-balance");

  if (totalIncomeEl) totalIncomeEl.textContent = formatMoney(totalIncome);
  if (totalExpenseEl) totalExpenseEl.textContent = formatMoney(totalExpense);
  if (totalBalanceEl) {
    totalBalanceEl.textContent = formatMoney(balance);
    if (balance < 0) {
      totalBalanceEl.className = "stat-value text-expense";
    } else {
      totalBalanceEl.className = "stat-value text-balance";
    }
  }

  // 3. Hiển thị ngân sách vào ô input
  const budgetInput = document.getElementById("budget-input");
  if (budgetInput && document.activeElement !== budgetInput) {
    budgetInput.value = budget;
  }

  // 4. Cập nhật thống kê ngân sách tháng hiện tại (Chức năng 6)
  updateBudgetStats();

  // 5. Cập nhật danh sách tháng trong dropdown lọc
  updateMonthFilterOptions();

  // 6. Hiển thị danh sách giao dịch lên bảng (Chức năng 2)
  renderTransactionList(filteredList);
}

// ------------------------------------------------------------------------------
// KHỞI TẠO ỨNG DỤNG & ĐĂNG KÝ SỰ KIỆN KHI TẢI TRANG
// ------------------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // 1. Tải dữ liệu từ localStorage
  loadData();

  // 2. Điền danh mục cố định vào form chọn danh mục và bộ lọc
  const danhMucSelect = document.getElementById("danh-muc");
  const filterDanhMucSelect = document.getElementById("filter-danh-muc");

  if (danhMucSelect) {
    danhMucSelect.innerHTML = DANH_MUC.map(
      cat => `<option value="${cat}">${cat}</option>`
    ).join("");
  }

  if (filterDanhMucSelect) {
    filterDanhMucSelect.innerHTML =
      '<option value="all">Tất cả danh mục</option>' +
      DANH_MUC.map(cat => `<option value="${cat}">${cat}</option>`).join("");
  }

  // 3. Đặt ngày mặc định cho form là hôm nay
  const ngayInput = document.getElementById("ngay");
  if (ngayInput) {
    ngayInput.value = getTodayString();
    ngayInput.max = getTodayString(); // Chặn người dùng chọn ngày tương lai trên datepicker
  }

  // 4. Bộ đếm ký tự cho ô mô tả
  const moTaInput = document.getElementById("mo-ta");
  const moTaCounter = document.getElementById("mo-ta-counter");
  if (moTaInput && moTaCounter) {
    moTaInput.addEventListener("input", () => {
      moTaCounter.textContent = `${moTaInput.value.length}/50`;
    });
  }

  // 5. Sự kiện submit form giao dịch (Thêm mới hoặc Cập nhật)
  const transactionForm = document.getElementById("transaction-form");
  if (transactionForm) {
    transactionForm.addEventListener("submit", e => {
      e.preventDefault();
      if (editingId === null) {
        addExpense();
      } else {
        updateExpense();
      }
    });
  }

  // 6. Nút Hủy chế độ sửa
  const cancelBtn = document.getElementById("cancel-btn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      cancelEdit();
    });
  }

  // 7. Sự kiện thay đổi bộ lọc (Loại, Danh mục, Tháng)
  const filterLoai = document.getElementById("filter-loai");
  const filterDanhMuc = document.getElementById("filter-danh-muc");
  const filterThang = document.getElementById("filter-thang");
  const resetFilterBtn = document.getElementById("reset-filter-btn");

  if (filterLoai) {
    filterLoai.addEventListener("change", e => {
      filter.loai = e.target.value;
      render();
    });
  }

  if (filterDanhMuc) {
    filterDanhMuc.addEventListener("change", e => {
      filter.danhMuc = e.target.value;
      render();
    });
  }

  if (filterThang) {
    filterThang.addEventListener("change", e => {
      filter.thang = e.target.value;
      render();
    });
  }

  if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", () => {
      filter.loai = "all";
      filter.danhMuc = "all";
      filter.thang = "all";
      if (filterLoai) filterLoai.value = "all";
      if (filterDanhMuc) filterDanhMuc.value = "all";
      if (filterThang) filterThang.value = "all";
      render();
      showToast("Đã đặt lại bộ lọc về mặc định", "info");
    });
  }

  // 8. Render lần đầu tiên khi mở trang
  render();
});
