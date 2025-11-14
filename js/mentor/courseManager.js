$(document).ready(function () {
  const token = localStorage.getItem("token");
  const coursesPerPage = 8;
  let courses = [];
  let currentPage = 1;

  // ==========================
  // Load courses
  // ==========================
  function loadCourses() {

      const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.userId;

    if (!userId) {
      console.error("Không tìm thấy userId trong userData!");
      return;
    }

    $.ajax({
      url: `http://localhost:8080/api/v1/courses/by-user/${userId}`,
      type: "GET",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function (res) {
        courses = res.result || [];
        currentPage = 1;
        renderTable();
      },
      error: function (err) {
        console.error("Lỗi khi tải danh sách khóa học:", err);
      },
    });
  }

  // ==========================
  // Render table
  // ==========================
  function renderTable() {
    const tbody = $("#courseTable tbody");
    tbody.empty();

    const searchTerm = ($("#searchInput").val() || "").toLowerCase();

    const filtered = courses.filter((c) => {
      const title = (c.titleCourse || "").toLowerCase();
      const level = (c.level || "").toLowerCase();
      return title.includes(searchTerm) || level.includes(searchTerm);
    });

    const start = (currentPage - 1) * coursesPerPage;
    const pageData = filtered.slice(start, start + coursesPerPage);

    if (pageData.length === 0) {
      tbody.append(`
        <tr><td colspan="7" style="text-align:center; color:#777;">Không có dữ liệu hiển thị</td></tr>
      `);
    } else {
      pageData.forEach((course, index) => {
        const row = `
          <tr data-id="${course.courseId}">
            <td>${start + index + 1}</td>
            <td>${course.titleCourse || "-"}</td>
            <td>${course.priceCourse ? course.priceCourse.toLocaleString("vi-VN") + " đ" : "-"}</td>
            <td>${course.timeCourse ? course.timeCourse + " giờ" : "-"}</td>
            <td>${course.level || "-"}</td>
            <td>${course.enrolledCount || 0}</td>
            <td>
              <div class="dropdown">
                <button class="dropbtn">⋮</button>
                <div class="dropdown-content">
                  <a href="/pages/mentor/DetailCourse.html" class="detailBtn">Chi tiết</a>
                  <a href="#" class="deleteBtn">Xóa</a>
                </div>
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
    const totalPages = Math.ceil(totalItems / coursesPerPage);
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
  // Delete course
  // ==========================
  $("#courseTable").on("click", ".deleteBtn", function (e) {
    e.preventDefault();
    const id = $(this).closest("tr").data("id");
    if (!confirm("Bạn có chắc muốn xóa khóa học này không?")) return;

    $.ajax({
      url: `http://localhost:8080/api/v1/courses/${id}`,
      type: "DELETE",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function () {
        alert("🗑️ Khóa học đã bị xóa thành công!");
        loadCourses();
      },
      error: function (xhr) {
        console.error("Lỗi khi xóa khóa học:", xhr);
        alert("❌ Lỗi khi xóa khóa học!");
      },
    });
  });

  //chuyen sang chi tiet course

  $("#courseTable").on("click", ".detailBtn", function (e) {
  e.preventDefault();
  const id = $(this).closest("tr").data("id");
  window.location.href = `/pages/mentor/courseDetail.html?id=${id}`;
});


  // ==========================
  // Khởi chạy
  // ==========================
  loadCourses();
});
