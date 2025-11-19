$(document).ready(function () {
    const token = localStorage.getItem("token");

    // Lấy courseId từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("id");

    if (!courseId) {
        alert("Không tìm thấy courseId!");
        return;
    }

    // =====================================================================
    //  LOAD COURSE DETAILS
    // =====================================================================
    function loadCourseDetails() {
        $.ajax({
            url: `http://localhost:8080/api/v1/courses/courseDetails/${courseId}`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            success: function (data) {
                const course = data.result;

                if (!course) {
                    console.log("Không tìm thấy khóa học với courseId:", courseId);
                    return;
                }

                $("#courseImg").attr("src", course.thumbnailImg || "");
                $("#courseName").text(course.titleCourse || "Không có tên");
                $("#coursePrice").text(
                    course.priceCourse != null
                        ? course.priceCourse.toLocaleString("vi-VN") + " VNĐ"
                        : "Chưa cập nhật giá"
                );

                renderModules(course.modules || []);
            },
            error: (xhr) => console.log(xhr.responseText),
        });
    }

    loadCourseDetails();

    // =====================================================================
    //  RENDER MODULE + LESSON
    // =====================================================================
function renderModules(modules) {
    $("#modulesList").empty();

    // Sắp xếp module theo thứ tự mong muốn (ví dụ theo moduleId)
    modules.sort((a, b) => a.nameModule.localeCompare(b.nameModule));


    modules.forEach((m, moduleIndex) => {

        let moduleHtml = `
        <div class="module-box" data-id="${m.moduleId}">
            <div class="module-header">
                <div>
                  <h4>${m.nameModule}</h4>
                  <p>${m.timeModule} giờ</p>
                </div>

                <div class="more-btn" onclick="toggleMenu(this)">⋮
                    <div class="more-menu">
                        <div class="edit-module" data-id="${m.moduleId}" 
                                data-name="${m.nameModule}" 
                                data-time="${m.timeModule}"
                                data-desc="${m.description}">
                            Sửa module
                        </div>
                        <div class="delete-module" data-id="${m.moduleId}">
                            Xóa module
                        </div>
                    </div>
                </div>
            </div>

            <button class="btn-submit btn-add-lesson" data-id="${m.moduleId}">
                Thêm lesson
            </button>

            <div class="lesson-list">
        `;

        // Sắp xếp lesson theo lessonId
        m.lessons.sort((a, b) => a.lessonTitle.localeCompare(b.lessonTitle));


        m.lessons.forEach((l, lessonIndex) => {

            moduleHtml += `
            <div class="lesson-box" data-id="${l.lessonId}">
                <div style="display:flex; justify-content:space-between">
                    <span> ${l.lessonTitle} (${l.timeLesson} giờ)</span>

                    <div class="more-btn" onclick="toggleMenu(this)">⋮
                        <div class="more-menu">
                            <div class="edit-lesson"
                                  data-id="${l.lessonId}"
                                  data-title="${l.lessonTitle}"
                                  data-time="${l.timeLesson}">
                                  Sửa lesson
                            </div>
                            <div class="delete-lesson" data-id="${l.lessonId}">
                                Xóa lesson
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });

        moduleHtml += `</div></div>`;

        $("#modulesList").append(moduleHtml);
    });
}



    // =====================================================================
//  MENU 3 CHẤM, EDIT & DELETE MODULE / LESSON
// =====================================================================
window.toggleMenu = function (el) {
    const menu = $(el).find(".more-menu");
    $(".more-menu").not(menu).removeClass("show");
    menu.toggleClass("show");
};

// Xử lý xóa module
$(document).on("click", ".delete-module", function () {
    const moduleId = $(this).data("id");
    if (!confirm("Bạn chắc chắn muốn xóa module này?")) return;

    $.ajax({
        url: `http://localhost:8080/api/v1/modules/${moduleId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        success: () => {
            alert("Xóa module thành công!");
            loadCourseDetails();
        },
        error: (xhr) => {
            console.log(xhr.responseText);
            alert("Xóa module thất bại!");
        },
    });
});

// Xử lý sửa module
$(document).on("click", ".edit-module", function () {
    const moduleId = $(this).data("id");
    const name = $(this).data("name");
    const time = $(this).data("time");
    const desc = $(this).data("desc");

    // Hiển thị popup với dữ liệu hiện tại
    $("#moduleName").val(name);
    $("#moduleTime").val(time);
    $("#moduleDesc").val(desc);
    $("#popupAddModule").removeClass("hidden");

    // Khi submit form, update module thay vì tạo mới
    $("#formAddModule").off("submit").submit(function (e) {
        e.preventDefault();

        const payload = {
            nameModule: $("#moduleName").val().trim(),
            description: $("#moduleDesc").val().trim(),
            timeModule: Number($("#moduleTime").val())
        };

        $.ajax({
            url: `http://localhost:8080/api/v1/modules/${moduleId}`,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(payload),
            success: () => {
                alert("Cập nhật module thành công!");
                closePopup("#popupAddModule");
                loadCourseDetails();
            },
            error: (xhr) => {
                console.log(xhr.responseText);
                alert("Cập nhật module thất bại!");
            },
        });
    });
});

// Xử lý xóa lesson
$(document).on("click", ".delete-lesson", function () {
    const lessonId = $(this).data("id");
    if (!confirm("Bạn chắc chắn muốn xóa lesson này?")) return;

    $.ajax({
        url: `http://localhost:8080/api/v1/lessons/${lessonId}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        success: () => {
            alert("Xóa lesson thành công!");
            loadCourseDetails();
        },
        error: (xhr) => {
            console.log(xhr.responseText);
            alert("Xóa lesson thất bại!");
        },
    });
});

// Xử lý sửa lesson
$(document).on("click", ".edit-lesson", function () {
    const lessonId = $(this).data("id");
    const title = $(this).data("title");
    const time = $(this).data("time");

    // Hiển thị popup với dữ liệu hiện tại
    $("#lessonTitle").val(title);
    $("#lessonTime").val(time);
    $("#popupAddLesson").removeClass("hidden");

    function resetSubmitButton($btn, text = "Thêm") {
    $btn.prop("disabled", false).text(text);
}

// Thêm lesson
$("#formAddLesson").submit(function (e) {
    e.preventDefault();

    if (!selectedModuleId) {
        alert("Chưa chọn module!");
        return;
    }

    const lessonData = {
        moduleId: selectedModuleId,
        lessonTitle: $("#lessonTitle").val().trim(),
        timeLesson: Number($("#lessonTime").val())
    };

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(lessonData)], { type: "application/json" }));
    const videoFile = $("#lessonVideo")[0].files[0];
    if (videoFile) formData.append("videoUrl", videoFile);

    const $btnSubmit = $(this).find("button[type=submit]");
    $btnSubmit.prop("disabled", true).text("Đang thêm...");

    $.ajax({
        url: "http://localhost:8080/api/v1/lessons",
        type: "POST",
        processData: false,
        contentType: false,
        headers: { Authorization: `Bearer ${token}` },
        data: formData,
        success: function () {
            closePopup("#popupAddLesson");
            loadCourseDetails();
            alert("Thêm lesson thành công!");
            resetSubmitButton($btnSubmit);
            $("#formAddLesson")[0].reset(); // reset form
        },
        error: (xhr) => {
            console.log("Error:", xhr.responseText);
            alert("Thêm lesson thất bại. Kiểm tra dữ liệu và thử lại.");
            resetSubmitButton($btnSubmit);
        },
    });
});

});


    // =====================================================================
    //  THÊM MODULE
    // =====================================================================
    $("#btnAddModule").click(() => $("#popupAddModule").removeClass("hidden"));

    $("#formAddModule").submit(function (e) {
        e.preventDefault();

        const payload = {
            courseId: courseId,
            nameModule: $("#moduleName").val().trim(),
            description: $("#moduleDesc").val().trim(),
            timeModule: Number($("#moduleTime").val())
        };

        $.ajax({
            url: "http://localhost:8080/api/v1/modules",
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: JSON.stringify(payload),
            success: () => {
                closePopup("#popupAddModule");
                loadCourseDetails();
            },
            error: (xhr) => console.log(xhr.responseText),
        });
    });


        function resetSubmitButton($btn, text = "Thêm") {
            $btn.prop("disabled", false).text(text);
        }


    // =====================================================================
//  THÊM LESSON
// =====================================================================
let selectedModuleId = null;

$(document).on("click", ".btn-add-lesson", function () {
    selectedModuleId = $(this).data("id");
    $("#popupAddLesson").removeClass("hidden");
});

// Hàm reset button sau khi submit
function resetSubmitButton($btn, text = "Thêm") {
    $btn.prop("disabled", false).text(text);
}

$("#formAddLesson").submit(function (e) {
    e.preventDefault();

    if (!selectedModuleId) {
        alert("Chưa chọn module!");
        return;
    }

    const lessonData = {
        moduleId: selectedModuleId,
        lessonTitle: $("#lessonTitle").val().trim(),
        timeLesson: Number($("#lessonTime").val())
    };

    const formData = new FormData();
    formData.append("data",
        new Blob([JSON.stringify(lessonData)], { type: "application/json" })
    );

    const videoFile = $("#lessonVideo")[0].files[0];
    if (videoFile) formData.append("videoUrl", videoFile);

    const $btnSubmit = $(this).find("button[type=submit]");
    $btnSubmit.prop("disabled", true).text("Đang tải...");

    $.ajax({
        url: "http://localhost:8080/api/v1/lessons",
        type: "POST",
        processData: false,
        contentType: false,
        headers: { Authorization: `Bearer ${token}` },
        data: formData,
        success: function () {
            alert("Thêm lesson thành công!");
            closePopup("#popupAddLesson");
            $("#formAddLesson")[0].reset(); // Reset input
            resetSubmitButton($btnSubmit);  // Reset nút về Thêm
            loadCourseDetails();            // Reload giao diện
        },
        error: function (xhr) {
            console.log("Error:", xhr.responseText);
            alert("Thêm lesson thất bại. Kiểm tra dữ liệu và thử lại.");
            resetSubmitButton($btnSubmit);  // Reset nút về Thêm khi lỗi
        }
    });
});


    // =====================================================================
    //  HÀM ĐÓNG POPUP
    // =====================================================================
    window.closePopup = function (selector) {
        $(selector).addClass("hidden");
    };
});
