$(document).ready(function () {
  const token = localStorage.getItem("token");
  const urlParams = new URLSearchParams(window.location.search);
  const courseId = urlParams.get("id");

  if (!courseId) {
    $(".container").html("<p style='color:red;'>Không tìm thấy khóa học.</p>");
    return;
  }

  // Call API lấy chi tiết khóa học
  $.ajax({
    url: `http://localhost:8080/api/v1/courses/courseDetails/${courseId}`,
    type: "GET",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json"
    },
    success: function (response) {
      const course = response.result;
      if (!course) return;

      // Thông tin khóa học
      $(".left-section h2").text(course.titleCourse);
      $(".description").text(course.description);
      $(".current-price").text(course.priceCourse.toLocaleString() + "₫");

      // Cập nhật meta
      $(".meta-item:contains('Trình độ') span").text(course.level);
      $(".meta-item:contains('Bài học') span").text(
        course.modules.reduce((sum, m) => sum + (m.lessons?.length || 0), 0)
      );
      $(".meta-item:contains('⏱️') span").text(course.timeCourse + " giờ");
      $(".meta-item:contains('học viên')").text(course.enrolledCount + " học viên");

      // Hiển thị curriculum
      const curriculumContainer = $(".curriculum");
      curriculumContainer.empty();

      if (course.modules && course.modules.length > 0) {
        course.modules.forEach((module, index) => {
          const lessonsHTML = module.lessons.length
            ? module.lessons
                .map(
                  (lesson) =>
                    `<div class="lesson-item">📹 ${lesson.lessonTitle} (${lesson.timeLesson} phút)</div>`
                )
                .join("")
            : "<p>Chưa có bài học.</p>";

          const moduleHTML = `
            <div class="curriculum-item module-item">
              <div class="module-header" onclick="toggleModule(this)">
                <div>
                  <strong>Module ${index + 1}:</strong> ${module.nameModule}
                  <span class="lesson-count">${module.lessons.length} bài học • ${module.timeModule} phút</span>
                </div>
                <span class="toggle-icon">▼</span>
              </div>
              <div class="lesson-list" style="display:none;">${lessonsHTML}</div>
            </div>
          `;

          curriculumContainer.append(moduleHTML);
        });
      } else {
        curriculumContainer.html("<p>Chưa có nội dung khóa học.</p>");
      }
    },
    error: function (xhr) {
      $(".container").html(
        `<p style="color:red;">Không thể tải khóa học. Mã lỗi: ${xhr.status}</p>`
      );
    },
  });
});

// Toggle module hiển thị/ẩn lesson
function toggleModule(header) {
  const list = $(header).next(".lesson-list");
  const icon = $(header).find(".toggle-icon");

  // Đóng tất cả module khác
  $(".lesson-list").not(list).slideUp();
  $(".toggle-icon").not(icon).text("►");

  // Mở/đóng module hiện tại
  list.slideToggle();
  icon.text(list.is(":visible") ? "▼" : "►");
}
