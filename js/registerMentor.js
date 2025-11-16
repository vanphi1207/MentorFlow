// ==========================
// Cấu hình cơ bản
// ==========================
let currentPage = 1;

// Cloudinary config (nếu bạn dùng Cloudinary để upload ảnh)
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dcpj8cfng/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "ml_default"; // thay bằng preset thật của bạn

// ==========================
// Chuyển trang
// ==========================
function updateProgress(page) {
  const progressFill = document.getElementById("progressFill");
  const progressPercent = (page / 4) * 100;
  progressFill.style.width = progressPercent + "%";

  for (let i = 1; i <= 4; i++) {
    const step = document.getElementById("step" + i);
    if (i <= page) step.classList.add("active");
    else step.classList.remove("active");
  }
}

function showPage(pageNum) {
  for (let i = 1; i <= 4; i++) {
    const page = document.getElementById("page" + i);
    page.classList.toggle("active", i === pageNum);
  }
  currentPage = pageNum;
  updateProgress(pageNum);
  window.scrollTo(0, 0);
}

function nextPage(pageNum) {
  showPage(pageNum);
}

function prevPage(pageNum) {
  showPage(pageNum);
}

// ==========================
// Upload Ảnh + Hiển thị tên file
// ==========================
let uploadedAvatarUrl = "";

document.addEventListener("DOMContentLoaded", () => {
  const photoInput = document.getElementById("photoUpload");
  const fileNameDisplay = document.getElementById("fileName");

  if (photoInput) {
    photoInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      fileNameDisplay.textContent = file.name;

      // Upload lên Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      try {
        const res = await fetch(CLOUDINARY_URL, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        uploadedAvatarUrl = data.secure_url;
        console.log("Ảnh đã upload:", uploadedAvatarUrl);
      } catch (error) {
        console.error("Lỗi upload ảnh:", error);
        alert("Không thể tải ảnh lên. Vui lòng thử lại.");
      }
    });
  }

  updateProgress(1);
});

// ==========================
// Submit Form - Gọi API
// ==========================
function submitForm() {
  const agreeTerms = document.getElementById("agreeTerms");
  if (!agreeTerms.checked) {
    alert("Vui lòng đồng ý với các điều khoản trước khi tiếp tục!");
    return;
  }

  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = userData.userId;
  const token = localStorage.getItem("token");

  // Dữ liệu form JSON
  const requestData = {
    linkMeet: $("#linkMeet").val(),
    companyName: $("#companyName").val(),
    position: $("#position").val(),
    field: $("#field").val(),
    softSkills: $("#softSkills").val(),
    priceBooking: $("#priceBooking").val(), 
    avatar: uploadedAvatarUrl || ""
  };

  if (!requestData.linkMeet || !requestData.companyName || !requestData.position) {
    alert("Vui lòng điền đầy đủ thông tin trước khi gửi!");
    return;
  }

  // Tạo FormData để gửi multipart/form-data
  const formData = new FormData();
  formData.append("data", new Blob([JSON.stringify(requestData)], { type: "application/json" }));

  // Nếu có file avatar
  const fileInput = document.getElementById("photoUpload");
  if (fileInput && fileInput.files.length > 0) {
    formData.append("avatarFile", fileInput.files[0]);
  }

  $.ajax({
    url: `http://localhost:8080/api/v1/mentor/request/${userId}`,
    type: "POST",
    data: formData,
    processData: false, // bắt buộc khi gửi FormData
    contentType: false, // bắt buộc khi gửi FormData
    headers: token ? { Authorization: "Bearer " + token } : {},
    success: function (response) {
      console.log("Phản hồi từ server:", response);
      alert("🎉 Đăng ký thành công! Chúng tôi sẽ xem xét hồ sơ của bạn sớm nhất.");
      window.location.href = "/public/index.html";
    },
    error: function (xhr, status, error) {
      console.error("Lỗi khi gửi request:", xhr.responseText);
      alert("❌ Đăng ký thất bại. Vui lòng thử lại sau!");
    },
  });
}

