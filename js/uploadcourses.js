


// Khi trang load xong
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const videoInput = document.getElementById("videoUpload");
  const thumbnailInput = document.getElementById("thumbnailUpload");
  const videoPreview = document.getElementById("videoPreview");
  const thumbnailPreview = document.getElementById("thumbnailPreview");

  // === Preview video demo ===
  videoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      videoPreview.style.display = "block";
      videoPreview.innerHTML = `
        <video width="100%" controls style="border-radius:8px; margin-top: 10px;">
          <source src="${videoURL}" type="${file.type}">
          Trình duyệt của bạn không hỗ trợ video.
        </video>`;
    }
  });

  // === Preview thumbnail ===
  thumbnailInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      thumbnailPreview.style.display = "block";
      thumbnailPreview.innerHTML = `
        <img src="${imgURL}" alt="Thumbnail" style="max-width:100%; border-radius:8px; margin-top:10px;">
      `;
    }
  });
});

// =======================
//  BIẾN LƯU DỮ LIỆU TẠM
// =======================
let modules = [];
let lessons = [];

// =======================
//  XỬ LÝ MODAL MODULE
// =======================
function openModuleModal() {
  document.getElementById("moduleModal").style.display = "flex";
}
function closeModuleModal() {
  document.getElementById("moduleModal").style.display = "none";
}
function openLessonModal() {
  document.getElementById("lessonModal").style.display = "flex";
}
function closeLessonModal() {
  document.getElementById("lessonModal").style.display = "none";
}

// =======================
//  THÊM BÀI HỌC
// =======================
function addLesson() {
  const title = document.getElementById("lessonTitle").value.trim();
  const duration = document.getElementById("lessonDuration").value.trim();
  const videoFile = document.getElementById("lessonVideoUpload").files[0];

  if (!title || !duration || !videoFile) {
    alert("Vui lòng nhập đầy đủ thông tin bài học!");
    return;
  }

  lessons.push({ title, duration, videoFile });

  const lessonList = document.getElementById("lessonList");
  lessonList.innerHTML = lessons
    .map((l, i) => `<p>${i + 1}. ${l.title} - ${l.duration}</p>`)
    .join("");

  document.getElementById("lessonTitle").value = "";
  document.getElementById("lessonDuration").value = "";
  document.getElementById("lessonVideoUpload").value = "";
  closeLessonModal();
}

// =======================
//  THÊM MODULE
// =======================
function addModule() {
  const title = document.getElementById("moduleTitle").value.trim();
  const description = document.getElementById("moduleDescription").value.trim();
  const duration = document.getElementById("moduleDuration").value.trim();

  if (!title || !duration) {
    alert("Vui lòng nhập đầy đủ thông tin module!");
    return;
  }

  modules.push({ title, description, duration, lessons: [...lessons] });
  lessons = []; // reset danh sách bài học
  renderModuleList();
  closeModuleModal();
}

// =======================
//  HIỂN THỊ DANH SÁCH MODULE
// =======================
function renderModuleList() {
  const container = document.getElementById("moduleList");
  if (modules.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="video" width="48" height="48" style="color:#d1d5db;"></i>
        <p>Chưa có module nào. Nhấn "Thêm Module" để bắt đầu.</p>
      </div>`;
    lucide.createIcons();
    return;
  }

  container.innerHTML = modules
    .map(
      (m, i) => `
      <div class="module-card">
        <h4>${i + 1}. ${m.title}</h4>
        <p>${m.description || "Không có mô tả"}</p>
        <small>Thời lượng: ${m.duration}</small>
        <ul>
          ${m.lessons.map((l) => `<li>${l.title} - ${l.duration}</li>`).join("")}
        </ul>
      </div>`
    )
    .join("");
  lucide.createIcons();
}

// =======================
//  GỬI DỮ LIỆU LÊN BACKEND
// =======================
async function saveCourse() {
  // 1. Lấy dữ liệu từ form
  const title = document.getElementById("courseTitle").value.trim();
  const description = document.getElementById("courseDescription").value.trim();
  const price = document.getElementById("coursePrice").value.trim();
  const duration = document.getElementById("courseDuration").value.trim();
  const level = document.getElementById("courseLevel").value;
  const thumbnailFile = document.getElementById("courseThumbnail").files[0];
  const videoFile = document.getElementById("courseVideo").files[0];

  // 2. Validate thông tin cơ bản
  if (!title || !description || !price || !duration) {
    alert("❌ Vui lòng nhập đầy đủ thông tin khóa học!");
    return;
  }

  // 3. Validate độ dài
  if (title.length < 10 || title.length > 200) {
    alert("❌ Tên khóa học phải từ 10-200 ký tự!");
    return;
  }

  if (description.length < 50 || description.length > 5000) {
    alert("❌ Mô tả phải từ 50-5000 ký tự!");
    return;
  }

  // 4. Validate giá
  const priceNum = Number(price.replace(/[,.]/g, ""));
  if (isNaN(priceNum) || priceNum < 10000) {
    alert("❌ Giá khóa học phải từ 10,000 VNĐ trở lên!");
    return;
  }

  // 5. Validate thời lượng (xử lý cả "42h" và "42")
  let durationNum;
  if (duration.toLowerCase().endsWith('h')) {
    durationNum = parseInt(duration.slice(0, -1), 10);
  } else {
    durationNum = parseInt(duration, 10);
  }
  
  if (isNaN(durationNum) || durationNum <= 0) {
    alert("❌ Thời lượng khóa học không hợp lệ!");
    return;
  }

  // 6. Validate files
  if (!thumbnailFile) {
    alert("❌ Vui lòng upload hình thumbnail!");
    return;
  }

  if (!videoFile) {
    alert("❌ Vui lòng upload video demo!");
    return;
  }

  // 7. Validate kích thước file
  const MAX_THUMBNAIL_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024;   // 100MB

  if (thumbnailFile.size > MAX_THUMBNAIL_SIZE) {
    alert("❌ Thumbnail không được vượt quá 5MB!");
    return;
  }

  if (videoFile.size > MAX_VIDEO_SIZE) {
    alert("❌ Video không được vượt quá 100MB!");
    return;
  }

  // 7. Validate định dạng file
  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const allowedVideoTypes = ["video/mp4", "video/avi", "video/mov", "video/quicktime", "video/x-msvideo"];

  if (!allowedImageTypes.includes(thumbnailFile.type)) {
    alert("❌ Thumbnail chỉ chấp nhận định dạng JPG, PNG!");
    return;
  }

  if (!allowedVideoTypes.includes(videoFile.type)) {
    alert("❌ Video chỉ chấp nhận định dạng MP4, AVI, MOV!");
    return;
  }

  // 9. Kiểm tra token
  const token = localStorage.getItem("token");
  if (!token) {
    alert("⚠️ Bạn chưa đăng nhập!");
    window.location.href = "/pages/login.html";
    return;
  }

  // 10. Map level từ dropdown sang enum Java (SỬA LẠI ĐÂY)
  let levelEnum;
  switch (level) {
    case "Cơ bản":
      levelEnum = "BEGINNER";
      break;
    case "Trung cấp":
      levelEnum = "INTERMEDIATE";
      break;
    case "Nâng cao":
      levelEnum = "ADVANCED";
      break;
    default:
      alert("❌ Level không hợp lệ!");
      return;
  }

  // 11. Tạo FormData
  const formData = new FormData();
  
  const courseData = {
    titleCourse: title,
    description: description,
    priceCourse: priceNum,
    timeCourse: durationNum,
    level: levelEnum,
    enrolledCount: 0
  };

  // Log để debug
  console.log("📤 Dữ liệu gửi đi:", courseData);
  console.log("🖼️ Thumbnail:", {
    name: thumbnailFile.name,
    size: `${(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB`,
    type: thumbnailFile.type
  });
  console.log("🎬 Video:", {
    name: videoFile.name,
    size: `${(videoFile.size / 1024 / 1024).toFixed(2)} MB`,
    type: videoFile.type
  });

  // Append course data as JSON blob
  formData.append("course", new Blob([JSON.stringify(courseData)], { 
    type: "application/json" 
  }));
  
  formData.append("thumbnail", thumbnailFile);
  formData.append("video", videoFile);

  // 12. Hiển thị loading
  const submitBtn = document.querySelector("button[onclick='saveCourse()']");
  const originalText = submitBtn ? submitBtn.textContent : "";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "⏳ Đang tải lên...";
  }

  try {
    // 13. Gửi request
    const res = await fetch("http://localhost:8080/api/v1/courses/create-with-media", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });

    // 14. Xử lý response
    if (res.ok) {
      const data = await res.json();
      console.log("✅ Response:", data);
      alert("🎉 Tạo khóa học và upload media thành công!");
      window.location.href = "/pages/courses.html";
    } else {
      // Debug chi tiết lỗi
      const contentType = res.headers.get("content-type");
      let errorData;
      
      if (contentType && contentType.includes("application/json")) {
        errorData = await res.json();
      } else {
        const text = await res.text();
        errorData = { message: text };
      }
      
      console.error("❌ Lỗi backend:", errorData);
      console.error("📦 FormData đã gửi:", {
        course: courseData,
        thumbnailName: thumbnailFile.name,
        thumbnailSize: `${(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB`,
        thumbnailType: thumbnailFile.type,
        videoName: videoFile.name,
        videoSize: `${(videoFile.size / 1024 / 1024).toFixed(2)} MB`,
        videoType: videoFile.type
      });
      
      if (errorData && errorData.message) {
        alert(`❌ Lỗi: ${errorData.message}`);
      } else {
        alert("❌ Tạo khóa học thất bại. Vui lòng kiểm tra console để biết chi tiết!");
      }
    }
  } catch (err) {
    console.error("⚠️ Lỗi kết nối:", err);
    alert("❌ Không thể kết nối đến server!\n" + err.message);
  } finally {
    // 15. Reset button
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }
}

// Thêm preview cho thumbnail
document.getElementById("courseThumbnail")?.addEventListener("change", function(e) {
  const file = e.target.files[0];
  const preview = document.getElementById("thumbnailPreview");
  
  if (file && preview) {
    const reader = new FileReader();
    reader.onload = function(event) {
      preview.innerHTML = `<img src="${event.target.result}" style="max-width: 300px; margin-top: 10px; border-radius: 8px;">`;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});

// Thêm preview cho video
document.getElementById("courseVideo")?.addEventListener("change", function(e) {
  const file = e.target.files[0];
  const preview = document.getElementById("videoPreview");
  
  if (file && preview) {
    const reader = new FileReader();
    reader.onload = function(event) {
      preview.innerHTML = `<video controls style="max-width: 400px; margin-top: 10px; border-radius: 8px;">
        <source src="${event.target.result}" type="${file.type}">
      </video>`;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});