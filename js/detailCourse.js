$(document).ready(function () {
  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  if (!courseId) {
    $(".container").html("<p style='color:red;'>Không tìm thấy khóa học.</p>");
    return;
  }

  let mentorId = null; // Biến lưu mentorId

  $.ajax({
    url: `http://localhost:8080/api/v1/courses/courseDetails/${courseId}`,
    type: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    },
    success: function (response) {
      if (!response || !response.result) return;

      const course = response.result;

      // Lấy mentorId và mentorName
      mentorId = course.mentorId;
      const mentorName = course.mentorName;

      console.log("Mentor ID:", mentorId);
      console.log("Mentor Name:", mentorName);

      // Thông tin khóa học
      $(".left-section h2").text(course.titleCourse);
      $(".description").text(course.description);
      $(".current-price").text(course.priceCourse.toLocaleString() + "₫");
      $(".time").text(course.timeCourse + " giờ");
      if (course.videoDemo) {
                $(".video-container iframe").attr("src", course.videoDemo);
            } else {
                $(".video-container iframe").attr("src", "");
            }

      // Cập nhật meta
      $(".meta-item:contains('Trình độ') span").text(course.level);
      $(".meta-item:contains('Bài học') span").text(
        course.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 0
      );
      $(".meta-item:contains('⏱️') span").text(course.timeCourse + " giờ");
      $(".meta-item:contains('học viên')").text(course.enrolledCount + " học viên");

      // Hiển thị curriculum
      const curriculumContainer = $(".curriculum");
      curriculumContainer.empty();

      if (course.modules && course.modules.length > 0) {
        course.modules.forEach((module, index) => {
          const lessonsHTML = module.lessons && module.lessons.length
            ? module.lessons
                .map(
                  (lesson) =>
                    `<a href="${lesson.lessonUrl || '#'}" class="lesson-item">📹 ${lesson.lessonTitle} (${lesson.timeLesson} phút)</a>`
                )
                .join("")
            : "<p>Chưa có bài học.</p>";

          const moduleHTML = `
            <div class="curriculum-item module-item">
              <div class="module-header">
                <div>
                  <strong>Module ${index + 1}:</strong> ${module.nameModule}
                  <span class="lesson-count">${module.lessons?.length || 0} bài học • ${module.timeModule || 0} phút</span>
                </div>
                <span class="toggle-icon">►</span>
              </div>
              <div class="lesson-list">${lessonsHTML}</div>
            </div>
          `;

          curriculumContainer.append(moduleHTML);
        });
      } else {
        curriculumContainer.html("<p>Chưa có nội dung khóa học.</p>");
      }

      // Hiển thị tên giảng viên tạm thời
      $(".instructor-card h3").text(mentorName);

      // ==========================
      // Gọi API mentor để lấy avatar
      // ==========================
      if (mentorId) {
        $.ajax({
          url: `http://localhost:8080/api/v1/mentor/${mentorId}`,
          type: "GET",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json"
          },
          success: function (mentorResponse) {
            if (!mentorResponse || !mentorResponse.result) return;
            const mentor = mentorResponse.result;

            // Cập nhật avatar giảng viên
            $(".instructor-card .instructor-avatar").attr("src", mentor.avatar || "https://i.pravatar.cc/150?img=12");
            $(".instructor-card h3").text(mentor.name || mentorName);
          },
          error: function (xhr) {
            console.error("Lỗi API mentor:", xhr.status, xhr.responseText);
          }
        });
      }
    },
    error: function (xhr) {
      console.error("API error:", xhr.status, xhr.responseText);
      $(".container").html(
        `<p style="color:red;">Không thể tải khóa học. Mã lỗi: ${xhr.status}</p>`
      );
    },
  });
});

// Toggle module hiển thị/ẩn lesson
$(document).on("click", ".module-header", function () {
  const moduleItem = $(this).closest(".module-item");
  const icon = $(this).find(".toggle-icon");

  // Đóng tất cả module khác
  $(".module-item").not(moduleItem).removeClass("active");

  // Toggle module hiện tại
  moduleItem.toggleClass("active");

  // Cập nhật icon
  icon.text(moduleItem.hasClass("active") ? "▼" : "►");
  $(".module-item").not(moduleItem).find(".toggle-icon").text("►");
});




// ==========================
// XỬ LÝ NÚT MUA NGAY
// ==========================
// Khi click "Mua Ngay" trên trang detailCourse
$(".btn-primary").on("click", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id");
    if (!courseId) return;

    // Lấy cart từ sessionStorage, nếu chưa có thì tạo mới
    let cart = JSON.parse(sessionStorage.getItem("cart") || "[]");

    // Chỉ thêm nếu chưa tồn tại
    if (!cart.includes(courseId)) {
        cart.push(courseId);
    }

    // Lưu lại sessionStorage
    sessionStorage.setItem("cart", JSON.stringify(cart));

    // Chuyển hướng qua trang cart
    window.location.href = "/pages/cart.html";
});