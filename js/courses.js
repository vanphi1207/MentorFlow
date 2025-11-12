let currentPage = 1; 
const pageSize = 6;     
let allCourses = []; 



$(document).ready(function () {
  const apiUrl = "http://localhost:8080/api/v1/courses";
  const token = localStorage.getItem("token");

  $.ajax({
  url: apiUrl,
  type: "GET",
  headers: {
    "Authorization": token ? "Bearer " + token : "",
    "Content-Type": "application/json"
  },
  success: function (response) {
    allCourses = response.result;
    renderPage(currentPage); // Render trang đầu tiên
    renderPagination();      // Tạo nút phân trang
  },
  error: function (xhr) {
    console.error("Lỗi khi gọi API:", xhr);
    $(".courses-grid").html(
      `<p style="color:red;">Không thể tải danh sách khóa học. (${xhr.status})</p>`
    );
  }
});


  

 function renderPage(page) {
  const container = $(".courses-grid");
  container.empty();

  if (!allCourses || allCourses.length === 0) {
    container.html("<p>Hiện chưa có khóa học nào.</p>");
    return;
  }

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const coursesToShow = allCourses.slice(start, end);

  coursesToShow.forEach(course => {
    const thumbnail = course.thumbnailImg || "/public/assets/images/hero.jpg";
    const title = course.titleCourse;
    const desc = course.description;
    const price = course.priceCourse
      ? course.priceCourse.toLocaleString() + "₫"
      : "Miễn phí";
    const courseId = course.courseId;

    const courseCard = `
      <div class="course-card">
        <div class="course-image">
          <img src="${thumbnail}" alt="${title}" onerror="this.src='/public/assets/images/hero.jpg';"/>
        </div>
        <div class="course-info">
          <span class="course-category">${course.level || "Khóa học"}</span>
          <a href="/pages/detailCourse.html?id=${courseId}">
            <h3 class="course-title">${title}</h3>
          </a>
          <p class="course-description">${desc}</p>
          <div class="course-meta">
            <span class="course-rating">⭐ 4.7</span>
            <span class="course-students">${course.enrolledCount || 0} học viên</span>
          </div>
          <div class="course-footer">
            <div class="course-price">${price}</div>
            <button class="buy-btn">Mua ngay</button>
          </div>
        </div>
      </div>
    `;
    container.append(courseCard);
  });
}

function renderPagination() {
  const paginationList = $("#paginationList");
  paginationList.empty();

  const totalPages = Math.ceil(allCourses.length / pageSize);

  for (let i = 1; i <= totalPages; i++) {
    const li = $(`
      <li class="pagination__item ${i === currentPage ? "pagination__item--active" : ""}">
        <a href="#" class="pagination__link" data-page="${i}">${i}</a>
      </li>
    `);
    paginationList.append(li);
  }

  // Sự kiện click cho từng trang
  $(".pagination__link").click(function (e) {
    e.preventDefault();
    const page = parseInt($(this).data("page"));
    if (page && page !== currentPage) {
      currentPage = page;
      renderPage(currentPage);
      renderPagination(); // cập nhật active class
    }
  });
}


});
