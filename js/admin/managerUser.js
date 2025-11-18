$(document).ready(function () {
  const token = localStorage.getItem("token");
  const usersPerPage = 8;
  let users = [];
  let currentPage = 1;

  // ==========================
  // Load users
  // ==========================
  function loadUsers() {
    $.ajax({
      url: "http://localhost:8080/api/v1/users",
      type: "GET",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function (res) {
        users = res.result || [];
        currentPage = 1;
        renderTable();
      },
      error: function (err) {
        console.error("Lỗi khi tải danh sách user:", err);
      },
    });
  }

  // ==========================
  // Render table
  // ==========================
  function renderTable() {
    const tbody = $("#userTable tbody");
    tbody.empty();

    const searchTerm = ($("#searchInput").val() || "").toLowerCase();

    const filtered = users.filter((u) => {
      const username = (u.username || "").toLowerCase();
      const name = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
      const email = (u.email || "").toLowerCase();
      const gender = (u.genderDisplay || "").toLowerCase();
      return (
        username.includes(searchTerm) ||
        name.includes(searchTerm) ||
        email.includes(searchTerm) ||
        gender.includes(searchTerm)
      );
    });

    const start = (currentPage - 1) * usersPerPage;
    const pageData = filtered.slice(start, start + usersPerPage);

    if (pageData.length === 0) {
      tbody.append(`
        <tr><td colspan="7" style="text-align:center; color:#777;">Không có dữ liệu hiển thị</td></tr>
      `);
    } else {
      pageData.forEach((user, index) => {
        const row = `
          <tr data-id="${user.userId}">
            <td>${start + index + 1}</td>
            <td>${user.username || "-"}</td>
            <td>${(user.firstName || "") + " " + (user.lastName || "")}</td>
            <td>${user.email || "-"}</td>
            <td>${user.birthday || "-"}</td>
            <td>${user.genderDisplay || "-"}</td>
            <td>
              <div class="dropdown">
                <button class="dropbtn">⋮</button>
                <div class="dropdown-content">
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
    const totalPages = Math.ceil(totalItems / usersPerPage);
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
  // Dropdown click toggle
  // ==========================
  $(document).on("click", ".dropbtn", function(e){
    e.stopPropagation();
    const dropdown = $(this).siblings(".dropdown-content");
    $(".dropdown-content").not(dropdown).hide();
    dropdown.toggle();
  });

  $(document).on("click", function(){
    $(".dropdown-content").hide();
  });

  // ==========================
  // Delete user
  // ==========================
  $("#userTable").on("click", ".deleteBtn", function (e) {
    e.preventDefault();
    const id = $(this).closest("tr").data("id");
    if (!confirm("Bạn có chắc muốn xóa người dùng này không?")) return;

    $.ajax({
      url: `http://localhost:8080/api/v1/users/${id}`,
      type: "DELETE",
      headers: token ? { Authorization: "Bearer " + token } : {},
      success: function () {
        alert("🗑️ Người dùng đã bị xóa thành công!");
        loadUsers();
      },
      error: function (xhr) {
        console.error("Lỗi khi xóa user:", xhr);
        alert("❌ Lỗi khi xóa người dùng!");
      },
    });
  });

  // ==========================
  // Khởi chạy
  // ==========================
  loadUsers();
});
