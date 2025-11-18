$(document).ready(function () {
  const token = localStorage.getItem("token"); // JWT token
  const bookingsPerPage = 6;
  let bookings = [];
  let currentPage = 1;
  let currentStatus = "all"; // "all" mặc định

  // ==========================
  // Load bookings từ API
  // ==========================
  function loadBookings() {
    $.ajax({
      // nếu bạn muốn lấy ALL bookings cho mentor dùng endpoint sau:
      url: "http://localhost:8080/api/v1/bookings/mentor/all",
      // nếu bạn vẫn muốn filter theo ngày, đổi lại thành:
      // url: "http://localhost:8080/api/v1/bookings/mentor?startDate=2025-11-16&endDate=2025-12-16",
      type: "GET",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function (res) {
        // backend có thể trả về res.result hoặc res.data, mình xử lý an toàn:
        bookings = res.result || res.data || [];
        currentPage = 1;
        renderTable();
      },
      error: function (err) {
        console.error("Lỗi khi tải booking:", err);
        // bạn có thể show message lên UI nếu cần
      },
    });
  }

  // ==========================
  // Render table
  // ==========================
  function renderTable() {
    const tbody = $("#bookingTable tbody");
    tbody.empty();

    const searchTerm = ($("#searchInput").val() || "").toLowerCase();

    const filtered = bookings.filter((b) => {
      const name = (b.studentName || "").toLowerCase();
      const email = (b.studentEmail || "").toLowerCase();
      const topic = (b.topic || "").toLowerCase();
      const note = (b.note || "").toLowerCase();
      const statusRaw = (b.status || "").toString();
      const status = statusRaw.toUpperCase(); // chuẩn hóa

      const matchSearch =
        name.includes(searchTerm) ||
        email.includes(searchTerm) ||
        topic.includes(searchTerm) ||
        note.includes(searchTerm);

      const matchStatus =
        currentStatus === "all" ||
        status === (currentStatus || "").toString().toUpperCase();

      return matchSearch && matchStatus;
    });

    const start = (currentPage - 1) * bookingsPerPage;
    const pageData = filtered.slice(start, start + bookingsPerPage);

    if (pageData.length === 0) {
      tbody.append(`
        <tr><td colspan="6" style="text-align:center; color:#777;">Không có dữ liệu hiển thị</td></tr>
      `);
    } else {
      pageData.forEach((b) => {
        const statusClassMap = {
          PENDING: "status-pending",
          CONFIRMED: "status-approved", // backend dùng CONFIRMED thay cho APPROVED
          COMPLETED: "status-completed",
          CANCELLED: "status-cancelled",
        };

        const statusRaw = (b.status || "").toString().toUpperCase();
        const statusClass = statusClassMap[statusRaw] || "";

        // Dropdown menu theo trạng thái (so sánh bằng chữ hoa)
        let dropdownMenu = "";
        if (statusRaw === "PENDING") {
          dropdownMenu = `
            <a href="#" class="approveBtn">Xác nhận</a>
            <a href="#" class="cancelBtn">Hủy</a>
          `;
        } else if (statusRaw === "CONFIRMED") {
          dropdownMenu = `
            <a href="#" class="completeBtn">Hoàn thành</a>
            <a href="#" class="cancelBtn">Hủy</a>
          `;
        } else {
          dropdownMenu = `<span style="color:#777;">-</span>`;
        }

        const row = `
          <tr data-id="${b.bookingId}">
            <td>${b.studentName || "-"}</td>
            <td>${b.studentEmail || "-"}</td>
            <td>${b.topic || "-"}</td>
            <td>${b.note || "-"}</td>
            <td><span class="status ${statusClass}">${b.statusDisplay || b.status || statusRaw}</span></td>
            <td>
              <div class="dropdown">
                <button class="dropbtn">⋮</button>
                <div class="dropdown-content">${dropdownMenu}</div>
              </div>
            </td>
          </tr>
        `;
        tbody.append(row);
      });
    }

    renderPagination(filtered.length);
  }

  // ==========================
  // Phân trang
  // ==========================
  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / bookingsPerPage);
    const container = $("#pagination");
    container.empty();

    if (totalPages <= 1) return;

    const prevBtn = $('<button class="page-btn">&laquo;</button>').prop(
      "disabled",
      currentPage === 1
    );
    container.append(prevBtn);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    // nếu endPage nhỏ hơn currentPage + 2 thì điều chỉnh startPage lại (để hiển thị luôn 5 nút khi có thể)
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      const btn = $(`<button class="page-btn">${i}</button>`);
      if (i === currentPage) btn.addClass("active");
      container.append(btn);
    }

    const nextBtn = $('<button class="page-btn">&raquo;</button>').prop(
      "disabled",
      currentPage === totalPages
    );
    container.append(nextBtn);

    $(".page-btn").off("click").on("click", function () {
      const text = $(this).text();
      if (text === "«" && currentPage > 1) currentPage--;
      else if (text === "»" && currentPage < totalPages) currentPage++;
      else if (!isNaN(parseInt(text))) currentPage = parseInt(text);
      renderTable();
    });
  }

  // ==========================
  // Tab chuyển trạng thái
  // ==========================
  $(".tab-btn").on("click", function () {
    $(".tab-btn").removeClass("active");
    $(this).addClass("active");
    // Lấy data-status từ HTML; người dùng có thể truyền "all", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"
    currentStatus = $(this).data("status");
    currentPage = 1;
    renderTable();
  });

  // ==========================
  // Search realtime
  // ==========================
  $("#searchInput").on("keyup", function () {
    currentPage = 1;
    renderTable();
  });

  // ==========================
  // Dropdown toggle
  // ==========================
  $(document).on("click", ".dropbtn", function (e) {
    e.stopPropagation();
    const dropdown = $(this).siblings(".dropdown-content");
    $(".dropdown-content").not(dropdown).hide();
    dropdown.toggle();
  });

  $(document).on("click", function () {
    $(".dropdown-content").hide();
  });

  // ==========================
  // Xác nhận booking
  // ==========================
  $("#bookingTable").on("click", ".approveBtn", function (e) {
    e.preventDefault();
    const id = $(this).closest("tr").data("id");
    if (!confirm("Xác nhận booking này?")) return;

    $.ajax({
      url: `http://localhost:8080/api/v1/bookings/${id}/confirm`,
      type: "PUT",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function () {
        alert("✅ Booking đã được xác nhận!");
        loadBookings();
      },
      error: function (xhr) {
        console.error("Lỗi khi xác nhận booking:", xhr);
        alert("❌ Lỗi khi xác nhận booking!");
      },
    });
  });

  // ==========================
  // Hoàn thành booking
  // ==========================
  $("#bookingTable").on("click", ".completeBtn", function (e) {
    e.preventDefault();
    const id = $(this).closest("tr").data("id");
    if (!confirm("Đánh dấu booking hoàn thành?")) return;

    $.ajax({
      url: `http://localhost:8080/api/v1/bookings/${id}/complete`,
      type: "PUT",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function () {
        alert("✅ Booking đã hoàn thành!");
        loadBookings();
      },
      error: function (xhr) {
        console.error("Lỗi khi hoàn thành booking:", xhr);
        alert("❌ Lỗi khi hoàn thành booking!");
      },
    });
  });

  // ==========================
  // Hủy booking
  // ==========================
  $("#bookingTable").on("click", ".cancelBtn", function (e) {
    e.preventDefault();
    const id = $(this).closest("tr").data("id");
    const reason = prompt("Nhập lý do hủy booking:");
    if (!reason) return;

    $.ajax({
      url: `http://localhost:8080/api/v1/bookings/${id}/cancel?reason=${encodeURIComponent(reason)}`,
      type: "PUT",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function () {
        alert("✅ Booking đã bị hủy!");
        loadBookings();
      },
      error: function (xhr) {
        console.error("Lỗi khi hủy booking:", xhr);
        alert("❌ Lỗi khi hủy booking!");
      },
    });
  });

  // ==========================
  // Khởi chạy lần đầu
  // ==========================
  loadBookings();
});
