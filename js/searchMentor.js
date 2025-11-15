$(document).ready(function () {
  loadMentors();

  // Search realtime
  $("#mentorSearch").on("input", function () {
    currentPage = 1; // reset về trang 1 khi search
    renderPage(currentPage);
    renderPagination();
  });
});

const mentorsPerPage = 12;
let currentPage = 1;
let mentorsData = [];

function loadMentors() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Không tìm thấy token. Hãy login trước!");
    return;
  }

  $.ajax({
    url: "http://localhost:8080/api/v1/admin/mentor-requests",
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    success: function (response) {
      console.log("API trả về:", response);
      mentorsData = response.result;
      renderPage(currentPage);
      renderPagination();
    },
    error: function (xhr) {
      console.error("Lỗi khi gọi API:", xhr);
      if (xhr.status === 401) console.log("→ LỖI 401: TOKEN KHÔNG HỢP LỆ / HẾT HẠN / SAI ROLE");
      if (xhr.status === 403) console.log("→ LỖI 403: BẠN KHÔNG CÓ QUYỀN GỌI API NÀY (CẦN ADMIN)");
    }
  });
}

// Filter mentors theo search input
function getFilteredMentors() {
  const keyword = $("#mentorSearch").val().toLowerCase();
  if (!keyword) return mentorsData;
  return mentorsData.filter(m => m.name.toLowerCase().includes(keyword));
}

function renderPage(page) {
  const container = $(".mentor-grid");
  container.empty();

  const filteredMentors = getFilteredMentors();
  const start = (page - 1) * mentorsPerPage;
  const end = start + mentorsPerPage;
  const pageMentors = filteredMentors.slice(start, end);

  pageMentors.forEach(mentor => {
    const card = $(`
      <a href="#" class="mentor-card">
        <img src="${mentor.avatar}" alt="${mentor.name}" class="mentor-card__image" />
        <h3 class="mentor-card__name">${mentor.name}</h3>
        <p class="mentor-card__position">${mentor.companyName}</p>
        <div class="mentor-card__info">
          <p><strong>Giá booking:</strong> ${mentor.priceBooking || "Chưa cập nhật"}</p>
        </div>
      </a>
    `);

    card.on("click", function (e) {
    e.preventDefault(); // ngăn link mặc định
    sessionStorage.setItem("selectedMentorId", mentor.id);
    sessionStorage.setItem("selectedUserId", mentor.userId);
    window.location.href = "/pages/profileMentor.html"; // chuyển sang trang profile
  });

    container.append(card);
  });
}

function renderPagination() {
  const pagination = $(".pagination__list");
  pagination.empty();

  const filteredMentors = getFilteredMentors();
  const totalPages = Math.ceil(filteredMentors.length / mentorsPerPage);

  // Nút "<<" (first)
  const first = $(`<li class="pagination__item"><a href="#" class="pagination__link">&laquo;</a></li>`);
  first.on("click", e => { e.preventDefault(); if (currentPage !== 1) { currentPage = 1; renderPage(currentPage); renderPagination(); }});
  pagination.append(first);

  // Nút "<" (prev)
  const prev = $(`<li class="pagination__item"><a href="#" class="pagination__link">&lt;</a></li>`);
  prev.on("click", e => { e.preventDefault(); if (currentPage > 1) { currentPage--; renderPage(currentPage); renderPagination(); }});
  pagination.append(prev);

  // Nút số trang
  for (let i = 1; i <= totalPages; i++) {
    const item = $(`
      <li class="pagination__item ${i === currentPage ? "pagination__item--active" : ""}">
        <a href="#" class="pagination__link">${i}</a>
      </li>
    `);
    item.on("click", e => { e.preventDefault(); currentPage = i; renderPage(currentPage); renderPagination(); });
    pagination.append(item);
  }

  // Nút ">" (next)
  const next = $(`<li class="pagination__item"><a href="#" class="pagination__link">&gt;</a></li>`);
  next.on("click", e => { e.preventDefault(); if (currentPage < totalPages) { currentPage++; renderPage(currentPage); renderPagination(); }});
  pagination.append(next);

  // Nút ">>" (last)
  const last = $(`<li class="pagination__item"><a href="#" class="pagination__link">&raquo;</a></li>`);
  last.on("click", e => { e.preventDefault(); if (currentPage !== totalPages) { currentPage = totalPages; renderPage(currentPage); renderPagination(); }});
  pagination.append(last);
}
