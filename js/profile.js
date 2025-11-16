$(document).ready(function () {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!token || !userData) return console.error("Chưa login hoặc không có userData!");

  // Kiểm tra role
  const roles = userData.roles.map(r => r.name);
  const isMentor = roles.includes("MENTOR");
  const isUser = roles.includes("USER");

  if (isUser) {
    // USER: gọi API my-info
    $.ajax({
      url: "http://localhost:8080/api/v1/users/my-info",
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.code === 1000 && res.result) {
          const profile = res.result;

          // Avatar là viết tắt của fullname
          const initials = `${profile.firstName.charAt(0).toUpperCase()}${profile.lastName.charAt(0).toUpperCase()}`;

          // Tạo div tròn thay cho <img>
          const avatarDiv = $("<div>")
            .addClass("mentor-profile__avatar")
            .text(initials)
            .css({
              width: "80px",
              height: "80px",
              "border-radius": "50%",
              "background-color": "#6738d7ff",
              color: "#fff",
              "font-weight": "bold",
              "font-size": "32px",
              display: "flex",
              "align-items": "center",
              "justify-content": "center",
              "text-transform": "uppercase"
            });

          $(".mentor-profile__avatar").replaceWith(avatarDiv);

          $(".mentor-profile__name").text(`${profile.firstName} ${profile.lastName}`);
          $(".mentor-profile__position").text(profile.position ? `${profile.position} tại ${profile.companyName || ''}` : '');

          // Hiển thị nút đăng ký mentor, ẩn tab khóa học
          $(".mentor-profile__btn--secondary").show();
          $(".mentor-profile__btn--primary").hide();
          $('[data-tab="course"]').hide();
        }
      },
      error: function (xhr) {
        console.error("Lỗi khi gọi API my-info:", xhr);
      }
    });
  }

  if (isMentor) {
    // MENTOR: gọi API mentor/user/{userId}
    $.ajax({
      url: `http://localhost:8080/api/v1/mentor/user/${userData.userId}`,
      method: "GET",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      success: function (res) {
        if (res.code === 1000 && res.result) {
          const profile = res.result;
          $(".mentor-profile__avatar").attr("src", profile.avatar || "/images/default-avatar.png");
          $(".mentor-profile__name").text(profile.name);
          $(".mentor-profile__position").text(profile.position ? `${profile.position} tại ${profile.companyName || ''}` : '');

          // Ẩn nút đăng ký mentor
          $(".mentor-profile__btn--secondary").hide();
          $(".mentor-profile__btn--primary").show();
        }
      },
      error: function (xhr) {
        console.error("Lỗi khi gọi API mentor:", xhr);
      }
    });
  }
});




// Tabs chuyển đổi Hồ sơ / Đánh giá
const tabs = document.querySelectorAll(".mentor-tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

let currentStep = 1;
let originalNavbarDisplay = "";



$(document).ready(function () {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!token || !userData || !userData.userId) {
    return console.error("Chưa login hoặc không có userData!");
  }

  $.ajax({
    url: `http://localhost:8080/api/v1/courses/by-user/${userData.userId}`,
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    success: function (res) {
      console.log("API trả về:", res);

      if (res.code === 1000 && res.result && res.result.length > 0) {
        // Xóa các course-item cũ
        $("#course").find(".course-item").remove();

        res.result.forEach(course => {
          // Nếu mô tả ngắn hơn 50 từ thì bổ sung text ví dụ
          let description = course.description || '';
          if (description.split(' ').length < 50) {
            description += ' Đây là khóa học bổ ích, giúp bạn nắm vững kiến thức từ cơ bản đến nâng cao với nhiều ví dụ thực hành.';
          }

          const courseHtml = `
            <div class="course-item">
              <img src="${course.thumbnailImg || '/public/assets/images/download.jpg'}" alt="${course.titleCourse}" />
              <div class="course-info">
                <a href="#">${course.titleCourse}</a>
                <p>${description}</p>
                <span class="duration">⏱ ${course.timeCourse || 'Chưa có thông tin'} giờ</span>
                <span class="price">${course.priceCourse ? course.priceCourse.toLocaleString() + 'đ' : 'Miễn phí'}</span>
              </div>
            </div>
          `;
          $("#course").append(courseHtml);
        });
      } else {
        $("#course").append("<p>Chưa có khóa học nào.</p>");
      }
    },
    error: function (xhr) {
      console.error("Lỗi khi gọi API danh sách khóa học:", xhr);
    }
  });
});
