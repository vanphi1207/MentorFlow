// Lấy tất cả nút START COURSE
const startButtons = document.querySelectorAll(".start-course");

// Gắn sự kiện click cho từng nút
startButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Lấy ID khóa học từ thuộc tính data-id của thẻ cha
    const courseId = button.closest(".course-card").getAttribute("data-id");

    // Lưu thông tin tạm vào localStorage (để sang trang khác đọc lại)
    localStorage.setItem("selectedCourseId", courseId);
  });
});
