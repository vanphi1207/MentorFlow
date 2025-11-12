$(document).ready(function () {
  const token = localStorage.getItem("token");
  const mentorsPerPage = 6;
  let mentors = [];
  let currentPage = 1;
  let currentStatus = "all";

  // ==========================
  // Load mentors
  // ==========================
  function loadMentors() {
    $.ajax({
      url: "http://localhost:8080/api/v1/admin/mentor-requests",
      type: "GET",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function (res) {
        mentors = res.result || [];
        currentPage = 1;
        renderTable();
      },
      error: function (err) {
        console.error("Lỗi khi tải danh sách mentor:", err);
      },
    });
  }

  // ==========================
  // Render table
  // ==========================
  function renderTable() {
    const tbody = $("#mentorTable tbody");
    tbody.empty();

    const searchTerm = ($("#searchInput").val() || "").toLowerCase();

    const filtered = mentors.filter((m) => {
      const name = (m.name || "").toLowerCase();
      const company = (m.companyName || "").toLowerCase();
      const position = (m.position || "").toLowerCase();
      const field = (m.field || "").toLowerCase();
      const status = (m.status || "").toLowerCase();

      const matchSearch =
        name.includes(searchTerm) ||
        company.includes(searchTerm) ||
        position.includes(searchTerm) ||
        field.includes(searchTerm) ||
        status.includes(searchTerm);

      const matchStatus =
        currentStatus === "all" || status === currentStatus;

      return matchSearch && matchStatus;
    });

    const start = (currentPage - 1) * mentorsPerPage;
    const pageData = filtered.slice(start, start + mentorsPerPage);

    if (pageData.length === 0) {
      tbody.append(`
        <tr><td colspan="8" style="text-align:center; color:#777;">Không có dữ liệu hiển thị</td></tr>
      `);
    } else {
      pageData.forEach((mentor) => {
        const status = (mentor.status || "").toLowerCase();
        let statusClass = "";
        if (status === "approved") statusClass = "status-approved";
        else if (status === "pending") statusClass = "status-pending";
        else if (status === "rejected") statusClass = "status-rejected";

        // Xác định nội dung dropdown
        let dropdownMenu = `
          <a href="#" class="deleteBtn">Xóa</a>
        `;

        if (status === "pending") {
          dropdownMenu = `
            <a href="#" class="approveBtn">Duyệt</a>
            <a href="#" class="rejectBtn">Từ chối</a>
          `;
        }

        const row = `
          <tr data-id="${mentor.id}">
            <td>${mentor.name || "-"}</td>
            <td>${mentor.companyName || "-"}</td>
            <td>${mentor.position || "-"}</td>
            <td>${mentor.field || "-"}</td>
            <td>${mentor.softSkills || "-"}</td>
            <td><span class="status ${statusClass}">${mentor.status || "-"}</span></td>
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
  // Pagination
  // ==========================
  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / mentorsPerPage);
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
  // Dropdown click toggle
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
  // Approve / Reject mentor
  // ==========================
  $("#mentorTable").on("click", ".approveBtn", function (e) {
    e.preventDefault();
    const id = $(this).closest("tr").data("id");
    if (!confirm("Duyệt mentor này?")) return;
    $.ajax({
      url: `http://localhost:8080/api/v1/admin/mentor-requests/${id}/approve`,
      type: "PUT",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function () {
        alert("✅ Đã duyệt mentor thành công!");
        loadMentors();
      },
      error: function () {
        alert("❌ Lỗi khi duyệt mentor!");
      },
    });
  });

  $("#mentorTable").on("click", ".rejectBtn", function (e) {
    e.preventDefault();
    const id = $(this).closest("tr").data("id");
    if (!confirm("Từ chối mentor này?")) return;
    $.ajax({
      url: `http://localhost:8080/api/v1/admin/mentor-requests/${id}/reject`,
      type: "PUT",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function () {
        alert("✅ Đã từ chối mentor!");
        loadMentors();
      },
      error: function () {
        alert("❌ Lỗi khi từ chối mentor!");
      },
    });
  });


    // ==========================
  // Delete mentor
  // ==========================
  $("#mentorTable").on("click", ".deleteBtn", function (e) {
    e.preventDefault();
    const id = $(this).closest("tr").data("id");

    if (!confirm("Bạn có chắc muốn xóa mentor này không?")) return;

    $.ajax({
      url: `http://localhost:8080/api/v1/admin/mentor-requests/${id}`,
      type: "DELETE",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function () {
        alert("🗑️ Mentor đã bị xóa thành công!");
        loadMentors(); // Reload lại bảng
      },
      error: function (xhr) {
        console.error("Lỗi khi xóa mentor:", xhr);
        alert("❌ Lỗi khi xóa mentor!");
      },
    });
  });


  // ==========================
  // Khởi chạy
  // ==========================
  loadMentors();
});
