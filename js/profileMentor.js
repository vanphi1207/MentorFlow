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

// Ẩn / Hiện modal đặt lịch
function openBookingModal(mentorName = "Mentor") {
  const modal = document.getElementById("bookingModal");
  const navbar = document.querySelector(".navbar");

  // Lưu trạng thái hiển thị ban đầu của navbar
  if (navbar) {
    originalNavbarDisplay = getComputedStyle(navbar).display;
    navbar.style.display = "none";
  }

  modal.style.display = "flex";
  document.body.classList.add("modal-open");

  // Gán tên mentor vào tiêu đề modal (nếu có)
  const title = modal.querySelector(".modal-title");
  if (title) title.textContent = `Đặt lịch với ${mentorName}`;

  renderAvailableSlots();
}

function closeBookingModal() {
  const modal = document.getElementById("bookingModal");
  const navbar = document.querySelector(".navbar");

  modal.style.display = "none";
  document.body.classList.remove("modal-open");

  // Hiện lại navbar đúng trạng thái ban đầu
  if (navbar) navbar.style.display = originalNavbarDisplay || "flex";

  resetSteps();
}

function nextStep() {
  const totalSteps = document.querySelectorAll(".progress-step").length;

  if (currentStep < totalSteps) {
    document.querySelector(`.step-${currentStep}`).classList.remove("active");
    document
      .querySelector(`.progress-step[data-step="${currentStep}"]`)
      .classList.add("completed");

    currentStep++;

    document.querySelector(`.step-${currentStep}`).classList.add("active");
    document
      .querySelector(`.progress-step[data-step="${currentStep}"]`)
      .classList.add("active");

    updateStepLine();
  }
}

function prevStep() {
  if (currentStep > 1) {
    document.querySelector(`.step-${currentStep}`).classList.remove("active");
    document
      .querySelector(`.progress-step[data-step="${currentStep}"]`)
      .classList.remove("active", "completed");

    currentStep--;

    document.querySelector(`.step-${currentStep}`).classList.add("active");
    document
      .querySelector(`.progress-step[data-step="${currentStep}"]`)
      .classList.add("active");

    updateStepLine();
  }
}

/* ✅ Tính % tiến trình và cập nhật thanh */
function updateStepLine() {
  const steps = document.querySelectorAll(".progress-step");
  const bar = document.querySelector(".progress-bar");
  if (!bar || steps.length < 2) return;

  const total = steps.length - 1;
  const percent = ((currentStep - 1) / total) * 100;

  // Cập nhật chiều dài thanh
  bar.style.setProperty("--progress-width", `${percent}%`);

  // Tô màu các chấm đã hoàn thành
  steps.forEach((step, index) => {
    if (index < currentStep - 1) step.classList.add("completed");
    else step.classList.remove("completed");
  });
}

function resetSteps() {
  currentStep = 1;
  document
    .querySelectorAll(".step")
    .forEach((s) => s.classList.remove("active"));
  document
    .querySelectorAll(".progress-step")
    .forEach((p) => p.classList.remove("active"));
  document.querySelector(".step-1").classList.add("active");
  document
    .querySelector('.progress-step[data-step="1"]')
    .classList.add("active");
}

// Gửi dữ liệu đặt lịch
function submitBooking() {
  const topic =
    document.getElementById("topic").value ||
    document.getElementById("otherTopic").value;
  const connect = document.querySelector(
    'input[name="connect"]:checked'
  )?.value;
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const message = document.getElementById("message").value;

  if (!topic || !date || !time) {
    alert("Vui lòng điền đầy đủ thông tin trước khi gửi!");
    return;
  }

  alert(
    `✅ Đặt lịch thành công!\n\nChủ đề: ${topic}\nHình thức: ${connect}\nThời gian: ${date} ${time}\nTin nhắn: ${message}`
  );
  closeBookingModal();
}

// Giả lập dữ liệu lịch rảnh của mentor
const mentorSlots = [
  { date: "2025-10-09", time: "09:00" },
  { date: "2025-10-09", time: "14:00" },
  { date: "2025-10-10", time: "10:30" },
  { date: "2025-10-10", time: "16:00" },
  { date: "2025-10-11", time: "09:30" },
];

// Render danh sách slot vào modal
function renderAvailableSlots() {
  const container = document.querySelector(".slots-container");
  if (!container) return;
  container.innerHTML = "";

  mentorSlots.forEach((slot) => {
    const div = document.createElement("div");
    div.className = "slot";
    div.textContent = `${slot.date} • ${slot.time}`;
    div.onclick = () => selectSlot(slot, div);
    container.appendChild(div);
  });
}

function selectSlot(slot, element) {
  document
    .querySelectorAll(".slot")
    .forEach((s) => s.classList.remove("selected"));
  element.classList.add("selected");

  document.getElementById("date").value = slot.date;
  document.getElementById("time").value = slot.time;
}




// ====== MỞ POPUP chinh sua thong tin ca nhan ======
function openProfilePopup() {
  const overlay = document.getElementById("profileOverlay");
  const popup = document.getElementById("profilePopup");
  const textarea = document.getElementById("profileIntroduction");

  overlay.classList.add("active");
  popup.style.display = "block";

  // Focus vào textarea khi mở
  if (textarea) textarea.focus();
}

// ====== ĐÓNG POPUP ======
function closeProfilePopup() {
  const overlay = document.getElementById("profileOverlay");
  const popup = document.getElementById("profilePopup");

  overlay.classList.remove("active");
  popup.style.display = "none";
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
    { update: ".update-prize", container: ".prize-buttons__edit" },
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



// Hàm xử lý popup chung
function setupPopup(config) {
  const {
    editBtn,
    overlay,
    popup,
    closeBtn,
    saveBtn,
    cancelBtn
  } = config;

  // Mở popup khi click vào nút "Chỉnh sửa"
  if (editBtn) {
    editBtn.addEventListener('click', () => {
      overlay.classList.add('active');
      popup.classList.add('active');
      document.body.style.overflow = 'hidden'; // Ngăn scroll trang
    });
  }

  // Đóng popup
  function closePopup() {
    overlay.classList.remove('active');
    popup.classList.remove('active');
    document.body.style.overflow = 'auto'; // Cho phép scroll lại
  }

  // Click vào nút đóng (X)
  closeBtn.addEventListener('click', closePopup);

  // Click vào overlay (nền mờ)
  overlay.addEventListener('click', closePopup);

  // Click vào nút Hủy
  cancelBtn.addEventListener('click', closePopup);

  // Click vào nút Lưu
  saveBtn.addEventListener('click', () => {
    alert('Đã lưu thông tin thành công!');
    closePopup();
  });

  // Ngăn popup đóng khi click vào nội dung popup
  popup.addEventListener('click', (e) => {
    e.stopPropagation();
  });
}

// Khởi tạo popup cho Kinh nghiệm làm việc
const experienceConfig = {
  editBtn: document.querySelector('.experience-buttons__edit .edit-btn'),
  overlay: document.querySelector('.experience-overlay'),
  popup: document.querySelector('.experience-popup'),
  closeBtn: document.querySelector('.experience-popup .experience-btn-close'),
  saveBtn: document.querySelector('.experience-popup .experience-btn-save'),
  cancelBtn: document.querySelector('.experience-popup .experience-btn-cancel')
};

setupPopup(experienceConfig);

// Khởi tạo popup cho Quá trình học tập
const studyConfig = {
  editBtn: document.querySelector('.study-buttons__edit .edit-btn'),
  overlay: document.querySelector('.study-overlay'),
  popup: document.querySelector('.study-popup'),
  closeBtn: document.querySelector('.study-popup .experience-btn-close'),
  saveBtn: document.querySelector('.study-popup .experience-btn-save'),
  cancelBtn: document.querySelector('.study-popup .experience-btn-cancel')
};

setupPopup(studyConfig);

// Xử lý hiển thị tên file khi upload
const fileInputs = document.querySelectorAll('.experience-file-input');
fileInputs.forEach(input => {
  input.addEventListener('change', function() {
    const fileName = this.files[0]?.name || 'No file chosen';
    const fileNameSpan = this.parentElement.querySelector('.experience-file-name');
    if (fileNameSpan) {
      fileNameSpan.textContent = fileName;
    }
  });
});

// Xử lý checkbox "Hiện tại tôi vẫn làm việc ở đây"
const checkboxes = document.querySelectorAll('.experience-checkbox');
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    const popup = this.closest('.experience-popup, .study-popup');
    const endDateInput = popup.querySelector('#experienceEndDate');
    const currentText = popup.querySelector('.experience-date-current');
    
    if (this.checked) {
      endDateInput.style.display = 'none';
      currentText.style.display = 'inline';
      endDateInput.value = '';
    } else {
      endDateInput.style.display = 'inline';
      currentText.style.display = 'none';
    }
  });
});