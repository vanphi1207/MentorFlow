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
let originalNavbarDisplay = ""; // Lưu trạng thái ban đầu của navbar



// ====== MỞ POPUP chinh sua thong tin ca nhan ======
function openProfilePopup() {
  const overlay = document.getElementById("profileOverlay");
  const popup = document.getElementById("profilePopup");
  const textarea = document.getElementById("profileIntroduction");
  const navbar = document.querySelector(".navbar");

  overlay.classList.add("active");
  popup.style.display = "block";

  // Lưu và ẩn navbar
  if (navbar) {
    if (!navbar.dataset.originalDisplay) {
      navbar.dataset.originalDisplay = getComputedStyle(navbar).display;
    }
    navbar.style.display = "none";
  }

  // Focus vào textarea khi mở
  if (textarea) textarea.focus();
}

// ====== ĐÓNG POPUP ======
function closeProfilePopup() {
  const overlay = document.getElementById("profileOverlay");
  const popup = document.getElementById("profilePopup");
  const navbar = document.querySelector(".navbar");

  overlay.classList.remove("active");
  popup.style.display = "none";

  // Hiện lại navbar với trạng thái ban đầu
  if (navbar && navbar.dataset.originalDisplay) {
    navbar.style.display = navbar.dataset.originalDisplay;
  }
}

// ====== LƯU THÔNG TIN ======
function saveProfileIntroduction() {
  const textarea = document.getElementById("profileIntroduction");
  const content = textarea.value.trim();

  if (content === "") {
    alert("Vui lòng nhập nội dung giới thiệu trước khi lưu!");
    return;
  }

  alert("✅ Đã lưu thông tin giới thiệu bản thân!");
  closeProfilePopup();
}

// ====== SỰ KIỆN BỔ TRỢ ======
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("profileOverlay");

  // Click ra ngoài overlay để đóng
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        closeProfilePopup();
      }
    });
  }

  // Nhấn ESC để đóng popup
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeProfilePopup();
    }
  });
});

// mở 2 button chỉnh sửa

document.addEventListener("DOMContentLoaded", () => {
  // Hàm xử lý toggle hiển thị 2 nút (chỉnh sửa & xóa)
  function toggleEditButtons(updateBtn, buttonContainer) {
    const editBtn = buttonContainer.querySelector(".edit-btn");
    const deleteBtn = buttonContainer.querySelector(".delete-btn");

    const isVisible = editBtn.style.display === "flex";

    if (!isVisible) {
      // Hiện 2 nút và đổi "Cập nhật" thành "Xong"
      editBtn.style.display = "flex";
      deleteBtn.style.display = "flex";
      updateBtn.textContent = "Xong";
    } else {
      // Ẩn 2 nút và đổi lại "Cập nhật"
      editBtn.style.display = "none";
      deleteBtn.style.display = "none";
      updateBtn.textContent = "Cập nhật";
    }
  }

  // Gắn sự kiện cho tất cả các loại update
  const updateButtons = [
    { update: ".update-experience", container: ".experience-buttons__edit" },
    { update: ".update-study", container: ".study-buttons__edit" },
    { update: ".update-skill", container: ".skill-buttons__edit" },
  ];

  updateButtons.forEach(({ update, container }) => {
    const updateBtn = document.querySelector(update);
    const buttonContainer = document.querySelector(container);

    if (updateBtn && buttonContainer) {
      updateBtn.addEventListener("click", () =>
        toggleEditButtons(updateBtn, buttonContainer)
      );
    }
  });
});

// Hàm xử lý popup chung khi click vào button chỉnh sửa
function setupPopup(config) {
  const { editBtn, overlay, popup, closeBtn, saveBtn, cancelBtn } = config;

  // Mở popup khi click vào nút "Chỉnh sửa"
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      const navbar = document.querySelector(".navbar");

      overlay.classList.add("active");
      popup.classList.add("active");
      document.body.style.overflow = "hidden"; // Ngăn scroll trang

      // Lưu và ẩn navbar
      if (navbar) {
        if (!navbar.dataset.originalDisplay) {
          navbar.dataset.originalDisplay = getComputedStyle(navbar).display;
        }
        navbar.style.display = "none";
      }
    });
  }

  // Đóng popup
  function closePopup() {
    const navbar = document.querySelector(".navbar");

    overlay.classList.remove("active");
    popup.classList.remove("active");
    document.body.style.overflow = "auto"; // Cho phép scroll lại

    // Hiện lại navbar với trạng thái ban đầu
    if (navbar && navbar.dataset.originalDisplay) {
      navbar.style.display = navbar.dataset.originalDisplay;
    }
  }

  // Click vào nút đóng (X)
  closeBtn.addEventListener("click", closePopup);

  // Click vào overlay (nền mờ)
  overlay.addEventListener("click", closePopup);

  // Click vào nút Hủy
  cancelBtn.addEventListener("click", closePopup);

  // Click vào nút Lưu
  saveBtn.addEventListener("click", () => {
    alert("Đã lưu thông tin thành công!");
    closePopup();
  });

  // Ngăn popup đóng khi click vào nội dung popup
  popup.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

// Khởi tạo popup cho Kinh nghiệm làm việc
const experienceConfig = {
  editBtn: document.querySelector(".experience-buttons__edit .edit-btn"),
  overlay: document.querySelector(".experience-overlay"),
  popup: document.querySelector(".experience-popup"),
  closeBtn: document.querySelector(".experience-popup .experience-btn-close"),
  saveBtn: document.querySelector(".experience-popup .experience-btn-save"),
  cancelBtn: document.querySelector(".experience-popup .experience-btn-cancel"),
};

setupPopup(experienceConfig);

// Khởi tạo popup cho Quá trình học tập
const studyConfig = {
  editBtn: document.querySelector(".study-buttons__edit .edit-btn"),
  overlay: document.querySelector(".study-overlay"),
  popup: document.querySelector(".study-popup"),
  closeBtn: document.querySelector(".study-popup .experience-btn-close"),
  saveBtn: document.querySelector(".study-popup .experience-btn-save"),
  cancelBtn: document.querySelector(".study-popup .experience-btn-cancel"),
};

setupPopup(studyConfig);

// Xử lý hiển thị tên file khi upload
const fileInputs = document.querySelectorAll(".experience-file-input");
fileInputs.forEach((input) => {
  input.addEventListener("change", function () {
    const fileName = this.files[0]?.name || "No file chosen";
    const fileNameSpan = this.parentElement.querySelector(
      ".experience-file-name"
    );
    if (fileNameSpan) {
      fileNameSpan.textContent = fileName;
    }
  });
});

// Xử lý checkbox "Hiện tại tôi vẫn làm việc ở đây"
const checkboxes = document.querySelectorAll(".experience-checkbox");
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const popup = this.closest(".experience-popup, .study-popup");
    const endDateInput = popup.querySelector("#experienceEndDate");
    const currentText = popup.querySelector(".experience-date-current");

    if (this.checked) {
      endDateInput.style.display = "none";
      currentText.style.display = "inline";
      endDateInput.value = "";
    } else {
      endDateInput.style.display = "inline";
      currentText.style.display = "none";
    }
  });
});

//click vào nút thêm sẽ hiển thị 2 popup của kinh nghiem lam viec va qua trình học tập

document.addEventListener("DOMContentLoaded", () => {
  // Lấy các phần tử popup và overlay
  const experiencePopup = document.querySelector(".experience-popup");
  const experienceOverlay = document.querySelector(".experience-overlay");
  const studyPopup = document.querySelector(".study-popup");
  const studyOverlay = document.querySelector(".study-overlay");

  // Lấy tất cả nút "Thêm"
  const addButtons = document.querySelectorAll(".update-add");

  addButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      const navbar = document.querySelector(".navbar");

      if (index === 0) {
        // Mục đầu tiên -> Kinh nghiệm làm việc
        experiencePopup.classList.add("active");
        experienceOverlay.classList.add("active");
        document.body.style.overflow = "hidden";

        // Lưu và ẩn navbar
        if (navbar) {
          if (!navbar.dataset.originalDisplay) {
            navbar.dataset.originalDisplay = getComputedStyle(navbar).display;
          }
          navbar.style.display = "none";
        }
      } else if (index === 1) {
        // Mục thứ 2 -> Quá trình học tập
        studyPopup.classList.add("active");
        studyOverlay.classList.add("active");
        document.body.style.overflow = "hidden";

        // Lưu và ẩn navbar
        if (navbar) {
          if (!navbar.dataset.originalDisplay) {
            navbar.dataset.originalDisplay = getComputedStyle(navbar).display;
          }
          navbar.style.display = "none";
        }
      }
    });
  });

  // Hàm đóng popup kinh nghiệm
  function closeExperiencePopup() {
    const navbar = document.querySelector(".navbar");

    experiencePopup.classList.remove("active");
    experienceOverlay.classList.remove("active");
    document.body.style.overflow = "auto";

    // Hiện lại navbar với trạng thái ban đầu
    if (navbar && navbar.dataset.originalDisplay) {
      navbar.style.display = navbar.dataset.originalDisplay;
    }
  }

  // Hàm đóng popup học tập
  function closeStudyPopup() {
    const navbar = document.querySelector(".navbar");

    studyPopup.classList.remove("active");
    studyOverlay.classList.remove("active");
    document.body.style.overflow = "auto";

    // Hiện lại navbar với trạng thái ban đầu
    if (navbar && navbar.dataset.originalDisplay) {
      navbar.style.display = navbar.dataset.originalDisplay;
    }
  }

  // Đóng popup kinh nghiệm khi click vào nút đóng
  document
    .querySelector(".experience-btn-close")
    .addEventListener("click", closeExperiencePopup);

  // Đóng popup kinh nghiệm khi click vào nút hủy
  document
    .querySelector(".experience-btn-cancel")
    .addEventListener("click", closeExperiencePopup);

  // Đóng popup kinh nghiệm khi click vào overlay
  experienceOverlay.addEventListener("click", closeExperiencePopup);

  // Đóng popup học tập khi click vào nút đóng
  document
    .querySelector(".study-popup .experience-btn-close")
    .addEventListener("click", closeStudyPopup);

  // Đóng popup học tập khi click vào nút hủy
  document
    .querySelector(".study-popup .experience-btn-cancel")
    .addEventListener("click", closeStudyPopup);

  // Đóng popup học tập khi click vào overlay
  studyOverlay.addEventListener("click", closeStudyPopup);

  // Ngăn popup đóng khi click vào nội dung popup
  experiencePopup.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  studyPopup.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

// click vao button chinh sua se hien thi pop up them chung chi va ki nang
const modalOverlay = document.querySelector(".skill-modal-overlay");
const editBtn = document.querySelector(".skill-button.edit-btn");
const closeBtn = document.querySelector(".skill-modal-close-btn");
const cancelBtn = document.querySelector(".skill-btn-cancel");
const saveBtn = document.querySelector(".skill-btn-save");

// Khi click nút "Chỉnh sửa" → mở popup
editBtn.addEventListener("click", () => {
  const navbar = document.querySelector(".navbar");

  modalOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";

  // Lưu và ẩn navbar
  if (navbar) {
    if (!navbar.dataset.originalDisplay) {
      navbar.dataset.originalDisplay = getComputedStyle(navbar).display;
    }
    navbar.style.display = "none";
  }
});

// Khi click dấu X hoặc nút Hủy → đóng popup
closeBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

function closeModal() {
  const navbar = document.querySelector(".navbar");

  modalOverlay.style.display = "none";
  document.body.style.overflow = "auto";

  // Hiện lại navbar với trạng thái ban đầu
  if (navbar && navbar.dataset.originalDisplay) {
    navbar.style.display = navbar.dataset.originalDisplay;
  }
}

// Khi click "Lưu" → thông báo + đóng popup
saveBtn.addEventListener("click", () => {
  alert("Lưu thành công!");
  closeModal();
});

// Đóng popup khi click vào overlay
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// skill_popup.js

document.addEventListener("DOMContentLoaded", () => {
  const skillOverlay = document.querySelector(".skill-modal-overlay");
  const skillModal = document.querySelector(".skill-modal");

  // Nút thêm kỹ năng (mục thứ 3)
  const addButtons = document.querySelectorAll(".update-add");

  addButtons.forEach((btn, index) => {
    if (index === 2) {
      btn.addEventListener("click", () => {
        const navbar = document.querySelector(".navbar");

        skillOverlay.style.display = "flex";
        document.body.style.overflow = "hidden";

        // Lưu và ẩn navbar
        if (navbar) {
          if (!navbar.dataset.originalDisplay) {
            navbar.dataset.originalDisplay = getComputedStyle(navbar).display;
          }
          navbar.style.display = "none";
        }
      });
    }
  });

  // Ngăn popup đóng khi click vào nội dung popup
  if (skillModal) {
    skillModal.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }
});



//call api
$(document).ready(function () {
  const mentorId = sessionStorage.getItem("selectedMentorId");
  if (!mentorId) return; // nếu không có id thì dừng

  const token = localStorage.getItem("token");
  if (!token) return console.error("Chưa login!");

  $.ajax({
    url: `http://localhost:8080/api/v1/admin/mentor-requests/${mentorId}`, // dùng id lấy chi tiết
    method: "GET",
    headers: {
      "Authorization": "Bearer " + token,
      "Content-Type": "application/json"
    },
    success: function (res) {
      if (res.code === 1000 && res.result) {
        const mentor = res.result;

        // Render thông tin lên banner
        $(".mentor-profile__avatar").attr("src", mentor.avatar);
        $(".mentor-profile__name").text(mentor.name);
        $(".mentor-profile__position").text(`${mentor.position} tại ${mentor.companyName}`);
      }
    },
    error: function (xhr) {
      console.error("Lỗi khi gọi API chi tiết mentor:", xhr);
    }
  });
});


//booking

let currentStep1 = 1;
let originalNavbarDisplay1 = "flex";
let selectedBookAvailabilityId = null; // lưu slot được chọn

// =================== Ẩn / Hiện modal ===================
function openBookingModal(mentorName = "Mentor") {
  const modal = document.getElementById("bookingModal");
  const navbar = document.querySelector(".navbar");

  if (navbar) {
    originalNavbarDisplay1 = getComputedStyle(navbar).display;
    navbar.style.display = "none";
  }

  modal.style.display = "flex";
  document.body.classList.add("modal-open");

  const title = modal.querySelector(".modal-title");
  if (title) title.textContent = `Đặt lịch với ${mentorName}`;

  renderAvailableSlots();
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  const navbar = document.querySelector(".navbar");

  modal.style.display = "none";
  document.body.classList.remove("modal-open");

  if (navbar) navbar.style.display = originalNavbarDisplay1 || "flex";

  resetSteps();
  selectedBookAvailabilityId = null;
}

// =================== Step navigation ===================
function nextStep() {
  const totalSteps = document.querySelectorAll(".progress-step").length;
  if (currentStep1 < totalSteps) {
    document.querySelector(`.step-${currentStep1}`).classList.remove("active");
    document.querySelector(`.progress-step[data-step="${currentStep1}"]`).classList.add("completed");
    currentStep1++;
    document.querySelector(`.step-${currentStep1}`).classList.add("active");
    document.querySelector(`.progress-step[data-step="${currentStep1}"]`).classList.add("active");
    updateStepLine();
  }
}

function prevStep() {
  if (currentStep1 > 1) {
    document.querySelector(`.step-${currentStep1}`).classList.remove("active");
    document.querySelector(`.progress-step[data-step="${currentStep1}"]`).classList.remove("active", "completed");
    currentStep1--;
    document.querySelector(`.step-${currentStep1}`).classList.add("active");
    document.querySelector(`.progress-step[data-step="${currentStep1}"]`).classList.add("active");
    updateStepLine();
  }
}

function updateStepLine() {
  const steps = document.querySelectorAll(".progress-step");
  const bar = document.querySelector(".progress-bar");
  if (!bar || steps.length < 2) return;
  const total = steps.length - 1;
  const percent = ((currentStep1 - 1) / total) * 100;
  bar.style.setProperty("--progress-width", `${percent}%`);
  steps.forEach((step, index) => {
    if (index < currentStep1 - 1) step.classList.add("completed");
    else step.classList.remove("completed");
  });
}

function resetSteps() {
  currentStep1 = 1;
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".progress-step").forEach(p => p.classList.remove("active"));
  document.querySelector(".step-1").classList.add("active");
  document.querySelector('.progress-step[data-step="1"]').classList.add("active");
}

// =================== Gửi booking ===================
function submitBooking() {
  if (!selectedBookAvailabilityId) {
    alert("Vui lòng chọn một lịch rảnh của mentor trước khi gửi!");
    return;
  }

  const topic = document.getElementById("topic").value || document.getElementById("otherTopic").value;
  const connectionForm = document.querySelector('input[name="connect"]:checked')?.value || "Google Meet";
  const note = document.getElementById("message").value || "";

  if (!topic) {
    alert("Vui lòng nhập chủ đề!");
    return;
  }

  const token = localStorage.getItem("token");

  const bookingData = {
    bookAvailabilityId: selectedBookAvailabilityId,
    topic: topic,
    connectionForm: connectionForm,
    note: note
  };

  console.log("Gửi booking:", bookingData); 

  $.ajax({
    url: "http://localhost:8080/api/v1/bookings",
    method: "POST",
    contentType: "application/json",
    headers: { "Authorization": "Bearer " + token },
    data: JSON.stringify(bookingData),
    success: function() {
      alert("✅ Đặt lịch thành công!");
      closeBookingModal();
    },
    error: function(xhr) {
      console.error("Lỗi khi gửi booking:", xhr);
      alert("❌ Có lỗi xảy ra. Vui lòng thử lại.");
    }
  });
}

// =================== Render slot ===================
function renderAvailableSlots() {
  const container = document.querySelector(".slots-container");
  if (!container) return;
  container.innerHTML = "";

  const mentorId = sessionStorage.getItem("selectedUserId");
  if (!mentorId) {
    container.innerHTML = "<p>Không tìm thấy Mentor ID</p>";
    return;
  }

  const token = localStorage.getItem("token");
  const startDate = new Date().toISOString().split("T")[0];
  const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  $.ajax({
    url: `http://localhost:8080/api/v1/availabilities/mentor/${mentorId}`,
    method: "GET",
    data: { startDate, endDate },
    headers: { "Authorization": "Bearer " + token },
    success: function(res) {
      if (res.code !== 1000 || !Array.isArray(res.result)) {
        container.innerHTML = "<p>Không có lịch rảnh.</p>";
        return;
      }

      const availableSlots = res.result.filter(s => !s.booked);
      if (availableSlots.length === 0) {
        container.innerHTML = "<p>Mentor chưa có lịch rảnh.</p>";
        return;
      }

      availableSlots.forEach(slotData => {
        const div = document.createElement("div");
        div.className = "slot";
        div.textContent = `${slotData.date} • ${slotData.slot.startTime} - ${slotData.slot.endTime} • ${slotData.slot.dayOfWeek}`;
        div.onclick = () => selectSlot(slotData, div);
        container.appendChild(div);
      });
    },
    error: function(xhr) {
      console.error("Lỗi khi lấy lịch rảnh:", xhr);
      container.innerHTML = "<p>Không thể tải lịch rảnh của mentor</p>";
    }
  });
}

// =================== Chọn slot ===================
function selectSlot(slotData, element) {
  document.querySelectorAll(".slot").forEach(s => s.classList.remove("selected"));
  element.classList.add("selected");

  selectedBookAvailabilityId = slotData.bookAvailabilityId; // Lưu để gửi booking
}
