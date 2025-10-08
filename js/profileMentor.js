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
