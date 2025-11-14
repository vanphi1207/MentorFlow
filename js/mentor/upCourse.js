$(document).ready(function () {
    const form = $("#uploadForm");

    form.on("submit", function (e) {
        e.preventDefault();

        // Lấy dữ liệu từ form
        const titleCourse = $("#titleCourse").val().trim();
        const description = $("#description").val().trim();
        const price = $("#priceCourse").val();
        const timeCourse = $("#timeCourse").val();
        const level = $("#level").val();

        // Tạo object JSON đúng với CourseCreationRequest
        const data = {
            titleCourse: titleCourse,
            description: description,
            priceCourse: price ? parseFloat(price) : 0,
            timeCourse: timeCourse ? parseInt(timeCourse) : 0,
            level: level,                 // BEGINNER / INTERMEDIATE / ADVANCED
            enrolledCount: 0
        };

        console.log("DATA SEND:", data);

        const fileImg = $("#thumbnailImg")[0].files[0];
        const fileVideo = $("#videoDemo")[0].files[0];

        const formData = new FormData();

        formData.append(
            "data",
            new Blob([JSON.stringify(data)], { type: "application/json" })
        );

        if (fileImg) formData.append("fileImg", fileImg);
        if (fileVideo) formData.append("fileVideo", fileVideo);

        const token = localStorage.getItem("token");

        $.ajax({
            url: "http://localhost:8080/api/v1/courses",
            type: "POST",
            data: formData,
            contentType: false,
            processData: false,
            headers: {
                Authorization: `Bearer ${token}`
            },
            success: function (response) {
                alert("Tạo khóa học thành công!");
                form.trigger("reset");
            },
            error: function (xhr) {
                console.error("Status:", xhr.status);
                console.error("Response:", xhr.responseText);
                console.error("JSON:", xhr.responseJSON);

                const msg = xhr.responseJSON?.message || "Tạo khóa học thất bại!";
                alert(msg);
            }
        });
    });
});
