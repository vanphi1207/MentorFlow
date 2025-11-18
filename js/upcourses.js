$(document).ready(function () {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Vui lòng đăng nhập để xem khóa học");
        window.location.href = "/pages/login.html";
        return;
    }

    loadMyCourses();

    function loadMyCourses() {
        $.ajax({
            url: "http://localhost:8080/api/v1/payment/my-payments/status/SUCCESS",
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (response) {
                loadCourseDetails(response.result);
            },
            error: function () {
                $("#courseList").html("<p>Lỗi khi tải khóa học.</p>");
            }
        });
    }

    // 🔥 Call API courseDetails + merge data
    function loadCourseDetails(payments) {
        if (!payments || payments.length === 0) {
            $("#courseList").html("<p>Bạn chưa mua khóa học nào.</p>");
            return;
        }

        let promises = payments.map(item => {
            return $.ajax({
                url: `http://localhost:8080/api/v1/courses/courseDetails/${item.courseId}`,
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
        });

        // Khi tất cả API detail xong → render
        Promise.all(promises)
            .then(results => {
                const courses = results.map(r => r.result);
                renderCourses(courses);
            })
            .catch(() => {
                $("#courseList").html("<p>Lỗi khi tải dữ liệu chi tiết khóa học.</p>");
            });
    }

    // 🧩 Render giao diện
    function renderCourses(courses) {
        let html = "";

        courses.forEach(course => {
            html += `
                <div class="course-card" data-id="${course.courseId}">
                    <img src="${course.thumbnailImg}" alt="${course.titleCourse}" class="course-image">

                    <div class="course-info">
                        <a href="/pages/updetailcourses.html?id=${course.courseId}" class="course-title-link">
                            <h3>${course.titleCourse}</h3>
                        </a>

                        <p>Giảng viên: ${course.mentorName}</p>

                        <div class="rating">★★★★★</div>
                    </div>
                </div>
            `;
        });

        $("#courseList").html(html);
    }
});
