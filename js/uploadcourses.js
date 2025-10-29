// // ==========================
// // Initialize Lucide Icons
// // ==========================
// document.addEventListener("DOMContentLoaded", () => {
//   lucide.createIcons();
// });

// // ==========================
// // GLOBAL STATE
// // ==========================
// let modules = [];
// let currentModuleLessons = [];
// let editingModuleIndex = null;

// // ==========================
// // VIDEO & IMAGE UPLOAD (COURSE)
// // ==========================
// document.getElementById("videoUpload").addEventListener("change", (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     const videoURL = URL.createObjectURL(file);
//     const preview = document.getElementById("videoPreview");
//     preview.innerHTML = `
//       <video width="100%" height="auto" controls style="border-radius:8px; margin-top: 0.5rem;">
//         <source src="${videoURL}" type="${file.type}">
//         Trình duyệt không hỗ trợ video.
//       </video>
//       <p style="color:#10b981; font-weight:600; margin-top: 0.5rem;">✓ ${file.name}</p>
//     `;
//     preview.style.display = "block";
//   }
// });

// document.getElementById("thumbnailUpload").addEventListener("change", (e) => {
//   const file = e.target.files[0];
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const preview = document.getElementById("thumbnailPreview");
//       preview.innerHTML = `
//         <img src="${event.target.result}" style="width: 100%; max-height: 12rem; object-fit: cover; border-radius: 0.5rem; margin-top: 0.5rem;">
//         <p style="font-size: 0.875rem; color: #10b981; font-weight: 600; margin-top: 0.5rem;">✓ ${file.name}</p>
//       `;
//       preview.style.display = "block";
//     };
//     reader.readAsDataURL(file);
//   }
// });

// // ==========================
// // MODULE MODAL
// // ==========================
// function openModuleModal() {
//   document.getElementById("moduleModal").classList.add("active");
//   lucide.createIcons();
// }

// function closeModuleModal() {
//   document.getElementById("moduleModal").classList.remove("active");
//   document.getElementById("moduleTitle").value = "";
//   document.getElementById("moduleDescription").value = "";
//   document.getElementById("moduleDuration").value = "";
//   currentModuleLessons = [];
//   editingModuleIndex = null;
//   renderLessonList();
//   document.getElementById("moduleModalTitle").textContent = "Thêm Module Mới";
//   document.getElementById("moduleSubmitText").textContent = "Thêm Module";
// }

// // ==========================
// // LESSON MODAL
// // ==========================
// function openLessonModal() {
//   document.getElementById("lessonModal").classList.add("active");
//   lucide.createIcons();
// }

// function closeLessonModal() {
//   document.getElementById("lessonModal").classList.remove("active");
//   document.getElementById("lessonTitle").value = "";
//   document.getElementById("lessonDuration").value = "";
//   document.getElementById("lessonVideoUpload").value = "";
// }

// // ==========================
// // ADD LESSON
// // ==========================
// function addLesson() {
//   const title = document.getElementById("lessonTitle").value.trim();
//   const duration = document.getElementById("lessonDuration").value.trim();
//   const videoInput = document.getElementById("lessonVideoUpload");
//   const file = videoInput.files[0];

//   if (!title || !duration) {
//     alert("Vui lòng điền đầy đủ thông tin bài học");
//     return;
//   }

//   const lessonData = {
//     id: Date.now(),
//     title,
//     duration,
//     videoFile: file ? file.name : "Chưa có video",
//   };

//   currentModuleLessons.push(lessonData);
//   renderLessonList();
//   closeLessonModal(); // ✅ ẩn popup ngay sau khi thêm
// }

// // ==========================
// // RENDER LESSON LIST
// // ==========================
// function renderLessonList() {
//   const container = document.getElementById("lessonList");

//   if (currentModuleLessons.length === 0) {
//     container.innerHTML =
//       '<p style="text-align: center; padding: 1rem; font-size: 0.875rem; color: #6b7280;">Chưa có bài học nào</p>';
//     return;
//   }

//   container.innerHTML = currentModuleLessons
//     .map(
//       (lesson) => `
//         <div class="lesson-form-item" style="display:flex; justify-content:space-between; align-items:center; padding:0.25rem 0;">
//           <div style="display:flex; align-items:center; gap:0.5rem;">
//             <i data-lucide="video" width="16" height="16" style="color:#9ca3af;"></i>
//             <span>${lesson.title}</span>
//             <span style="font-size:0.75rem; color:#6b7280;">(${lesson.duration})</span>
//           </div>
//           <button onclick="removeLesson(${lesson.id})" style="background:none; border:none; color:#dc2626; cursor:pointer;">
//             <i data-lucide="trash-2" width="16" height="16"></i>
//           </button>
//         </div>
//       `
//     )
//     .join("");

//   lucide.createIcons();
// }

// function removeLesson(id) {
//   currentModuleLessons = currentModuleLessons.filter((l) => l.id !== id);
//   renderLessonList();
// }

// // ==========================
// // MODULE MANAGEMENT
// // ==========================
// function addModule() {
//   const title = document.getElementById("moduleTitle").value.trim();
//   const description = document.getElementById("moduleDescription").value.trim();
//   const duration = document.getElementById("moduleDuration").value.trim();

//   if (!title || !duration) {
//     alert("Vui lòng điền đầy đủ thông tin module");
//     return;
//   }

//   const moduleData = {
//     id: Date.now(),
//     title,
//     description,
//     duration,
//     lessons: [...currentModuleLessons],
//   };

//   if (editingModuleIndex !== null) {
//     modules[editingModuleIndex] = moduleData;
//   } else {
//     modules.push(moduleData);
//   }

//   renderModuleList();
//   closeModuleModal(); // ✅ ẩn popup sau khi thêm module
// }

// // ==========================
// // RENDER MODULE LIST
// // ==========================
// function renderModuleList() {
//   const container = document.getElementById("moduleList");

//   if (modules.length === 0) {
//     container.innerHTML = `
//       <div class="empty-state">
//         <i data-lucide="video" width="48" height="48" style="color:#d1d5db; margin:0 auto 0.75rem;"></i>
//         <p>Chưa có module nào. Nhấn "Thêm Module" để bắt đầu.</p>
//       </div>
//     `;
//     lucide.createIcons();
//     return;
//   }

//   container.innerHTML = modules
//     .map(
//       (module, index) => `
//         <div class="module-item">
//           <div class="module-header" onclick="toggleModule(${index})">
//             <div style="flex:1;">
//               <div style="display:flex; align-items:center; gap:0.5rem;">
//                 <span style="font-weight:600;">Module ${index + 1}:</span>
//                 <span>${module.title}</span>
//               </div>
//               <div style="font-size:0.875rem; color:#6b7280; margin-top:0.25rem;">
//                 ${module.lessons.length} bài học • ${module.duration}
//               </div>
//             </div>
//             <div class="module-actions">
//               <button class="btn-edit" onclick="event.stopPropagation(); editModule(${index})">Sửa</button>
//               <button class="btn-delete" onclick="event.stopPropagation(); removeModule(${index})">Xóa</button>
//               <i id="module-icon-${index}" data-lucide="chevron-down" width="20" height="20"></i>
//             </div>
//           </div>
//           <div id="module-content-${index}" class="module-content">
//             ${module.lessons
//               .map(
//                 (lesson) => `
//                 <div class="lesson-item">
//                   <i data-lucide="video" width="16" height="16" style="color:#9ca3af;"></i>
//                   <span>${lesson.title}</span>
//                   <span style="font-size:0.875rem; color:#6b7280;">(${lesson.duration})</span>
//                 </div>
//               `
//               )
//               .join("")}
//           </div>
//         </div>
//       `
//     )
//     .join("");

//   lucide.createIcons();
// }

// // ==========================
// // SAVE COURSE
// // ==========================
// function saveCourse() {
//   const courseData = {
//     title: document.getElementById("courseTitle").value.trim(),
//     description: document.getElementById("courseDescription").value.trim(),
//     price: document.getElementById("coursePrice").value.trim(),
//     duration: document.getElementById("courseDuration").value.trim(),
//     level: document.getElementById("courseLevel").value,
//     modules: modules,
//     totalLessons: modules.reduce((sum, m) => sum + m.lessons.length, 0),
//     createdAt: new Date().toISOString(),
//   };

//   if (!courseData.title || !courseData.price || modules.length === 0) {
//     alert("Vui lòng điền đầy đủ thông tin khóa học và thêm ít nhất 1 module");
//     return;
//   }

//   console.log("📘 Course Data:", courseData);
//   alert("Khóa học đã được lưu thành công! (Xem console để xem dữ liệu)");
// }




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
  const title = document.getElementById("courseTitle").value.trim();
  const description = document.getElementById("courseDescription").value.trim();
  const price = document.getElementById("coursePrice").value.trim();
  const duration = document.getElementById("courseDuration").value.trim();
  const level = document.getElementById("courseLevel").value;

  if (!title || !description || !price || !duration) {
    alert("Vui lòng nhập đầy đủ thông tin khóa học!");
    return;
  }

  const data = {
    titleCourse: title,
    description: description,
    priceCourse: parseInt(price.replace(/[,.]/g, ""), 10),
    timeCourse: parseInt(duration, 10),
    level: level
  };

  try {
    const res = await fetch("http://localhost:8080/api/v1/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Tạo khóa học thành công!");
      window.location.href = "/pages/courses.html";
    } else {
      const text = await res.text();
      console.error("Lỗi:", text);
      alert("Tạo khóa học thất bại. Xem console để biết thêm chi tiết.");
    }
  } catch (err) {
    console.error("Lỗi kết nối:", err);
    alert("Không thể kết nối đến server!");
  }
}
