$(document).ready(function() {
    const selectedCourseId = sessionStorage.getItem("selectedCourseId");
    const mainVideo = $("#mainVideo");
    const token = localStorage.getItem("token"); // Lấy token từ localStorage

    if (!selectedCourseId) {
        alert("Chưa chọn khóa học");
        return;
    }

    if (!token) {
        alert("Vui lòng đăng nhập để xem khóa học");
        window.location.href = "/pages/login.html"; // Chuyển về trang login nếu chưa có token
        return;
    }

    // Call API lấy chi tiết khóa học với token
    $.ajax({
        url: `http://localhost:8080/api/v1/courses/courseDetails/${selectedCourseId}`,
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}` // Thêm token vào header
        },
        success: function(res) {
            if (res.code === 1000) {
                const course = res.result;

                // Hiển thị video demo ban đầu
                mainVideo.find("source").attr("src", course.videoDemo);
                mainVideo[0].load();

                // Render modules và lessons
                const modulesContainer = $("#modulesContainer");
                modulesContainer.empty();

                // Sắp xếp module theo tên A -> Z
                course.modules.sort((a, b) => a.nameModule.localeCompare(b.nameModule));

                course.modules.forEach(module => {
                    let moduleHtml = `
                        <div class="module">
                            <div class="module-header" onclick="toggleModule(this)">
                                <div class="module-title">${module.nameModule}</div>
                                <div class="info">${module.lessons.length} bài học • ${module.timeModule} giờ</div>
                                <i class="fa-solid fa-chevron-down"></i>
                            </div>
                            <div class="lesson-list" style="display:none">
                    `;

                    // Sắp xếp lesson theo timeLesson tăng dần
                    module.lessons.sort((a, b) => a.timeLesson - b.timeLesson);

                    // Thêm số thứ tự cho lesson
                    module.lessons.forEach((lesson, index) => {
                        moduleHtml += `<div class="lesson" data-video="${lesson.videoURL}">${index + 1}. ${lesson.lessonTitle} (${lesson.timeLesson} phút)</div>`;
                    });

                    moduleHtml += `</div></div>`;
                    modulesContainer.append(moduleHtml);
                });

                // Khi click vào lesson đổi video và highlight lesson đang phát
                $(".lesson").click(function() {
                    const videoUrl = $(this).data("video");
                    mainVideo.find("source").attr("src", videoUrl);
                    mainVideo[0].load();
                    mainVideo[0].play();

                    // Remove highlight các lesson khác
                    $(".lesson").removeClass("active-lesson");
                    $(this).addClass("active-lesson");
                });
            }
        },
        error: function(err) {
            console.error(err);
            if (err.status === 401) {
                alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
                window.location.href = "/pages/login.html";
            } else {
                alert("Lỗi khi tải chi tiết khóa học");
            }
        }
    });
});

// Ẩn/hiện module
function toggleModule(element) {
    const module = element.parentElement;
    const lessons = module.querySelector('.lesson-list');
    const icon = element.querySelector('i.fa-chevron-down');

    if (lessons.style.display === 'block') {
        lessons.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        lessons.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}
